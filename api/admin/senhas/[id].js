'use strict';
const db = require('../../../server/db');
const { requireAuth } = require('../../../server/auth');
const { normalizePhone } = require('../../../server/phone');
const { normalizeName } = require('../../../server/normalizeName');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

// --- ACTION: status ---
async function handleStatus(req, res, auth, id) {
  const VALID_STATUS = ['ATIVA', 'ATENDIDA', 'NO_SHOW', 'CANCELADA'];
  const { status } = req.body || {};

  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: 'STATUS_INVALIDO', mensagem: `Status deve ser um de: ${VALID_STATUS.join(', ')}` });
  }

  const current = await db.query('SELECT * FROM senhas WHERE id = $1', [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });

  const senha = current.rows[0];

  if (senha.status === 'ATENDIDA' && status === 'ATENDIDA') {
    return res.status(200).json(senha);
  }

  let result;
  if (status === 'ATENDIDA') {
    result = await db.query(
      `UPDATE senhas SET status = $1, atendida_em = NOW(), atendida_por_admin_id = $2 WHERE id = $3 RETURNING *`,
      [status, auth.id, id]
    );
  } else {
    result = await db.query(
      `UPDATE senhas SET status = $1, atendida_em = NULL, atendida_por_admin_id = NULL WHERE id = $2 RETURNING *`,
      [status, id]
    );
  }

  await db.query(
    `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('SENHA_STATUS_ALTERADO', $1, $2, $3, $4)`,
    [id, auth.id, JSON.stringify({ de: senha.status, para: status }), getIp(req)]
  );

  const giraId = result.rows[0].gira_id;
  const controleResult = await db.query(
    'SELECT total_senhas, status FROM controles_senha WHERE gira_id = $1',
    [giraId]
  );

  if (controleResult.rows.length > 0) {
    const controle = controleResult.rows[0];
    if (controle.status !== 'ENCERRADO') {
      const emitidasResult = await db.query(
        `SELECT COUNT(*) AS emitidas_ativas FROM senhas WHERE gira_id = $1 AND status <> 'CANCELADA'`,
        [giraId]
      );
      const emitidasAtivas = parseInt(emitidasResult.rows[0].emitidas_ativas, 10);
      const novoStatus = emitidasAtivas >= Number(controle.total_senhas) ? 'ESGOTADO' : 'ABERTO';
      await db.query(
        `UPDATE controles_senha SET status = $1, updated_at = NOW() WHERE gira_id = $2 AND status <> 'ENCERRADO'`,
        [novoStatus, giraId]
      );
    }
  }

  return res.status(200).json(result.rows[0]);
}

// --- ACTION: checkin ---
async function handleCheckin(req, res, auth, id) {
  const { checkin } = req.body || {};

  if (typeof checkin !== 'boolean') {
    return res.status(400).json({ error: 'PARAM_INVALIDO', mensagem: 'Parâmetro "checkin" (boolean) é obrigatório.' });
  }

  const current = await db.query('SELECT * FROM senhas WHERE id = $1', [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });

  let result;
  if (checkin) {
    result = await db.query('UPDATE senhas SET chegada_em = NOW() WHERE id = $1 RETURNING *', [id]);
  } else {
    result = await db.query('UPDATE senhas SET chegada_em = NULL WHERE id = $1 RETURNING *', [id]);
  }

  await db.query(
    `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('SENHA_CHECKIN', $1, $2, $3, $4)`,
    [id, auth.id, JSON.stringify({ acao: checkin ? 'checkin' : 'undo_checkin' }), getIp(req)]
  );

  return res.status(200).json(result.rows[0]);
}

// --- ACTION: editar ---
async function handleEditar(req, res, auth, id) {
  const current = await db.query('SELECT * FROM senhas WHERE id = $1', [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });
  const senha = current.rows[0];

  const walkInCheck = await db.query(
    `SELECT 1 FROM auditoria WHERE referencia_id = $1 AND tipo = 'WALK_IN_CRIADA' LIMIT 1`,
    [id]
  );
  if (walkInCheck.rows.length === 0) {
    return res.status(403).json({ error: 'NAO_PERMITIDO', mensagem: 'Apenas senhas walk-in podem ser editadas.' });
  }

  const body = req.body || {};
  const { nome, telefone, email, is_preferencial } = body;

  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome é obrigatório (mínimo 2 caracteres).' });
  }

  const telefoneInput = telefone && typeof telefone === 'string' && telefone.trim().length > 0
    ? telefone : senha.telefone;
  const emailInput = typeof email === 'string' ? email.trim() : (senha.email || '');
  const prefInput = typeof is_preferencial === 'boolean' ? is_preferencial : Boolean(senha.is_preferencial);

  let telefoneNorm, nomeNorm;
  try {
    telefoneNorm = telefoneInput === '0000-0000' ? '0000-0000' : normalizePhone(telefoneInput);
    nomeNorm = normalizeName(nome);
  } catch (e) {
    return res.status(400).json({ error: 'DADOS_INVALIDOS', mensagem: e.message });
  }

  if (!nomeNorm || nomeNorm.length < 2) {
    return res.status(400).json({ error: 'NOME_INVALIDO', mensagem: 'Nome inválido após normalização.' });
  }

  const result = await db.query(
    `UPDATE senhas SET nome = $1, telefone = $2, email = $3, nome_normalizado = $4, is_preferencial = $5 WHERE id = $6 RETURNING *`,
    [nome.trim(), telefoneNorm, emailInput, nomeNorm, prefInput, id]
  );

  const antes = { nome: senha.nome, telefone: senha.telefone, email: senha.email, is_preferencial: senha.is_preferencial };
  const depois = { nome: nome.trim(), telefone: telefoneNorm, email: emailInput, is_preferencial: prefInput };

  await db.query(
    `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('WALK_IN_EDITADA', $1, $2, $3, $4)`,
    [id, auth.id, JSON.stringify({ antes, depois }), getIp(req)]
  );

  return res.status(200).json(result.rows[0]);
}

// --- ACTION: atendimento ---
async function handleAtendimento(req, res, auth, id) {
  const body = req.body || {};
  const mediumNome = typeof body.medium_nome === 'string' ? body.medium_nome.trim().slice(0, 255) : null;
  const camboneNome = typeof body.cambone_nome === 'string' ? body.cambone_nome.trim().slice(0, 255) : null;
  const observacao = typeof body.observacao === 'string' ? body.observacao.trim().slice(0, 1000) : null;

  const current = await db.query('SELECT * FROM senhas WHERE id = $1', [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'NAO_ENCONTRADA' });

  const result = await db.query(
    'UPDATE senhas SET medium_nome = $1, cambone_nome = $2, observacao = $3 WHERE id = $4 RETURNING *',
    [mediumNome || null, camboneNome || null, observacao || null, id]
  );

  await db.query(
    `INSERT INTO auditoria (tipo, referencia_id, admin_id, dados, ip) VALUES ('ATENDIMENTO_INFO_ATUALIZADO', $1, $2, $3, $4)`,
    [id, auth.id, JSON.stringify({ medium_nome: mediumNome, cambone_nome: camboneNome, observacao }), getIp(req)]
  );

  return res.status(200).json(result.rows[0]);
}

// --- MAIN HANDLER ---
const ACTIONS = { status: handleStatus, checkin: handleCheckin, editar: handleEditar, atendimento: handleAtendimento };

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'METODO_NAO_PERMITIDO' });

  const auth = requireAuth(req, res, ['ADMIN', 'OPERADOR_PORTA']);
  if (!auth) return;

  const { id, action } = req.query;
  const actionHandler = ACTIONS[action];

  if (!actionHandler) {
    return res.status(400).json({ error: 'ACTION_INVALIDA', mensagem: `action deve ser um de: ${Object.keys(ACTIONS).join(', ')}` });
  }

  try {
    return await actionHandler(req, res, auth, id);
  } catch (err) {
    console.error(`senhas PATCH action=${action} error`, err);
    return res.status(500).json({ error: 'ERRO_INTERNO', mensagem: err.message });
  }
};
