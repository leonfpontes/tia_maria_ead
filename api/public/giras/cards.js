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

function getSaoPauloYesterdayStartIsoUtc() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);

  // D-1 do projeto: ontem 00:00 em Sao Paulo (BRT), convertido para ISO UTC.
  const startOfTodayInSaoPaulo = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00-03:00`);
  startOfTodayInSaoPaulo.setUTCDate(startOfTodayInSaoPaulo.getUTCDate() - 1);
  return startOfTodayInSaoPaulo.toISOString();
}

function normalizeCardDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const isoPrefix = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoPrefix) {
      return isoPrefix[1];
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  const fallback = new Date(value);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback.toISOString().slice(0, 10);
  }

  return '';
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  try {
    const minDate = getSaoPauloYesterdayStartIsoUtc();
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
      const data = normalizeCardDate(gira.data_inicio);
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
