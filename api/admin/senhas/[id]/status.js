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

const VALID_STATUS = ['ATIVA', 'ATENDIDA', 'NO_SHOW', 'CANCELADA'];

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
  if (!auth) return;

  const { id } = req.query;
  const { status } = req.body || {};

  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: 'STATUS_INVALIDO', mensagem: `Status deve ser um de: ${VALID_STATUS.join(', ')}` });
  }

  const current = await db.query(`SELECT * FROM senhas WHERE id = $1`, [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });

  const senha = current.rows[0];

  // Idempotent: already ATENDIDA
  if (senha.status === 'ATENDIDA' && status === 'ATENDIDA') {
    return res.status(200).json(senha);
  }

  let result;
  if (status === 'ATENDIDA') {
    result = await db.query(
      `UPDATE senhas
       SET status = $1, atendida_em = NOW(), atendida_por_admin_id = $2
       WHERE id = $3 RETURNING *`,
      [status, auth.id, id]
    );
  } else {
    result = await db.query(
      `UPDATE senhas
       SET status = $1, atendida_em = NULL, atendida_por_admin_id = NULL
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
  }

  await db.query(
    `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('SENHA_STATUS_ALTERADO', $1, $2, $3, $4)`,
    [id, auth.id, JSON.stringify({ de: senha.status, para: status }), getIp(req)]
  );

  return res.status(200).json(result.rows[0]);
};
