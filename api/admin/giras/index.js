'use strict';
const db = require('../../lib/db');
const { requireAuth } = require('../../lib/auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
    if (!auth) return;

    const result = await db.query(
      `SELECT g.id, g.titulo, g.linha, g.data_inicio, g.observacoes, g.status, g.motivo_cancelamento,
              cs.total_senhas, cs.liberacao_inicio, cs.liberacao_fim, cs.status AS controle_status,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.status = 'ATIVA') AS emitidas
       FROM giras g
       LEFT JOIN controles_senha cs ON cs.gira_id = g.id
       ORDER BY g.data_inicio DESC`
    );
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const { titulo, linha, data_inicio, observacoes, status } = req.body || {};
    if (!titulo || !data_inicio) {
      return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'titulo e data_inicio são obrigatórios.' });
    }

    const validStatus = ['RASCUNHO','PUBLICADA','ENCERRADA','CANCELADA'];
    const giraStatus = validStatus.includes(status) ? status : 'RASCUNHO';

    const result = await db.query(
      `INSERT INTO giras (titulo, linha, data_inicio, observacoes, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, linha || null, data_inicio, observacoes || null, giraStatus]
    );
    const gira = result.rows[0];

    await db.query(
      `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('GIRA_CRIADA', $1, $2, $3, $4)`,
      [gira.id, auth.id, JSON.stringify(gira), getIp(req)]
    );

    return res.status(201).json(gira);
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
