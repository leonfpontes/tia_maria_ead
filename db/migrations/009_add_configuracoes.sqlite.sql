-- Migration 009: Tabela de configurações do sistema (SQLite)
CREATE TABLE IF NOT EXISTS configuracoes (
  chave      TEXT PRIMARY KEY,
  valor      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Valor padrão: envio de e-mail habilitado
INSERT OR IGNORE INTO configuracoes (chave, valor)
VALUES ('email_confirmacao_ativo', 'true');
