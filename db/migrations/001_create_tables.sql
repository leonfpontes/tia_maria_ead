-- Migration 001: Sistema de Senhas de Atendimento
-- Terreiro Tia Maria e Cabocla Jupira

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) DEFAULT 'ADMIN' CHECK (role IN ('ADMIN','OPERADOR_PORTA')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS giras (
  id                   SERIAL PRIMARY KEY,
  titulo               VARCHAR(255) NOT NULL,
  linha                VARCHAR(100),
  data_inicio          TIMESTAMPTZ NOT NULL,
  observacoes          TEXT,
  status               VARCHAR(20) DEFAULT 'RASCUNHO' CHECK (status IN ('RASCUNHO','PUBLICADA','ENCERRADA','CANCELADA')),
  motivo_cancelamento  TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS controles_senha (
  id               SERIAL PRIMARY KEY,
  gira_id          INT UNIQUE REFERENCES giras(id) ON DELETE CASCADE,
  total_senhas     INT NOT NULL DEFAULT 50,
  liberacao_inicio TIMESTAMPTZ NOT NULL,
  liberacao_fim    TIMESTAMPTZ,
  status           VARCHAR(20) DEFAULT 'AGUARDANDO' CHECK (status IN ('AGUARDANDO','ABERTO','ESGOTADO','ENCERRADO')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS senhas (
  id                    SERIAL PRIMARY KEY,
  gira_id               INT NOT NULL REFERENCES giras(id),
  numero                INT NOT NULL,
  nome                  VARCHAR(255) NOT NULL,
  telefone              VARCHAR(30) NOT NULL,
  nome_normalizado      VARCHAR(255) NOT NULL,
  status                VARCHAR(20) DEFAULT 'ATIVA' CHECK (status IN ('ATIVA','ATENDIDA','NO_SHOW','CANCELADA')),
  atendida_em           TIMESTAMPTZ,
  atendida_por_admin_id INT REFERENCES admins(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (gira_id, numero),
  UNIQUE (gira_id, nome_normalizado, telefone)
);

CREATE TABLE IF NOT EXISTS auditoria (
  id            SERIAL PRIMARY KEY,
  tipo          VARCHAR(50) NOT NULL,
  referencia_id INT,
  admin_id      INT REFERENCES admins(id),
  dados         JSONB,
  ip            VARCHAR(45),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rate_limits (
  id            SERIAL PRIMARY KEY,
  chave         VARCHAR(255) NOT NULL,
  endpoint      VARCHAR(100) NOT NULL,
  contagem      INT DEFAULT 1,
  janela_inicio TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (chave, endpoint)
);
