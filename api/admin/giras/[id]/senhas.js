'use strict';
const db = require('../../../lib/db');
const { requireAuth } = require('../../../lib/auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

function maskPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return `****-${digits.slice(-4)}`;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
    if (!auth) return;

    const isAdmin = auth.role === 'ADMIN';
    const { busca, format } = req.query;

    let queryText = `SELECT id, numero, nome, telefone, status, atendida_em, created_at FROM senhas WHERE gira_id = $1`;
    const params = [id];

    if (busca) {
      params.push(`%${busca}%`);
      queryText += ` AND (nome ILIKE $${params.length} OR numero::text ILIKE $${params.length})`;
    }

    queryText += ` ORDER BY numero ASC`;

    const result = await db.query(queryText, params);
    const rows = result.rows.map(row => ({
      ...row,
      telefone: isAdmin ? row.telefone : maskPhone(row.telefone),
    }));

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="senhas-gira-${id}.csv"`);
      const header = 'numero,nome,telefone,status,created_at\n';
      const body = rows.map(r =>
        `${r.numero},"${r.nome}","${r.telefone}",${r.status},${r.created_at}`
      ).join('\n');
      return res.status(200).send(header + body);
    }

    return res.status(200).json(rows);
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
