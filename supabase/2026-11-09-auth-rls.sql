-- ================================================================
-- MIGRATION 2026-11-09: Row Level Security nur für angemeldete Nutzer
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- Voraussetzung (vorher im Dashboard, sonst kann niemand sich anmelden):
--   1. Authentication → Users → "Add user" → Passwort-Benutzer anlegen
--      (E-Mail als bestätigt markieren)
--   2. Authentication → Sign In / Providers → Email: "Allow new users to sign up"
--      ABSCHALTEN, damit sich niemand selbst registrieren kann
--
-- Wirkung: Der öffentliche Anon-Key (steht im ausgelieferten JS) hat danach
-- keinen Zugriff mehr auf die Tabellen. Nur Anfragen mit gültigem Login-Token
-- (Rolle "authenticated") dürfen lesen und schreiben.
-- ================================================================

ALTER TABLE purin_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE purin_today    ENABLE ROW LEVEL SECURITY;
ALTER TABLE walk_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE indoor_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE lebensmittel   ENABLE ROW LEVEL SECURITY;

-- Policy: angemeldete Nutzer dürfen alles. Keine Policy für "anon" = kein Zugriff.
-- Mit deaktivierter Registrierung ist "authenticated" in der Praxis nur der Besitzer.
DROP POLICY IF EXISTS authenticated_full_access ON purin_history;
CREATE POLICY authenticated_full_access ON purin_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_full_access ON purin_today;
CREATE POLICY authenticated_full_access ON purin_today
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_full_access ON walk_history;
CREATE POLICY authenticated_full_access ON walk_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_full_access ON indoor_history;
CREATE POLICY authenticated_full_access ON indoor_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_full_access ON lebensmittel;
CREATE POLICY authenticated_full_access ON lebensmittel
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Prüfung: RLS aktiv?
SELECT relname AS tabelle, relrowsecurity AS rls_aktiv
FROM pg_class
WHERE relname IN ('purin_history','purin_today','walk_history','indoor_history','lebensmittel');
