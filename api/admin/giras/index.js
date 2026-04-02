'use strict';
const db = require('../../../server/db');
const { requireAuth } = require('../../../server/auth');

const VALID_TIPO_CARD = [
  'EXU_POMBOGIRA',
  'PRETOS_VELHOS',
  'CABOCLOS_BOIADEIROS',
  'MALANDROS',
  'GIRA_MISTA',
  'NAO_HAVERA_GIRA'
];

function linhaFromTipoCard(tipoCard) {
  switch (tipoCard) {
    case 'EXU_POMBOGIRA':
      return 'Exus e Pombogiras';
    case 'PRETOS_VELHOS':
      return 'Pretos Velhos';
    case 'CABOCLOS_BOIADEIROS':
      return 'Caboclos e Boiadeiros';
    case 'MALANDROS':
      return 'Malandros';
    case 'NAO_HAVERA_GIRA':
      return 'Não haverá Gira';
    case 'GIRA_MISTA':
    default:
      return 'Gira Mista';
  }
}

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
      `SELECT g.id, g.titulo, g.linha, g.tipo_card, g.data_inicio, g.observacoes, g.status, g.motivo_cancelamento, g.link_senhas,
              cs.total_senhas, cs.liberacao_inicio, cs.liberacao_fim, cs.status AS controle_status,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.status <> 'CANCELADA') AS emitidas,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.status = 'ATENDIDA') AS atendidas,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.status = 'NO_SHOW') AS no_show,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.is_preferencial = true AND s.status <> 'CANCELADA') AS preferenciais,
              (
                SELECT COUNT(DISTINCT a.referencia_id)
                FROM auditoria a
                WHERE a.tipo = 'WALK_IN_CRIADA'
                  AND EXISTS (
                    SELECT 1
                    FROM senhas s
                    WHERE s.id = a.referencia_id
                      AND s.gira_id = g.id
                  )
              ) AS walk_in,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.status = 'ATIVA'
                AND s.is_preferencial = false
                AND NOT EXISTS (SELECT 1 FROM auditoria a WHERE a.tipo = 'WALK_IN_CRIADA' AND a.referencia_id = s.id)
              ) AS aguardando_padrao,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.status = 'ATIVA'
                AND s.is_preferencial = true
                AND NOT EXISTS (SELECT 1 FROM auditoria a WHERE a.tipo = 'WALK_IN_CRIADA' AND a.referencia_id = s.id)
              ) AS aguardando_preferencial,
              (SELECT COUNT(*) FROM senhas s WHERE s.gira_id = g.id AND s.status = 'ATIVA'
                AND EXISTS (SELECT 1 FROM auditoria a WHERE a.tipo = 'WALK_IN_CRIADA' AND a.referencia_id = s.id)
              ) AS aguardando_walkin
       FROM giras g
       LEFT JOIN controles_senha cs ON cs.gira_id = g.id
       ORDER BY g.data_inicio DESC`
    );
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res, ['ADMIN']);
    if (!auth) return;

    const { titulo, tipo_card, data_inicio, observacoes, status, link_senhas } = req.body || {};
    if (!titulo || !data_inicio || !tipo_card) {
      return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: 'titulo, tipo_card e data_inicio são obrigatórios.' });
    }
    if (!VALID_TIPO_CARD.includes(tipo_card)) {
      return res.status(400).json({ error: 'TIPO_INVALIDO', mensagem: 'tipo_card inválido.' });
    }

    if (link_senhas != null && link_senhas !== '') {
      if (!/^https?:\/\/.+/.test(link_senhas) || link_senhas.length > 500) {
        return res.status(400).json({ error: 'LINK_INVALIDO', mensagem: 'link_senhas deve ser uma URL válida iniciando com http:// ou https://' });
      }
    }

    const validStatus = ['RASCUNHO','PUBLICADA','ENCERRADA','CANCELADA'];
    const giraStatus = validStatus.includes(status) ? status : 'RASCUNHO';
    const linha = linhaFromTipoCard(tipo_card);
    const linkSenhasValue = (link_senhas && link_senhas.trim()) ? link_senhas.trim() : null;

    const result = await db.query(
      `INSERT INTO giras (titulo, linha, tipo_card, data_inicio, observacoes, status, link_senhas)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [titulo, linha, tipo_card, data_inicio, observacoes || null, giraStatus, linkSenhasValue]
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
