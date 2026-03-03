'use strict';
const db = require('../../lib/db');
const { requireAuth } = require('../../lib/auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
    if (!auth) return;

    const result = await db.query(
      `SELECT g.*, cs.total_senhas, cs.liberacao_inicio, cs.liberacao_fim, cs.status AS controle_status,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id) AS total_senhas_emitidas
       FROM giras g
       LEFT JOIN controles_senha cs ON cs.gira_id = g.id
       WHERE g.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });
    return res.status(200).json(result.rows[0]);
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const { titulo, linha, data_inicio, observacoes, status, motivo_cancelamento } = req.body || {};

    if (status === 'CANCELADA' && !motivo_cancelamento) {
      return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'motivo_cancelamento é obrigatório ao cancelar.' });
    }

    const result = await db.query(
      `UPDATE giras
       SET titulo = COALESCE($1, titulo),
           linha = COALESCE($2, linha),
           data_inicio = COALESCE($3, data_inicio),
           observacoes = COALESCE($4, observacoes),
           status = COALESCE($5, status),
           motivo_cancelamento = COALESCE($6, motivo_cancelamento),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [titulo, linha, data_inicio, observacoes, status, motivo_cancelamento, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });

    await db.query(
      `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('GIRA_ATUALIZADA', $1, $2, $3, $4)`,
      [id, auth.id, JSON.stringify(req.body), getIp(req)]
    );

    return res.status(200).json(result.rows[0]);
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const check = await db.query(`SELECT status FROM giras WHERE id = $1`, [id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });
    if (check.rows[0].status !== 'RASCUNHO') {
      return res.status(409).json({ error: 'NAO_PERMITIDO', mensagem: 'Apenas giras em RASCUNHO podem ser excluídas.' });
    }

    await db.query(`DELETE FROM giras WHERE id = $1`, [id]);

    await db.query(
      `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('GIRA_EXCLUIDA', $1, $2, $3, $4)`,
      [id, auth.id, JSON.stringify({ id }), getIp(req)]
    );

    return res.status(204).end();
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
