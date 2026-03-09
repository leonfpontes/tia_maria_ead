-- Migration 004 (SQLite): Tipo de card para integração Admin -> Home
-- Data: 2026-03-09

ALTER TABLE giras ADD COLUMN tipo_card TEXT NOT NULL DEFAULT 'GIRA_MISTA';

-- Backfill para registros antigos usando linha/titulo
UPDATE giras
SET tipo_card = CASE
  WHEN LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%exu%' OR LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%pombogira%' THEN 'EXU_POMBOGIRA'
  WHEN LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%preto%velho%' OR LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%pretos%velhos%' THEN 'PRETOS_VELHOS'
  WHEN LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%caboclo%' OR LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%boiadeiro%' THEN 'CABOCLOS_BOIADEIROS'
  WHEN LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%malandro%' THEN 'MALANDROS'
  WHEN LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%nao havera%' OR LOWER(COALESCE(linha, '') || ' ' || COALESCE(titulo, '')) LIKE '%não haverá%' THEN 'NAO_HAVERA_GIRA'
  ELSE 'GIRA_MISTA'
END
WHERE tipo_card IS NULL OR tipo_card = '' OR tipo_card = 'GIRA_MISTA';

CREATE INDEX IF NOT EXISTS idx_giras_status_data_tipo
ON giras(status, data_inicio, tipo_card);
