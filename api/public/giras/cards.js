'use strict';
const db = require('../../../server/db');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function mapTipoCardToTemplate(tipoCard) {
  switch (tipoCard) {
    case 'EXU_POMBOGIRA':
      return 'exu_pombogira';
    case 'PRETOS_VELHOS':
      return 'pretos_velhos';
    case 'CABOCLOS_BOIADEIROS':
      return 'caboclos_boiadeiros';
    case 'MALANDROS':
      return 'gira_neutra';
    case 'NAO_HAVERA_GIRA':
      return 'aviso';
    case 'GIRA_MISTA':
    default:
      return 'gira_neutra';
  }
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  try {
    // Janela de exibição: inclui cards a partir de 2 dias atrás para não sumirem imediatamente.
    const minDate = new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString();
    const result = await db.query(
      `SELECT id, titulo, linha, tipo_card, data_inicio, observacoes, status
       FROM giras
       WHERE status = 'PUBLICADA'
         AND data_inicio >= $1
       ORDER BY data_inicio ASC`,
      [minDate]
    );

    const cards = result.rows.map((gira) => {
      const tipo = mapTipoCardToTemplate(gira.tipo_card);
      const data = String(gira.data_inicio).slice(0, 10);
      const isAviso = tipo === 'aviso';

      return {
        id: gira.id,
        tipo,
        data,
        titulo: gira.titulo,
        descricao: gira.observacoes || (isAviso
          ? 'Nesta data não haverá gira. Acompanhe nossas redes para atualizações.'
          : `Gira de ${gira.linha || 'Umbanda'}.`),
        horario: isAviso ? 'Casa fechada' : 'Portões abrem às 19h30',
        badge: isAviso ? 'Aviso' : 'Agenda',
        icone: isAviso ? '⚠' : undefined,
      };
    });

    return res.status(200).json({ cards });
  } catch (err) {
    console.error('public giras cards error', err);
    return res.status(500).json({ error: 'ERRO_INTERNO' });
  }
};
