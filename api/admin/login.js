'use strict';
const bcrypt = require('bcryptjs');
const db = require('../../_lib/db');
const { signToken } = require('../../_lib/auth');
const { checkRateLimit } = require('../../_lib/rateLimit');

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

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  try {
    const ip = getIp(req);
    
    // Rate limit check
    let rl;
    try {
      rl = await checkRateLimit(db, ip, 'admin_login', 10, 300);
    } catch (e) {
      console.error('[login] Rate limit check failed:', e.message);
      // Continue without rate limit if check fails
      rl = { allowed: true };
    }
    
    if (!rl.allowed) {
      return res.status(429).json({ error: 'RATE_LIMIT', mensagem: 'Muitas tentativas. Aguarde 5 minutos.' });
    }

    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'Username e senha são obrigatórios.' });
    }

    // Query database
    let result;
    try {
      result = await db.query(`SELECT * FROM admins WHERE username = $1`, [username]);
    } catch (e) {
      console.error('[login] Database query failed:', e.message);
      return res.status(500).json({ error: 'DATABASE_ERROR', mensagem: 'Erro ao acessar banco de dados.' });
    }

    const admin = result.rows[0];

    // Always run bcrypt compare to prevent timing-based username enumeration
    const dummyHash = '$2a$12$invalidhashfortimingprotectiononly000000000000000000000';
    let passwordMatches;
    try {
      passwordMatches = await bcrypt.compare(password, admin ? admin.password_hash : dummyHash);
    } catch (e) {
      console.error('[login] Bcrypt compare failed:', e.message);
      return res.status(500).json({ error: 'AUTH_ERROR', mensagem: 'Erro ao validar credenciais.' });
    }

    if (!admin || !passwordMatches) {
      try {
        await db.query(
          `INSERT INTO auditoria (tipo, dados, ip) VALUES ('LOGIN_FALHOU', $1, $2)`,
          [JSON.stringify({ username }), ip]
        );
      } catch (e) {
        console.error('[login] Audit log (failed) error:', e.message);
      }
      return res.status(401).json({ error: 'CREDENCIAIS_INVALIDAS', mensagem: 'Usuário ou senha incorretos.' });
    }

    // Sign token
    let token;
    try {
      token = signToken({ id: admin.id, username: admin.username, role: admin.role });
    } catch (e) {
      console.error('[login] Token signing failed:', e.message);
      return res.status(500).json({ error: 'TOKEN_ERROR', mensagem: 'Erro ao gerar token.' });
    }

    // Audit log success
    try {
      await db.query(
        `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('LOGIN_SUCESSO', $1, $1, $2, $3)`,
        [admin.id, JSON.stringify({ username }), ip]
      );
    } catch (e) {
      console.error('[login] Audit log (success) error:', e.message);
    }

    return res.status(200).json({
      token,
      admin: { id: admin.id, username: admin.username, role: admin.role },
    });

  } catch (err) {
    console.error('[login] Unexpected error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', mensagem: 'Erro interno do servidor.' });
  }
};
