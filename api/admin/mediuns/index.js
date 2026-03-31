'use strict';
const db = require('../../../server/db');
const { requireAuth } = require('../../../server/auth');
const { normalizeName } = require('../../../server/normalizeName');
const { normalizePhone } = require('../../../server/phone');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const result = await db.query(
      `SELECT id, nome, nome_normalizado, telefone, is_cambone, ativo, created_at, updated_at
       FROM mediuns
       ORDER BY nome_normalizado ASC`
    );
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const { nome, telefone, is_cambone } = req.body || {};

    if (!nome || String(nome).trim().length < 2) {
      return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'Nome é obrigatório (mínimo 2 caracteres).' });
    }

    const nomeClean = String(nome).trim();
    const nomeNormalizado = normalizeName(nomeClean);

    let telefoneNorm = null;
    if (telefone && String(telefone).trim()) {
      try {
        telefoneNorm = normalizePhone(String(telefone).trim());
      } catch (e) {
        return res.status(400).json({ error: 'TELEFONE_INVALIDO', mensagem: e.message });
      }
    }

    const isCambone = is_cambone === true || is_cambone === 1 || is_cambone === '1' || is_cambone === 'true';

    const result = await db.query(
      `INSERT INTO mediuns (nome, nome_normalizado, telefone, is_cambone)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nomeClean, nomeNormalizado, telefoneNorm, isCambone]
    );

    return res.status(201).json(result.rows[0]);
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
