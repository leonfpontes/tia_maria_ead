'use strict';
const bcrypt = require('bcryptjs');
const db = require('../../../_lib/db');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  const authHeader = req.headers['authorization'] || '';
  const seedSecret = process.env.SEED_SECRET;

  if (!seedSecret || authHeader !== `Bearer ${seedSecret}`) {
    return res.status(401).json({ error: 'NAO_AUTORIZADO', mensagem: 'Seed secret inválido.' });
  }

  const { username, password, role } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'username e password são obrigatórios.' });
  }

  const validRoles = ['ADMIN', 'OPERADOR_PORTA'];
  const adminRole = validRoles.includes(role) ? role : 'ADMIN';

  // Only works if no admins exist
  const countResult = await db.query(`SELECT COUNT(*) AS total FROM admins`);
  const total = parseInt(countResult.rows[0].total, 10);
  if (total > 0) {
    return res.status(409).json({ error: 'JA_EXISTE', mensagem: 'Já existem administradores cadastrados. Use o painel de admin.' });
  }

  const hash = await bcrypt.hash(password, 12);
  const result = await db.query(
    `INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at`,
    [username, hash, adminRole]
  );

  return res.status(201).json({ admin: result.rows[0] });
};
