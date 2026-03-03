'use strict';
const db = require('../../_lib/db');
const { requireAuth } = require('../../_lib/auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { giraId } = req.query;

  if (req.method === 'GET') {
    const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
    if (!auth) return;

    const result = await db.query(
      `SELECT * FROM controles_senha WHERE gira_id = $1`,
      [giraId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADO' });
    return res.status(200).json(result.rows[0]);
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const { action, total_senhas, liberacao_inicio, liberacao_fim } = req.body || {};

    // Handle special actions
    if (action === 'liberar') {
      const result = await db.query(
        `UPDATE controles_senha SET status = 'ABERTO', liberacao_inicio = NOW(), updated_at = NOW()
         WHERE gira_id = $1 RETURNING *`,
        [giraId]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADO' });
      await db.query(
        `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('CONTROLE_LIBERADO', $1, $2, $3, $4)`,
        [giraId, auth.id, JSON.stringify({ action }), getIp(req)]
      );
      return res.status(200).json(result.rows[0]);
    }

    if (action === 'encerrar') {
      const result = await db.query(
        `UPDATE controles_senha SET status = 'ENCERRADO', updated_at = NOW()
         WHERE gira_id = $1 RETURNING *`,
        [giraId]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADO' });
      await db.query(
        `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('CONTROLE_ENCERRADO', $1, $2, $3, $4)`,
        [giraId, auth.id, JSON.stringify({ action }), getIp(req)]
      );
      return res.status(200).json(result.rows[0]);
    }

    // Upsert controle
    if (!liberacao_inicio) {
      return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'liberacao_inicio é obrigatório.' });
    }

    // Cannot reduce total_senhas below emitidas
    if (total_senhas !== undefined) {
      const emitidasResult = await db.query(
        `SELECT COUNT(*) AS emitidas FROM senhas WHERE gira_id = $1`,
        [giraId]
      );
      const emitidas = parseInt(emitidasResult.rows[0].emitidas, 10);
      if (total_senhas < emitidas) {
        return res.status(409).json({
          error: 'TOTAL_ABAIXO_EMITIDAS',
          mensagem: `Não é possível reduzir o total para ${total_senhas}. Já foram emitidas ${emitidas} senhas.`,
        });
      }
    }

    const result = await db.query(
      `INSERT INTO controles_senha (gira_id, total_senhas, liberacao_inicio, liberacao_fim)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (gira_id) DO UPDATE
         SET total_senhas = COALESCE($2, controles_senha.total_senhas),
             liberacao_inicio = COALESCE($3, controles_senha.liberacao_inicio),
             liberacao_fim = CASE WHEN $4::timestamptz IS NOT NULL THEN $4::timestamptz ELSE controles_senha.liberacao_fim END,
             updated_at = NOW()
       RETURNING *`,
      [giraId, total_senhas || 50, liberacao_inicio, liberacao_fim || null]
    );

    await db.query(
      `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('CONTROLE_ATUALIZADO', $1, $2, $3, $4)`,
      [giraId, auth.id, JSON.stringify(req.body), getIp(req)]
    );

    return res.status(200).json(result.rows[0]);
  }

  return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });
};
