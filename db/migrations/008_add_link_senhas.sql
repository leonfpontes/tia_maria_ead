-- Migration 008: Adiciona link externo de senhas às giras (PostgreSQL)
-- Terreiro Tia Maria e Cabocla Jupira
--
-- Permite vincular um URL externo de plataforma de senhas por gira.
-- Campo opcional: giras sem link simplesmente não exibirão o botão de senhas
-- na home pública.

ALTER TABLE giras
  ADD COLUMN IF NOT EXISTS link_senhas VARCHAR(500);
