-- ================================================================
-- SUPABASE SETUP – Purin App
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- Tabelle: Tages-Purin-Historie
CREATE TABLE IF NOT EXISTS purin_history (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT        NOT NULL,
  ts         BIGINT      NOT NULL UNIQUE,
  date       TEXT        NOT NULL,
  items      JSONB       NOT NULL DEFAULT '[]',
  totals     JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: Heutiger Tagesverbrauch (wird überschrieben)
CREATE TABLE IF NOT EXISTS purin_today (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT        NOT NULL UNIQUE,
  ts         BIGINT      NOT NULL,
  items      JSONB       NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: Geh-Historie
CREATE TABLE IF NOT EXISTS walk_history (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT        NOT NULL,
  ts         BIGINT      NOT NULL UNIQUE,
  date       TEXT        NOT NULL,
  data       JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDIZES (für schnelle Abfragen nach user_id)
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_purin_history_user  ON purin_history (user_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_walk_history_user   ON walk_history  (user_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_purin_today_user    ON purin_today   (user_id);

-- ================================================================
-- ROW LEVEL SECURITY (empfohlen für Produktion)
-- Deaktiviert für einfaches Setup – aktiviere wenn gewünscht:
-- ================================================================

-- RLS aktivieren (auskommentiert lassen für einfaches Setup):
-- ALTER TABLE purin_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE walk_history  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purin_today   ENABLE ROW LEVEL SECURITY;

-- Policies (falls RLS aktiviert):
-- CREATE POLICY "user_owns_data" ON purin_history FOR ALL USING (true);
-- CREATE POLICY "user_owns_data" ON walk_history  FOR ALL USING (true);
-- CREATE POLICY "user_owns_data" ON purin_today   FOR ALL USING (true);

-- ================================================================
-- VERIFICATION – diese Queries prüfen ob alles korrekt angelegt ist
-- ================================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('purin_history', 'walk_history', 'purin_today');

-- Erwartete Ausgabe:
--  table_name
-- ─────────────
--  purin_history
--  purin_today
--  walk_history
-- ================================================================
