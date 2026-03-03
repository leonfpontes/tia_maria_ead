'use strict';
const db = require('../../../_lib/db');
const { normalizePhone } = require('../../../_lib/phone');
const { normalizeName } = require('../../../_lib/normalizeName');
const { checkRateLimit } = require('../../../_lib/rateLimit');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return `****-${digits.slice(-4)}`;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  const giraId = req.query.id;
  const ip = getIp(req);

  // Rate limit: 5 req/min per IP
  const rl = await checkRateLimit(db, ip, 'retirada', 5, 60);
  if (!rl.allowed) {
    return res.status(429).json({ error: 'RATE_LIMIT', mensagem: 'Muitas tentativas. Aguarde 1 minuto.' });
  }

  const { nome, telefone } = req.body || {};

  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome inválido.' });
  }
  if (!telefone || typeof telefone !== 'string') {
    return res.status(400).json({ error: 'TELEFONE_INVALIDO', mensagem: 'Telefone inválido.' });
  }

  let telefoneNorm, nomeNorm;
  try {
    telefoneNorm = normalizePhone(telefone);
    nomeNorm = normalizeName(nome);
  } catch (e) {
    return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: e.message });
  }

  if (!nomeNorm || nomeNorm.length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome inválido após normalização.' });
  }

  const client = await db.getClient();
  try {
    // Check gira
    const giraResult = await client.query(
      `SELECT id, status, data_inicio FROM giras WHERE id = $1`,
      [giraId]
    );
    if (giraResult.rows.length === 0) {
      return res.status(404).json({ error: 'GIRA_NAO_ENCONTRADA' });
    }
    const gira = giraResult.rows[0];

    if (gira.status === 'CANCELADA') {
      return res.status(423).json({ error: 'CANCELADA', mensagem: 'Esta gira foi cancelada.' });
    }
    if (gira.status !== 'PUBLICADA') {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Retirada de senhas não disponível.' });
    }

    // Check controle
    const ctrlResult = await client.query(
      `SELECT * FROM controles_senha WHERE gira_id = $1`,
      [giraId]
    );
    if (ctrlResult.rows.length === 0) {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Controle de senhas não configurado.' });
    }
    const ctrl = ctrlResult.rows[0];
    const now = new Date();

    if (now < new Date(ctrl.liberacao_inicio)) {
      return res.status(423).json({
        error: 'NAO_LIBERADO',
        mensagem: 'Retirada de senhas ainda não está aberta.',
        liberacao_inicio: ctrl.liberacao_inicio,
      });
    }
    if (ctrl.status === 'ESGOTADO') {
      return res.status(423).json({ error: 'ESGOTADO', mensagem: 'Todas as senhas foram retiradas.' });
    }
    if (ctrl.status === 'ENCERRADO') {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Retirada de senhas encerrada.' });
    }
    if (now >= new Date(gira.data_inicio)) {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'A gira já iniciou.' });
    }
    if (ctrl.liberacao_fim && now >= new Date(ctrl.liberacao_fim)) {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Prazo de retirada encerrado.' });
    }

    // Check duplicate
    const dupResult = await client.query(
      `SELECT numero FROM senhas WHERE gira_id = $1 AND nome_normalizado = $2 AND telefone = $3`,
      [giraId, nomeNorm, telefoneNorm]
    );
    if (dupResult.rows.length > 0) {
      return res.status(409).json({
        error: 'JA_CADASTRADO',
        mensagem: 'Você já retirou uma senha para esta gira.',
        numero: dupResult.rows[0].numero,
      });
    }

    // Atomic insert with advisory lock per gira to prevent concurrent number collision
    await client.query('BEGIN');
    await client.query(`SELECT pg_advisory_xact_lock($1)`, [parseInt(giraId, 10)]);

    const numResult = await client.query(
      `SELECT COALESCE(MAX(numero), 0) + 1 AS proximo FROM senhas WHERE gira_id = $1`,
      [giraId]
    );
    const numero = numResult.rows[0].proximo;

    // Prevent issuing beyond total
    if (numero > ctrl.total_senhas) {
      await client.query('ROLLBACK');
      // Attempt to mark ESGOTADO in its own operation (best-effort)
      db.query(
        `UPDATE controles_senha SET status = 'ESGOTADO', updated_at = NOW() WHERE gira_id = $1 AND status NOT IN ('ESGOTADO','ENCERRADO')`,
        [giraId]
      ).catch(err => console.error('Failed to mark ESGOTADO', err));
      return res.status(423).json({ error: 'ESGOTADO', mensagem: 'Todas as senhas foram retiradas.' });
    }

    await client.query(
      `INSERT INTO senhas (gira_id, numero, nome, telefone, nome_normalizado, status)
       VALUES ($1, $2, $3, $4, $5, 'ATIVA')`,
      [giraId, numero, nome.trim(), telefoneNorm, nomeNorm]
    );

    // Mark ESGOTADO when last ticket is issued
    if (numero >= ctrl.total_senhas) {
      await client.query(
        `UPDATE controles_senha SET status = 'ESGOTADO', updated_at = NOW() WHERE gira_id = $1`,
        [giraId]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      numero,
      nome: nome.trim(),
      telefone_mascarado: maskPhone(telefoneNorm),
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('senhas POST error', err);
    return res.status(500).json({ error: 'ERRO_INTERNO' });
  } finally {
    client.release();
  }
};
