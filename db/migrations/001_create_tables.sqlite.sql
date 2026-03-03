-- Migration SQLite local: Sistema de Senhas de Atendimento

CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT DEFAULT 'ADMIN' CHECK (role IN ('ADMIN','OPERADOR_PORTA')),
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS giras (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo               TEXT NOT NULL,
  linha                TEXT,
  data_inicio          TEXT NOT NULL,
  observacoes          TEXT,
  status               TEXT DEFAULT 'RASCUNHO' CHECK (status IN ('RASCUNHO','PUBLICADA','ENCERRADA','CANCELADA')),
  motivo_cancelamento  TEXT,
  created_at           TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at           TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS controles_senha (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  gira_id          INTEGER UNIQUE REFERENCES giras(id) ON DELETE CASCADE,
  total_senhas     INTEGER NOT NULL DEFAULT 50,
  liberacao_inicio TEXT NOT NULL,
  liberacao_fim    TEXT,
  status           TEXT DEFAULT 'AGUARDANDO' CHECK (status IN ('AGUARDANDO','ABERTO','ESGOTADO','ENCERRADO')),
  created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS senhas (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  gira_id               INTEGER NOT NULL REFERENCES giras(id),
  numero                INTEGER NOT NULL,
  nome                  TEXT NOT NULL,
  telefone              TEXT NOT NULL,
  nome_normalizado      TEXT NOT NULL,
  status                TEXT DEFAULT 'ATIVA' CHECK (status IN ('ATIVA','ATENDIDA','NO_SHOW','CANCELADA')),
  atendida_em           TEXT,
  atendida_por_admin_id INTEGER REFERENCES admins(id),
  created_at            TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (gira_id, numero),
  UNIQUE (gira_id, nome_normalizado, telefone)
);

CREATE TABLE IF NOT EXISTS auditoria (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo          TEXT NOT NULL,
  referencia_id INTEGER,
  admin_id      INTEGER REFERENCES admins(id),
  dados         TEXT,
  ip            TEXT,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rate_limits (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  chave         TEXT NOT NULL,
  endpoint      TEXT NOT NULL,
  contagem      INTEGER DEFAULT 1,
  janela_inicio TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (chave, endpoint)
);