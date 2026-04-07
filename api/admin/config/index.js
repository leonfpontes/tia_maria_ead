'use strict';
const db = require('../../../server/db');
const { requireAuth } = require('../../../server/auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const admin = requireAuth(req, res, ['ADMIN']);
  if (!admin) return;

  if (req.method === 'GET') {
    const result = await db.query(
      `SELECT chave, valor FROM configuracoes WHERE chave = 'email_confirmacao_ativo'`
    );
    const valor = result.rows.length > 0 ? result.rows[0].valor : 'true';
    return res.status(200).json({ email_confirmacao_ativo: valor === 'true' });
  }

  if (req.method === 'PUT') {
    const { email_confirmacao_ativo } = req.body || {};
    if (typeof email_confirmacao_ativo !== 'boolean') {
      return res.status(400).json({ error: 'CAMPO_INVALIDO', mensagem: 'email_confirmacao_ativo deve ser boolean.' });
    }
    const valor = email_confirmacao_ativo ? 'true' : 'false';
    await db.query(
      `INSERT INTO configuracoes (chave, valor, updated_at)
       VALUES ('email_confirmacao_ativo', $1, NOW())
       ON CONFLICT (chave) DO UPDATE SET valor = $1, updated_at = NOW()`,
      [valor]
    );
    return res.status(200).json({ email_confirmacao_ativo: email_confirmacao_ativo });
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
