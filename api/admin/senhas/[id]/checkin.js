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

  try {
    const current = await db.query(`SELECT * FROM senhas WHERE id = $1`, [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'NAO_ENCONTRADA', mensagem: 'Senha não encontrada.' });
    }

    const senha = current.rows[0];
    if (senha.status !== 'ATIVA') {
      return res.status(409).json({ error: 'STATUS_INVALIDO', mensagem: 'Só é possível fazer check-in em senha ATIVA.' });
    }
    if (senha.chegada_em) {
      return res.status(200).json(senha);
    }

    const result = await db.query(
      `UPDATE senhas
       SET chegada_em = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    await db.query(
      `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip)
       VALUES ('SENHA_CHECKIN', $1, $2, $3, $4)`,
      [id, auth.id, JSON.stringify({ status: result.rows[0].status }), getIp(req)]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('checkin PATCH error', err);
    return res.status(500).json({ error: 'ERRO_INTERNO', mensagem: err.message });
  }
};
