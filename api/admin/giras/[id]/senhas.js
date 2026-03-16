'use strict';
const db = require('../../../../server/db');
const { requireAuth } = require('../../../../server/auth');

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
    const showFullPhone = req.query.telefone_completo === '1';
    const { busca, format } = req.query;

    let queryText = `
      SELECT
        s.id,
        s.numero,
        s.nome,
        s.telefone,
        s.email,
        s.status,
        s.atendida_em,
        s.chegada_em,
        s.created_at,
        s.is_preferencial,
        s.medium_nome,
        s.cambone_nome,
        s.observacao,
        EXISTS (
          SELECT 1
          FROM auditoria a
          WHERE a.referencia_id = s.id
            AND a.tipo = 'WALK_IN_CRIADA'
        ) AS is_walk_in
      FROM senhas s
      WHERE s.gira_id = $1`;
    const params = [id];

    if (busca) {
      params.push(`%${busca}%`);
      queryText += ` AND (s.nome ILIKE $${params.length} OR s.numero::text ILIKE $${params.length})`;
    }

    queryText += `
      ORDER BY
        s.is_preferencial DESC,
        s.numero ASC`;

    const result = await db.query(queryText, params);
    const rows = result.rows.map(row => ({
      ...row,
      telefone: (isAdmin || showFullPhone) ? row.telefone : maskPhone(row.telefone),
    }));

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="senhas-gira-${id}.csv"`);
      const header = 'numero,nome,telefone,status,is_preferencial,created_at\n';
      const body = rows.map(r =>
        `${r.numero},"${r.nome}","${r.telefone}",${r.status},${Boolean(r.is_preferencial)},${r.created_at}`
      ).join('\n');
      return res.status(200).send(header + body);
    }

    return res.status(200).json(rows);
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
