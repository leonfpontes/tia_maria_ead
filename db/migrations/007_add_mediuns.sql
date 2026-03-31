-- Migration 007: Add mediuns table (PostgreSQL)
CREATE TABLE IF NOT EXISTS mediuns (
  id               SERIAL PRIMARY KEY,
  nome             VARCHAR(255) NOT NULL,
  nome_normalizado VARCHAR(255),
  telefone         VARCHAR(20),
  is_cambone       BOOLEAN NOT NULL DEFAULT FALSE,
  ativo            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mediuns_nome_normalizado ON mediuns (nome_normalizado);
CREATE INDEX IF NOT EXISTS idx_mediuns_ativo ON mediuns (ativo);
