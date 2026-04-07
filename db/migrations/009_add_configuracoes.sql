-- Migration 009: Tabela de configurações do sistema (PostgreSQL)
CREATE TABLE IF NOT EXISTS configuracoes (
  chave      VARCHAR(100) PRIMARY KEY,
  valor      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valor padrão: envio de e-mail habilitado
INSERT INTO configuracoes (chave, valor)
VALUES ('email_confirmacao_ativo', 'true')
ON CONFLICT (chave) DO NOTHING;
