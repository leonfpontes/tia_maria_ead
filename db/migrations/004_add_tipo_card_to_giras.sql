-- Migration 004: Tipo de card para integração Admin -> Home
-- Data: 2026-03-09

ALTER TABLE giras
ADD COLUMN IF NOT EXISTS tipo_card VARCHAR(30) NOT NULL DEFAULT 'GIRA_MISTA';

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'giras_tipo_card_check'
      AND conrelid = 'giras'::regclass
  ) THEN
    ALTER TABLE giras
      ADD CONSTRAINT giras_tipo_card_check
      CHECK (tipo_card IN (
        'EXU_POMBOGIRA',
        'PRETOS_VELHOS',
        'CABOCLOS_BOIADEIROS',
        'MALANDROS',
        'GIRA_MISTA',
        'NAO_HAVERA_GIRA'
      ));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_giras_status_data_tipo
ON giras(status, data_inicio, tipo_card);

COMMENT ON COLUMN giras.tipo_card IS 'Tipo de card para renderizacao automatica da home';
