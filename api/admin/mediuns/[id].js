'use strict';
const db = require('../../../server/db');
const { requireAuth } = require('../../../server/auth');
const { normalizeName } = require('../../../server/normalizeName');
const { normalizePhone } = require('../../../server/phone');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const result = await db.query(
      `SELECT id, nome, nome_normalizado, telefone, is_cambone, ativo, created_at, updated_at
       FROM mediuns WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADO' });
    return res.status(200).json(result.rows[0]);
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const current = await db.query(`SELECT * FROM mediuns WHERE id = $1`, [id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADO' });

    const { nome, telefone, is_cambone, ativo } = req.body || {};

    let nomeClean = current.rows[0].nome;
    let nomeNormalizado = current.rows[0].nome_normalizado;

    if (typeof nome !== 'undefined') {
      if (!nome || String(nome).trim().length < 2) {
        return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'Nome é obrigatório (mínimo 2 caracteres).' });
      }
      nomeClean = String(nome).trim();
      nomeNormalizado = normalizeName(nomeClean);
    }

    let telefoneNorm = current.rows[0].telefone;
    if (typeof telefone !== 'undefined') {
      if (telefone === null || String(telefone).trim() === '') {
        telefoneNorm = null;
      } else {
        try {
          telefoneNorm = normalizePhone(String(telefone).trim());
        } catch (e) {
          return res.status(400).json({ error: 'TELEFONE_INVALIDO', mensagem: e.message });
        }
      }
    }

    const isCambone = typeof is_cambone !== 'undefined'
      ? (is_cambone === true || is_cambone === 1 || is_cambone === '1' || is_cambone === 'true')
      : current.rows[0].is_cambone;

    const isAtivo = typeof ativo !== 'undefined'
      ? (ativo === true || ativo === 1 || ativo === '1' || ativo === 'true')
      : current.rows[0].ativo;

    const result = await db.query(
      `UPDATE mediuns
       SET nome = $1, nome_normalizado = $2, telefone = $3, is_cambone = $4, ativo = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [nomeClean, nomeNormalizado, telefoneNorm, isCambone, isAtivo, id]
    );

    return res.status(200).json(result.rows[0]);
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const existing = await db.query(`SELECT id FROM mediuns WHERE id = $1`, [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADO' });

    await db.query(`DELETE FROM mediuns WHERE id = $1`, [id]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
