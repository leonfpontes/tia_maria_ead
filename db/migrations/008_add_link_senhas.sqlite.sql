-- Migration 008: Adiciona link externo de senhas às giras (SQLite)
-- Terreiro Tia Maria e Cabocla Jupira
--
-- SQLite não suporta IF NOT EXISTS no ADD COLUMN antes da versão 3.37.
-- O script é seguro para reexecução em ambientes modernos (Node sqlite3 >= 5.x
-- usa SQLite 3.39+). Em versões antigas, executar apenas uma vez.

ALTER TABLE giras ADD COLUMN link_senhas VARCHAR(500);
