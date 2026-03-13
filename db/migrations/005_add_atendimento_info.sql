-- Migration 005: Adicionar campos de atendimento à tabela senhas
-- Nome do médium, cambone e observação registrados no momento do atendimento

ALTER TABLE senhas ADD COLUMN IF NOT EXISTS medium_nome VARCHAR(255);
ALTER TABLE senhas ADD COLUMN IF NOT EXISTS cambone_nome VARCHAR(255);
ALTER TABLE senhas ADD COLUMN IF NOT EXISTS observacao TEXT;
