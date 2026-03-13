'use strict';
const db = require('../../../../server/db');
const { requireAuth } = require('../../../../server/auth');

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
  const body = req.body || {};

  const mediumNome = typeof body.medium_nome === 'string' ? body.medium_nome.trim().slice(0, 255) : null;
  const camboneNome = typeof body.cambone_nome === 'string' ? body.cambone_nome.trim().slice(0, 255) : null;
  const observacao = typeof body.observacao === 'string' ? body.observacao.trim().slice(0, 1000) : null;

  const current = await db.query('SELECT * FROM senhas WHERE id = $1', [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });

  const result = await db.query(
    `UPDATE senhas SET medium_nome = $1, cambone_nome = $2, observacao = $3 WHERE id = $4 RETURNING *`,
    [mediumNome || null, camboneNome || null, observacao || null, id]
  );

  await db.query(
    `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('ATENDIMENTO_INFO_ATUALIZADO', $1, $2, $3, $4)`,
    [id, auth.id, JSON.stringify({ medium_nome: mediumNome, cambone_nome: camboneNome, observacao }), getIp(req)]
  );

  return res.status(200).json(result.rows[0]);
};
