-- Migration 005: Adicionar campos de atendimento à tabela senhas
-- Nome do médium, cambone e observação registrados no momento do atendimento

ALTER TABLE senhas ADD COLUMN medium_nome TEXT;
ALTER TABLE senhas ADD COLUMN cambone_nome TEXT;
ALTER TABLE senhas ADD COLUMN observacao TEXT;
