'use strict';
const db = require('../../../../server/db');
const { normalizePhone } = require('../../../../server/phone');
const { normalizeName } = require('../../../../server/normalizeName');
const { checkRateLimit } = require('../../../../server/rateLimit');
const emailService = require('../../../../server/emailer');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return `****-${digits.slice(-4)}`;
}

function normalizeEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('E-mail inválido');
  }
  const normalized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    throw new Error('E-mail inválido');
  }
  return normalized;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  const giraId = req.query.id;
  const ip = getIp(req);

  // Rate limit: 5 req/min per IP
  const rl = await checkRateLimit(db, ip, 'retirada', 5, 60);
  if (!rl.allowed) {
    return res.status(429).json({ error: 'RATE_LIMIT', mensagem: 'Muitas tentativas. Aguarde 1 minuto.' });
  }

  const { nome, telefone, email, is_preferencial } = req.body || {};

  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome inválido.' });
  }
  if (!telefone || typeof telefone !== 'string') {
    return res.status(400).json({ error: 'TELEFONE_INVALIDO', mensagem: 'Telefone inválido.' });
  }
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'EMAIL_INVALIDO', mensagem: 'E-mail é obrigatório.' });
  }
  if (typeof is_preferencial !== 'undefined' && typeof is_preferencial !== 'boolean') {
    return res.status(400).json({ error: 'PREFERENCIAL_INVALIDO', mensagem: 'Campo de preferencial inválido.' });
  }

  let telefoneNorm, nomeNorm, emailNorm;
  try {
    telefoneNorm = normalizePhone(telefone);
    nomeNorm = normalizeName(nome);
    emailNorm = normalizeEmail(email);
  } catch (e) {
    return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: e.message });
  }

  if (!nomeNorm || nomeNorm.length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome inválido após normalização.' });
  }

  const client = await db.getClient();
  try {
    // Check gira
    const giraResult = await db.query(
      `SELECT id, status, data_inicio, COALESCE(linha, titulo, 'Gira') AS tipo FROM giras WHERE id = $1`,
      [giraId]
    );
    if (giraResult.rows.length === 0) {
      return res.status(404).json({ error: 'GIRA_NAO_ENCONTRADA' });
    }
    const gira = giraResult.rows[0];

    if (gira.status === 'CANCELADA') {
      return res.status(423).json({ error: 'CANCELADA', mensagem: 'Esta gira foi cancelada.' });
    }
    if (gira.status !== 'PUBLICADA') {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Retirada de senhas não disponível.' });
    }

    // Check controle
    const ctrlResult = await db.query(
      `SELECT * FROM controles_senha WHERE gira_id = $1`,
      [giraId]
    );
    if (ctrlResult.rows.length === 0) {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Controle de senhas não configurado.' });
    }
    const ctrl = ctrlResult.rows[0];
    const now = new Date();

    if (now < new Date(ctrl.liberacao_inicio)) {
      return res.status(423).json({
        error: 'NAO_LIBERADO',
        mensagem: 'Retirada de senhas ainda não está aberta.',
        liberacao_inicio: ctrl.liberacao_inicio,
      });
    }
    if (ctrl.status === 'ESGOTADO') {
      return res.status(423).json({ error: 'ESGOTADO', mensagem: 'Todas as senhas foram retiradas.' });
    }
    if (ctrl.status === 'ENCERRADO') {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Retirada de senhas encerrada.' });
    }
    if (now >= new Date(gira.data_inicio)) {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'A gira já iniciou.' });
    }
    if (ctrl.liberacao_fim && now >= new Date(ctrl.liberacao_fim)) {
      return res.status(423).json({ error: 'ENCERRADO', mensagem: 'Prazo de retirada encerrado.' });
    }

    // Check duplicate
    const dupResult = await db.query(
      `SELECT numero
       FROM senhas
       WHERE gira_id = $1
         AND nome_normalizado = $2
         AND telefone = $3
         AND status <> 'CANCELADA'`,
      [giraId, nomeNorm, telefoneNorm]
    );
    if (dupResult.rows.length > 0) {
      return res.status(409).json({
        error: 'JA_CADASTRADO',
        mensagem: 'Você já retirou uma senha para esta gira.',
        numero: dupResult.rows[0].numero,
      });
    }

    // Numero sequencial segue monotônico; capacidade considera apenas nao-canceladas.
    const numResult = await db.query(
      `SELECT COALESCE(MAX(numero), 0) + 1 AS proximo FROM senhas WHERE gira_id = $1`,
      [giraId]
    );
    const numero = numResult.rows[0].proximo;

    const emitidasAtivasResult = await db.query(
      `SELECT COUNT(*) AS emitidas_ativas
       FROM senhas
       WHERE gira_id = $1 AND status <> 'CANCELADA'`,
      [giraId]
    );
    const emitidasAtivas = parseInt(emitidasAtivasResult.rows[0].emitidas_ativas, 10);

    // Prevent issuing beyond total considerando cancelamentos.
    if (emitidasAtivas >= ctrl.total_senhas) {
      // Attempt to mark ESGOTADO (best-effort)
      db.query(
        `UPDATE controles_senha SET status = 'ESGOTADO', updated_at = NOW() WHERE gira_id = $1 AND status NOT IN ('ESGOTADO','ENCERRADO')`,
        [giraId]
      ).catch(err => console.error('Failed to mark ESGOTADO', err));
      return res.status(423).json({ error: 'ESGOTADO', mensagem: 'Todas as senhas foram retiradas.' });
    }

    const senhaPreferencial = is_preferencial === true;
    const insertResult = await db.query(
      `INSERT INTO senhas (gira_id, numero, nome, telefone, email, nome_normalizado, is_preferencial, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ATIVA')
       RETURNING numero, nome, email, is_preferencial`,
      [giraId, numero, nome.trim(), telefoneNorm, emailNorm, nomeNorm, senhaPreferencial]
    );

    const senha = insertResult.rows[0];

    // Enviar e-mail de confirmação (não bloquear se falhar)
    try {
      await emailService.sendSenhaConfirmacao({
        email: emailNorm,
        senha: {
          numero: senha.numero,
          nome: senha.nome,
          is_preferencial: senha.is_preferencial,
        },
        gira: {
          tipo: gira.tipo || 'Gira',
          data_inicio: gira.data_inicio,
        },
      });
    } catch (emailError) {
      // Log error but don't block senha creation
      console.error(`Erro ao enviar e-mail para ${emailNorm}:`, emailError.message);
    }

    // Mark ESGOTADO when last active ticket is issued
    if ((emitidasAtivas + 1) >= ctrl.total_senhas) {
      db.query(
        `UPDATE controles_senha SET status = 'ESGOTADO', updated_at = NOW() WHERE gira_id = $1`,
        [giraId]
      ).catch(err => console.error('Failed to mark ESGOTADO', err));
    }

    return res.status(201).json({
      numero: senha.numero,
      nome: senha.nome,
      telefone_mascarado: maskPhone(telefoneNorm),
    });
  } catch (err) {
    console.error('senhas POST error', err);
    return res.status(500).json({ error: 'ERRO_INTERNO', mensagem: err.message });
  }
};
