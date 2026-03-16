'use strict';
const db = require('../../../../server/db');
const { requireAuth } = require('../../../../server/auth');
const { normalizePhone } = require('../../../../server/phone');
const { normalizeName } = require('../../../../server/normalizeName');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
  if (!auth) return;

  const { id } = req.query;

  // Verificar que a senha existe
  const current = await db.query('SELECT * FROM senhas WHERE id = $1', [id]);
  if (current.rows.length === 0) {
    return res.status(404).json({ error: 'NAO_ENCONTRADA' });
  }
  const senha = current.rows[0];

  // Verificar que é walk-in (via auditoria)
  const walkInCheck = await db.query(
    `SELECT 1 FROM auditoria WHERE referencia_id = $1 AND tipo = 'WALK_IN_CRIADA' LIMIT 1`,
    [id]
  );
  if (walkInCheck.rows.length === 0) {
    return res.status(403).json({ error: 'NAO_PERMITIDO', mensagem: 'Apenas senhas walk-in podem ser editadas.' });
  }

  const body = req.body || {};
  const { nome, telefone, email, is_preferencial } = body;

  // Nome é obrigatório
  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome é obrigatório (mínimo 2 caracteres).' });
  }

  const telefoneInput = telefone && typeof telefone === 'string' && telefone.trim().length > 0
    ? telefone
    : senha.telefone; // manter o atual se não informado
  const emailInput = typeof email === 'string' ? email.trim() : (senha.email || '');
  const prefInput = typeof is_preferencial === 'boolean' ? is_preferencial : Boolean(senha.is_preferencial);

  let telefoneNorm;
  let nomeNorm;
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
    const result = await db.query(
      `UPDATE senhas
       SET nome = $1, telefone = $2, email = $3, nome_normalizado = $4, is_preferencial = $5
       WHERE id = $6
       RETURNING *`,
      [nome.trim(), telefoneNorm, emailInput, nomeNorm, prefInput, id]
    );

    const antes = { nome: senha.nome, telefone: senha.telefone, email: senha.email, is_preferencial: senha.is_preferencial };
    const depois = { nome: nome.trim(), telefone: telefoneNorm, email: emailInput, is_preferencial: prefInput };

    await db.query(
      `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip)
       VALUES ('WALK_IN_EDITADA', $1, $2, $3, $4)`,
      [id, auth.id, JSON.stringify({ antes, depois }), getIp(req)]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('editar PATCH error', err);
    return res.status(500).json({ error: 'ERRO_INTERNO', mensagem: err.message });
  }
};
