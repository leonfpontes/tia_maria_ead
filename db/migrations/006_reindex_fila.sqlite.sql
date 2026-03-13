-- Migration 006: Recriar indice de fila para nova ordenacao (numero em vez de chegada_em)
DROP INDEX IF EXISTS idx_senhas_fila;
CREATE INDEX IF NOT EXISTS idx_senhas_fila ON senhas (gira_id, is_preferencial DESC, numero ASC);
