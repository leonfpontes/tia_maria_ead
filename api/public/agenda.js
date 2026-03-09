'use strict';
const db = require('../../server/db');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  try {
    // Next PUBLICADA gira with a controle configured
    const giraResult = await db.query(
      `SELECT g.id, g.titulo, g.linha, g.data_inicio, g.observacoes, g.status,
              cs.total_senhas, cs.liberacao_inicio, cs.liberacao_fim, cs.status AS controle_status
       FROM giras g
       JOIN controles_senha cs ON cs.gira_id = g.id
       WHERE g.status = 'PUBLICADA' AND g.data_inicio > NOW()
       ORDER BY g.data_inicio ASC
       LIMIT 1`
    );

    if (giraResult.rows.length === 0) {
      return res.status(200).json({ gira: null, controle: null, emitidas: 0, proxima_liberacao: null });
    }

    const row = giraResult.rows[0];
    const now = new Date();

    // Emitidas para contador publico: desconsidera canceladas.
    const emitidasResult = await db.query(
      `SELECT COUNT(*) AS emitidas
       FROM senhas
       WHERE gira_id = $1 AND status <> 'CANCELADA'`,
      [row.id]
    );
    const emitidas = parseInt(emitidasResult.rows[0].emitidas, 10);

    // Next gira after current for proxima_liberacao
    const proximaResult = await db.query(
      `SELECT cs.liberacao_inicio
       FROM giras g
       JOIN controles_senha cs ON cs.gira_id = g.id
       WHERE g.status = 'PUBLICADA' AND g.data_inicio > $1
       ORDER BY g.data_inicio ASC
       LIMIT 1`,
      [row.data_inicio]
    );
    const proxima_liberacao = proximaResult.rows[0]?.liberacao_inicio || null;

    return res.status(200).json({
      gira: {
        id: row.id,
        titulo: row.titulo,
        linha: row.linha,
        data_inicio: row.data_inicio,
        observacoes: row.observacoes,
        status: row.status,
      },
      controle: {
        total_senhas: row.total_senhas,
        liberacao_inicio: row.liberacao_inicio,
        liberacao_fim: row.liberacao_fim,
        status: row.controle_status,
      },
      emitidas,
      proxima_liberacao,
    });
  } catch (err) {
    console.error('agenda error', err);
    return res.status(500).json({ error: 'ERRO_INTERNO' });
  }
};
