-- Migration 003: Campos de fila por chegada e atendimento preferencial
-- Data: 2026-03-09

ALTER TABLE senhas
ADD COLUMN chegada_em TIMESTAMPTZ;

ALTER TABLE senhas
ADD COLUMN is_preferencial BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_senhas_fila ON senhas(gira_id, is_preferencial DESC, chegada_em ASC);

COMMENT ON COLUMN senhas.chegada_em IS 'Timestamp de check-in físico na porta';
COMMENT ON COLUMN senhas.is_preferencial IS 'Indica se a senha tem direito a prioridade de atendimento';
