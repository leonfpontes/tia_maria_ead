-- Migration 002: Adicionar campo email na tabela senhas (SQLite)
-- Data: 2026-03-09
-- Descrição: Adiciona coluna email para permitir envio de confirmação por e-mail

ALTER TABLE senhas
ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';

-- SQLite: Criar índice para buscas por e-mail
CREATE INDEX IF NOT EXISTS idx_senhas_email ON senhas(email);
