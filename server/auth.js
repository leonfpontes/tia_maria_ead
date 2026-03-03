'use strict';
const jwt = require('jsonwebtoken');

const SECRET = () => {
  const s = process.env.JWT_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET não configurado. Configure a variável de ambiente.');
    }
    console.warn('[auth] JWT_SECRET não configurado. Use apenas em desenvolvimento!');
    return 'dev-secret-change-me';
  }
  return s;
};

function signToken(payload) {
  return jwt.sign(payload, SECRET(), { expiresIn: '8h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET());
  } catch {
    return null;
  }
}

/**
 * Middleware-style auth check.
 * Returns decoded payload on success, or sends 401/403 and returns null.
 */
function requireAuth(req, res, requiredRoles = []) {
  let token = null;

  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) {
    res.status(401).json({ error: 'NAO_AUTENTICADO', mensagem: 'Token não fornecido.' });
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'TOKEN_INVALIDO', mensagem: 'Token inválido ou expirado.' });
    return null;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(payload.role)) {
    res.status(403).json({ error: 'SEM_PERMISSAO', mensagem: 'Permissão insuficiente.' });
    return null;
  }

  return payload;
}

module.exports = { signToken, verifyToken, requireAuth };
