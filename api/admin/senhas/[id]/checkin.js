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
  const { checkin } = req.body || {};

  if (typeof checkin !== 'boolean') {
    return res.status(400).json({ error: 'PARAM_INVALIDO', mensagem: 'Parâmetro "checkin" (boolean) é obrigatório.' });
  }

  const current = await db.query('SELECT * FROM senhas WHERE id = $1', [id]);
  if (current.rows.length === 0) {
    return res.status(404).json({ error: 'NAO_ENCONTRADA' });
  }

  let result;
  if (checkin) {
    result = await db.query(
      'UPDATE senhas SET chegada_em = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
  } else {
    result = await db.query(
      'UPDATE senhas SET chegada_em = NULL WHERE id = $1 RETURNING *',
      [id]
    );
  }

  await db.query(
    `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip)
     VALUES ('SENHA_CHECKIN', $1, $2, $3, $4)`,
    [id, auth.id, JSON.stringify({ acao: checkin ? 'checkin' : 'undo_checkin' }), getIp(req)]
  );

  return res.status(200).json(result.rows[0]);
};
