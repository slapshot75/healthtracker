-- ================================================================
-- MIGRATION 2026-11-09: Indoor-Rad-Historie
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- Nur Änderungen dieser Migration, nichts anderes.
-- ================================================================

-- Tabelle: Indoor-Rad-Historie
CREATE TABLE IF NOT EXISTS indoor_history (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT        NOT NULL,
  ts         BIGINT      NOT NULL UNIQUE,
  date       TEXT        NOT NULL,
  data       JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Abfragen nach user_id
CREATE INDEX IF NOT EXISTS idx_indoor_history_user ON indoor_history (user_id, ts DESC);

-- Zugriff nur mit Login (Rolle "authenticated"), wie in supabase/2026-11-09-auth-rls.sql
ALTER TABLE indoor_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS authenticated_full_access ON indoor_history;
CREATE POLICY authenticated_full_access ON indoor_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Prüfung: Tabelle vorhanden?
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'indoor_history';
