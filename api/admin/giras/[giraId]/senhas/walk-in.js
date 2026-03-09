'use strict';
const db = require('../../../../../server/db');
const { requireAuth } = require('../../../../../server/auth');
const { normalizePhone } = require('../../../../../server/phone');
const { normalizeName } = require('../../../../../server/normalizeName');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return `****-${digits.slice(-4)}`;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  // Autenticação: apenas ADMIN ou OPERADOR_PORTA
  const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
  if (!auth) return;

  const { giraId } = req.query;
  const { nome, telefone, email, is_preferencial } = req.body || {};

  // Validação: apenas nome é obrigatório
  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome é obrigatório (mínimo 2 caracteres).' });
  }

  // Defaults para campos opcionais
  const telefoneInput = telefone && typeof telefone === 'string' && telefone.trim().length > 0 
    ? telefone 
    : '0000-0000';
  const emailInput = email && typeof email === 'string' && email.trim().length > 0 
    ? email 
    : '';
  const senhaPreferencial = is_preferencial === true;

  let telefoneNorm, nomeNorm;
  try {
    // Normalizar telefone apenas se não for o default
    if (telefoneInput === '0000-0000') {
      telefoneNorm = '0000-0000';
    } else {
      telefoneNorm = normalizePhone(telefoneInput);
    }
    nomeNorm = normalizeName(nome);
  } catch (e) {
    return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: e.message });
  }

  if (!nomeNorm || nomeNorm.length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome inválido após normalização.' });
  }

  try {
    // Verificar se gira existe (sem validar status)
    const giraResult = await db.query(`SELECT id FROM giras WHERE id = $1`, [giraId]);
    if (giraResult.rows.length === 0) {
      return res.status(404).json({ error: 'GIRA_NAO_ENCONTRADA', mensagem: 'Gira não encontrada.' });
    }

    // Gerar próximo número sequencial
    const numResult = await db.query(
      `SELECT COALESCE(MAX(numero), 0) + 1 AS proximo FROM senhas WHERE gira_id = $1`,
      [giraId]
    );
    const numero = numResult.rows[0].proximo;

    // Inserir senha com check-in automático (chegada_em = NOW())
    const insertResult = await db.query(
      `INSERT INTO senhas (gira_id, numero, nome, telefone, email, nome_normalizado, is_preferencial, status, chegada_em)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ATIVA', NOW())
       RETURNING id, numero, nome, telefone, email, status, is_preferencial, chegada_em`,
      [giraId, numero, nome.trim(), telefoneNorm, emailInput, nomeNorm, senhaPreferencial]
    );

    const senha = insertResult.rows[0];

    // Auditoria: registrar criação de walk-in
    await db.query(
      `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip)
       VALUES ('WALK_IN_CRIADA', $1, $2, $3, $4)`,
      [
        senha.id,
        auth.id,
        JSON.stringify({ numero: senha.numero, nome: senha.nome, is_preferencial: senha.is_preferencial }),
        getIp(req)
      ]
    );

    // Resposta com dados da senha criada
    return res.status(201).json({
      numero: senha.numero,
      nome: senha.nome,
      telefone_mascarado: maskPhone(senha.telefone),
      status: senha.status,
      chegada_em: senha.chegada_em,
      is_preferencial: senha.is_preferencial
    });

  } catch (err) {
    console.error('walk-in POST error', err);
    return res.status(500).json({ error: 'ERRO_INTERNO', mensagem: err.message });
  }
};
