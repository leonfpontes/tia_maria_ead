-- Migration 003: Campos de fila por chegada e atendimento preferencial (SQLite)
-- Data: 2026-03-09

ALTER TABLE senhas
ADD COLUMN chegada_em TEXT;

ALTER TABLE senhas
ADD COLUMN is_preferencial INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_senhas_fila ON senhas(gira_id, is_preferencial DESC, chegada_em ASC);
