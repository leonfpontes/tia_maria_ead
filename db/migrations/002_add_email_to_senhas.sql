-- Migration 002: Adicionar campo email na tabela senhas
-- Data: 2026-03-09
-- Descrição: Adiciona coluna email para permitir envio de confirmação por e-mail

ALTER TABLE senhas
ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';

-- Criar índice para buscas por e-mail
CREATE INDEX idx_senhas_email ON senhas(email);

-- Comentário da coluna
COMMENT ON COLUMN senhas.email IS 'E-mail do consulente para envio de confirmação';
