# Security-Logging-Ledger (Stand 2026-11-09)

## Voraussetzungen
- Dread-Ledger-Checkout, `reference/coverage.md` und `reference/security-events.md`: **nicht vorhanden** (Suche auf dem System ohne Treffer). Checklisten-IDs sind daher **NOT RUN**. Die Bewertung läuft nur über die Vorgabe im Prompt.
- Bestehender Logger, Sammelstelle, Konsument, Aufbewahrungs- und Standortregel: **keine vorhanden**. Die App protokolliert nur per `console.warn`/`console.error` im Browser.
- Freigabe für Ziele (Alerts, Tickets, E-Mail, Chat), Aufbewahrung und Standort: **nicht vorhanden**. Nach Vorgabe blockiert das alle Ereignisse, die über die Konsole hinaus gehen.

## Basislauf (Wave 0)
- `npx playwright test`: 74/74 grün, lokal, gegen den Mock. Keine Netzwerk- oder Produktionszugriffe.

## Umgesetzt
- Fehlerprotokolle (9 Stellen in `js/app.js`) laufen über `logSyncError(kontext, e)`. Ausgegeben werden nur der feste Kontext und der HTTP-Status oder der Fehlertyp, nie der Rohtext. Begründung: Serverantworten können Tabellennamen, Constraints oder Teile der Eingabe enthalten.
- Test: `e2e/logging.spec.js`. Schlägt auf dem bisherigen Stand fehl, weil der Mock-Text dort in der Konsole steht.

## Kandidaten-Ereignisse und Status

| Ereignis | Auslöser (Code) | Status | Entscheidung, die fehlt |
|---|---|---|---|
| auth.login_succeeded / login_failed | `signIn` in `js/supabase.js`, `submitLogin` in `app.js` | unavailable_signal | Ziel, Aufbewahrung |
| auth.logout | `logoutSupabase` | unavailable_signal | Ziel |
| auth.session_refresh_failed | `refreshSession` (400/401/403) | unavailable_signal | Ziel |
| data.delete_all (purin, walk, indoor, lebensmittel) | `clearDays`, `clearWalks`, `clearIndoor`, `replaceFoods` mit leerer Liste | unavailable_signal | Ziel, Audit-Pflicht ja/nein |
| data.write_failed / outbox_blocked | `write` und `doFlush` in `js/supabase.js` | unavailable_signal | Ziel, Schwelle für gesperrte Tabelle |
| sync.download_aborted | `syncDownload` (Warteschlange nicht leer) | unavailable_signal | Ziel |

Keine dieser Stellen wird heute an einen Konsumenten gesendet. Vor einer Umsetzung braucht jede Zeile eine Entscheidung des Verantwortlichen.

## Offene Risiken, nicht geändert
- `js/pwa.js`: `console.warn` mit Rohfehler bei der Service-Worker-Registrierung. Betrifft keine Nutzerdaten, sollte aber dieselbe Regel bekommen.
- `localStorage` enthält die gesamte Gesundheitshistorie und die Warteschlange (`sb_outbox`) im Klartext. Das ist kein Log, aber eine Kopie personenbezogener Daten auf dem Gerät.
- Die Warteschlange kann Einträge dauerhaft blockieren (siehe CLAUDE.md). Dafür fehlt eine Meldung an den Betreiber.

## Nächste Schritte (Entscheidungen des Verantwortlichen)
1. Ziel und Aufbewahrung für Authentifizierungs- und Löschereignisse festlegen.
2. Festlegen, ob Löschungen als Audit-Pflicht gelten. Dann braucht es vor der Umsetzung eine Durability-Regel.
3. Dread-Ledger-Referenzen bereitstellen, damit die Checklisten-IDs bewertet werden können.
