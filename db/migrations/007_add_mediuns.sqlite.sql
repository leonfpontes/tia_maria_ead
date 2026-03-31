-- Migration 007: Add mediuns table (SQLite)
CREATE TABLE IF NOT EXISTS mediuns (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  nome             TEXT NOT NULL,
  nome_normalizado TEXT,
  telefone         TEXT,
  is_cambone       INTEGER NOT NULL DEFAULT 0,
  ativo            INTEGER NOT NULL DEFAULT 1,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mediuns_nome_normalizado ON mediuns (nome_normalizado);
CREATE INDEX IF NOT EXISTS idx_mediuns_ativo ON mediuns (ativo);
