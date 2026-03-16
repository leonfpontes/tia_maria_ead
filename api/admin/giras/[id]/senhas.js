'use strict';
const db = require('../../../../server/db');
const { requireAuth } = require('../../../../server/auth');
const { normalizePhone } = require('../../../../server/phone');
const { normalizeName } = require('../../../../server/normalizeName');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

function maskPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return `****-${digits.slice(-4)}`;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
    if (!auth) return;

    const isAdmin = auth.role === 'ADMIN';
    const showFullPhone = req.query.telefone_completo === '1';
    const { busca, format } = req.query;

    let queryText = `
      SELECT
        s.id,
        s.numero,
        s.nome,
        s.telefone,
        s.email,
        s.status,
        s.atendida_em,
        s.chegada_em,
        s.created_at,
        s.is_preferencial,
        s.medium_nome,
        s.cambone_nome,
        s.observacao,
        EXISTS (
          SELECT 1
          FROM auditoria a
          WHERE a.referencia_id = s.id
            AND a.tipo = 'WALK_IN_CRIADA'
        ) AS is_walk_in
      FROM senhas s
      WHERE s.gira_id = $1`;
    const params = [id];

    if (busca) {
      params.push(`%${busca}%`);
      queryText += ` AND (s.nome ILIKE $${params.length} OR s.numero::text ILIKE $${params.length})`;
    }

    queryText += `
      ORDER BY
        s.is_preferencial DESC,
        s.numero ASC`;

    const result = await db.query(queryText, params);
    const rows = result.rows.map(row => ({
      ...row,
      telefone: (isAdmin || showFullPhone) ? row.telefone : maskPhone(row.telefone),
    }));

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="senhas-gira-${id}.csv"`);
      const header = 'numero,nome,telefone,status,is_preferencial,created_at\n';
      const body = rows.map(r =>
        `${r.numero},"${r.nome}","${r.telefone}",${r.status},${Boolean(r.is_preferencial)},${r.created_at}`
      ).join('\n');
      return res.status(200).send(header + body);
    }

    return res.status(200).json(rows);
  }

  // --- POST: Walk-in ---
  if (req.method === 'POST') {
    const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
    if (!auth) return;

    const giraId = id;
    const { nome, telefone, email, is_preferencial } = req.body || {};

    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome é obrigatório (mínimo 2 caracteres).' });
    }

    const telefoneInput = telefone && typeof telefone === 'string' && telefone.trim().length > 0
      ? telefone : '0000-0000';
    const emailInput = email && typeof email === 'string' && email.trim().length > 0
      ? email : '';
    const senhaPreferencial = is_preferencial === true;

    let telefoneNorm, nomeNorm;
    try {
      telefoneNorm = telefoneInput === '0000-0000' ? '0000-0000' : normalizePhone(telefoneInput);
      nomeNorm = normalizeName(nome);
    } catch (e) {
      return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: e.message });
    }

    if (!nomeNorm || nomeNorm.length < 2) {
      return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome inválido após normalização.' });
    }

    try {
      const giraResult = await db.query('SELECT id FROM giras WHERE id = $1', [giraId]);
      if (giraResult.rows.length === 0) {
        return res.status(404).json({ error: 'GIRA_NAO_ENCONTRADA', mensagem: 'Gira não encontrada.' });
      }

      const numResult = await db.query(
        'SELECT COALESCE(MAX(numero), 0) + 1 AS proximo FROM senhas WHERE gira_id = $1',
        [giraId]
      );
      const numero = numResult.rows[0].proximo;

      const insertResult = await db.query(
        `INSERT INTO senhas (gira_id, numero, nome, telefone, email, nome_normalizado, is_preferencial, status, chegada_em)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ATIVA', NOW())
         RETURNING id, numero, nome, telefone, email, status, is_preferencial`,
        [giraId, numero, nome.trim(), telefoneNorm, emailInput, nomeNorm, senhaPreferencial]
      );

      const senha = insertResult.rows[0];

      await db.query(
        `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('WALK_IN_CRIADA', $1, $2, $3, $4)`,
        [senha.id, auth.id, JSON.stringify({ numero: senha.numero, nome: senha.nome, is_preferencial: senha.is_preferencial }), getIp(req)]
      );

      return res.status(201).json({
        numero: senha.numero,
        nome: senha.nome,
        telefone_mascarado: maskPhone(senha.telefone),
        status: senha.status,
        is_preferencial: senha.is_preferencial
      });
    } catch (err) {
      console.error('walk-in POST error', err);
      return res.status(500).json({ error: 'ERRO_INTERNO', mensagem: err.message });
    }
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
