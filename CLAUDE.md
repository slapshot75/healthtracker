# Gesundheitstools – Purin & Gehrechner

## Projektübersicht
Persönliche Gesundheits-Web-App mit zwei Hauptbereichen:
1. **Purin-Lebensmitteldatenbank** mit Tagesverbrauchsrechner, Historie und Verlauf
2. **Gehrechner** mit Berechnung von Strecke, Höhenmeter, Kalorien, Herzfrequenz etc.

---

## Projektstruktur

```
healthtracker/
├── index.html              # HTML-Struktur (kein Inline-CSS, kein Inline-JS)
├── manifest.json           # PWA-Manifest (Home-Bildschirm-Installation auf iOS/Android)
├── sw.js                   # Service Worker (Offline-App-Shell, Supabase wird nicht gecacht)
├── icons/                  # App-Icons (apple-touch-icon.png, icon-192/512.png)
├── css/
│   └── styles.css          # Alle CSS-Regeln
├── js/
│   ├── app.js              # Alle JavaScript-Funktionen + Datenbasis (~2460 Zeilen)
│   ├── supabase.js         # Alle Supabase-Zugriffe (SupabaseSync), lädt vor app.js
│   ├── pwa.js              # Registriert den Service Worker
│   └── local-config.js     # Nur lokal: Supabase-Keys für Live Server (.gitignore!)
├── .github/workflows/deploy.yml  # CI/CD Pipeline für GitHub Pages (Test → Deploy → Smoke)
├── e2e/                    # Playwright-Tests (*.spec.js) + support/ (Supabase-Attrappe, Fixtures)
├── playwright.config.js    # Testkonfiguration (Zeitzone Europe/Berlin, Locale de-DE)
├── supabase/               # SQL: supabase_setup.sql (einmalig) + datierte Migrationen
└── CLAUDE.md               # Diese Datei
```

---

## Deployment

- **Hosting:** GitHub Pages → `https://slapshot75.github.io/healthtracker/`
- **Branch:** `main`
- **Pipeline:** `.github/workflows/deploy.yml` injiziert Supabase-Keys via `sed` in `js/supabase.js` (`js/app.js` wird unverändert kopiert)
- **Supabase-Keys** werden NICHT im Repository gespeichert — nur als GitHub Secrets
- **Pages-Source muss „GitHub Actions“ sein** (Settings → Pages). Mit „Deploy from a branch“ veröffentlicht GitHub zusätzlich die Rohdateien mit Platzhaltern; die Anmeldung scheitert dann mit 405.
- **Drei Jobs:** `test` (Syntax-Check `npm run check`, dann E2E) → `deploy` (bricht ab, wenn ein Secret fehlt oder ein Platzhalter übrig bleibt) → `smoke` (prüft die Live-Seite: `CACHE`-Version aus `sw.js` ist ausgeliefert, kein Platzhalter in `js/supabase.js`). Der Smoke-Job vergleicht die `CACHE`-Version, deshalb `CACHE` bei jeder Änderung hochzählen.

### GitHub Secrets
| Key | Beschreibung |
|-----|-------------|
| `SUPABASE_URL` | `https://sqcdjemmerejltbncqrs.supabase.co` |
| `SUPABASE_ANON_KEY` | anon public key (beginnt mit `eyJ...`) |

### Platzhalter in js/supabase.js
```javascript
const SUPABASE_URL = 'SUPABASE_URL_PLACEHOLDER';   // wird von Pipeline ersetzt
const SUPABASE_KEY = 'SUPABASE_KEY_PLACEHOLDER';   // wird von Pipeline ersetzt
```

---

## Supabase Datenbank

**Projekt-URL:** `https://sqcdjemmerejltbncqrs.supabase.co`

### Tabellen
| Tabelle | Inhalt | Unique Key |
|---------|--------|------------|
| `purin_history` | Gespeicherte Tage (Purin-Tracker) | `ts` |
| `purin_today` | Aktueller Tagesverbrauch | `user_id` |
| `walk_history` | Gespeicherte Geh-Einheiten | `ts` |
| `lebensmittel` | Custom Foods + gecachte Basisdaten | `(user_id, name)` |

- RLS ist **aktiv** (Migration `supabase/2026-11-09-auth-rls.sql`): Zugriff nur für die Rolle `authenticated`, also nur mit Login. Der Anon-Key allein hat keinen Zugriff. `supabase/supabase_setup.sql` enthält noch den alten Stand ohne RLS und muss für neue Projekte durch die Migration ergänzt werden.
- Schreib-Strategie für `ts`-Tabellen: **PATCH, dann INSERT nur wenn keine Zeile getroffen wurde** (`replaceByTs`). Kein DELETE vorab, damit ein fehlgeschlagener INSERT keinen Eintrag entfernt. `pushToday` (purin_today) folgt demselben Muster. `replaceFoods` (lebensmittel) aktualisiert zuerst per PATCH über den Namen, löscht veraltete Einträge erst am Ende per `not.in`.
- **Warteschlange (Outbox):** Jeder Schreibvorgang in `js/supabase.js` wird vor dem Senden in `localStorage` (`sb_outbox`) eingereiht und erst nach Erfolg entfernt. Fehlgeschlagene Vorgänge werden beim nächsten Schreibvorgang oder Abgleich in Reihenfolge erneut versucht. Solange für eine Tabelle Einträge ausstehen (`SupabaseSync.hasPending`), übernimmt `liveRefresh` deren Serverstand nicht, und `syncDownload` bricht ab, wenn die Warteschlange nicht leer wird. Ein dauerhaft abgelehnter Vorgang (z. B. 400) bleibt in der Warteschlange und blockiert die Tabelle.
- `lebensmittel`: `user_id = '__base__'` für Basisdaten, eigene `user_id` für Custom Foods

---

## Technischer Stack

- **Reines Vanilla JS** — kein Framework, kein Build-Tool
- **Chart.js 4.6.1** via CDN (mit SRI-Hash) für Verlaufsdiagramme
- **localStorage** für lokale Datenpersistenz
- **Supabase REST API** für Cloud-Sync + Live-Sync
- **CSS Custom Properties** für Dark/Light Mode

---

## Wichtige Funktionen in app.js

### Datenbasis
- `baseData[]` — ~460 Lebensmittel (Basis, hardcodiert als Fallback)
- `currentBaseData` — aktive Basisdaten (= `baseData` oder Supabase-Cache aus localStorage)
- `customFoods[]` — benutzerdefinierte Lebensmittel (aus localStorage)
- `data[]` — aktuell aktives Array = `currentBaseData` + `customFoods` (via `mergeCustomFoods()`)
- `getLevel(p)` — Purin-Stufe (low/medium/high/very-high)
- `getLevelLabel(l)` / `getLevelOrder(l)` — Label und Sortierrang für Stufen
- `getRec(p)` — Verzehrempfehlung pro Woche
- `getRecLabel(r)` / `getRecDetail(r)` / `getRecOrder(r)` — Label, Detail und Sortierrang
- `calcTotals(items)` — Nährwert-Summen berechnen
- `sort(key)` — Lebensmitteltabelle sortieren

### Custom Foods
- `openAddFoodModal()` / `closeAddFoodModal(e)` — Modal für eigene Lebensmittel
- `saveNewFood()` — Neues Lebensmittel speichern (localStorage + Supabase `lebensmittel`)
- `loadCustomFoodsLocal()` — Lädt Custom Foods + gecachte Basisdaten aus localStorage
- `refreshBaseFoodsFromSupabase()` — Holt Basisdaten aus Supabase `lebensmittel` (user_id=`__base__`), cacht in localStorage
- `mergeCustomFoods()` — Zusammenführen von `currentBaseData` und `customFoods` in `data[]`
- `deleteCustomFood(idx)` — Eigenes Lebensmittel löschen (localStorage + Supabase `lebensmittel`)

### Tracker
- `addTrackerItem(food, grams)` — Lebensmittel hinzufügen
- `removeTrackerItem(id)` — Lebensmittel entfernen
- `resetTracker()` — Tagesverbrauch zurücksetzen
- `renderTracker()` — Tracker-UI neu rendern
- `quickAdd(idx)` — Schnell-Hinzufügen aus Lebensmittelliste
- `updatePreview()` / `confirmAdd()` / `closeModal(e)` — Modal-Hilfsfunktionen
- `showSuggestions()` / `selectFood(idx)` / `clearTrackerSearch()` / `handleKey(e)` / `addFromInput()` — Suchfeld-Logik
- `checkMidnightReset()` — Automatischer Reset um Mitternacht
- `getTodayStr()` — Heutiges Datum als String (für Midnight-Check)

### Limits (Konstanten)
```javascript
const PURIN_LIMIT   = 500;  // mg
const KCAL_LIMIT    = 2000; // kcal
const PROTEIN_LIMIT = 75;   // g
const CARBS_LIMIT   = 250;  // g
const FAT_LIMIT     = 65;   // g
```

### Storage
- `saveToStorage()` / `loadFromStorage()` — localStorage lesen/schreiben
- `dbAutoSave(fn)` — Wrapper: führt den Supabase-Schreibvorgang `fn` nur aus, wenn `SupabaseSync.isConfigured()`; Fehler gehen in die Sync-Anzeige. Aufruf immer als `dbAutoSave(() => SupabaseSync.…)`
- `STORAGE_KEY` = `'purin_tracker_today'`
- `HISTORY_KEY` = `'purin_tracker_history'`
- `WALK_HISTORY_KEY` = `'purin_walk_history'`
- `CUSTOM_FOODS_KEY` = `'purin_custom_foods'`
- `BASE_FOODS_CACHE_KEY` = `'purin_base_foods'` — Cache für Supabase-Basisdaten
- `LAST_DATE_KEY` = `'purin_last_date'` — Datum des letzten Öffnens (Midnight-Reset)

### Historie
- `getHistory()` / `renderHistory()` — Purin-Historie
- `getWalkHistory()` / `renderWalkHistory()` — Geh-Historie
- `saveDay()` — Aktuellen Tag in Purin-Historie speichern (localStorage + Supabase)
- `deleteDay(ts)` — Einzelnen Tag aus Purin-Historie löschen (localStorage + Supabase)
- `clearHistory()` — Gesamte Purin-Historie löschen
- `deleteWalkDay(ts)` — Einzelnen Walk-Eintrag löschen (localStorage + Supabase)
- `clearWalkHistory()` — Gesamte Walk-Historie löschen
- `getDayTs(date)` — Normalisierter Timestamp (00:00:00 des Tages) → verhindert Duplikate
- `toggleDay(ts)` — Tag in Purin-Historie ein-/ausklappen
- `toggleWalkDay(ts)` — Tag in Walk-Historie ein-/ausklappen
- `purinColor(val)` — Farbe je nach Purin-Wert
- `pBar(val, limit)` / `pClass(val, limit)` — Fortschrittsbalken-Hilfsfunktionen

### Kalender-Vorauswahl (Purin- und Geh-Historie)
- `HIST_CAL` — Zustand je Historie (`purin` / `walk`): gewählter Monat `month` (`'YYYY-MM'`, `'all'` oder `null` = neuester Monat), gewählter Tag `day`, `open` (Kalender aufgeklappt, in `localStorage` unter `purin_history_cal_open` / `purin_walk_history_cal_open`) und `render`
- `buildHistoryNav(kind, allHistory)` — liefert Kopfzeile + Kalender-HTML und die nach Monat/Tag gefilterten Einträge; wird von `renderHistory()` und `renderWalkHistory()` genutzt
- `buildHistoryCalendar(kind, key, entryDays)` — Monatsraster (Mo–So), Tage mit Einträgen sind klickbar
- `selectHistoryMonth(kind, key)` / `shiftHistoryMonth(kind, delta)` / `selectHistoryDay(kind, day)` / `toggleHistoryCal(kind)` — Bedienung; `kind` ist immer `'purin'` oder `'walk'`
- `monthKey(ts)` / `monthLabel(key)` — Monatsschlüssel aus `ts` (nicht aus dem Datumstext) und deutsche Anzeige
- Die Lebensmittelübersicht (`#food-overview`) wird in `switchTab()` auf dem Tab „Historie“ ausgeblendet

### Historie bearbeiten (Purin)
- `openEditModal(ts)` — Historien-Tag im Edit-Modal öffnen
- `openNewDayModal()` — Leeres Modal für vergangenen Tag (Datum per Datepicker wählbar)
- `closeEditModal(e)` — Modal schließen
- `renderEditItems()` — Items im Edit-Modal rendern
- `updateEditGrams(id, val)` — Grammzahl eines Items ändern
- `removeEditItem(id)` — Item aus Edit-Kopie entfernen
- `showEditSuggestions()` / `selectEditFood(idx)` — Suchfeld im Edit-Modal
- `addToEditDay()` — Lebensmittel zum bearbeiteten Tag hinzufügen
- `saveEditDay()` — Geänderten Tag speichern (localStorage + Supabase); erstellt auch neuen Tag wenn `editDayIsNew`

### Historie bearbeiten (Walk)
- `openEditWalkModal(ts)` — Walk-Eintrag im Edit-Modal öffnen
- `openNewWalkDayModal()` — Leeres Modal für vergangenen Walk (Datum per Datepicker, Startwerte aus Hauptrechner)
- `closeEditWalkModal(e)` — Modal schließen
- `calcWalkEdit()` — Werte im Edit-Modal neu berechnen
- `saveEditWalkDay()` — Geänderten Walk-Eintrag speichern (localStorage + Supabase); erstellt auch neuen Eintrag wenn `editWalkIsNew`

### Supabase Sync (in app.js)
- `syncDownload()` — Daten von Supabase laden (Server überschreibt lokal)
- `setSyncStatus(state, text)` — Sync-Status-Anzeige aktualisieren

## Supabase-Modul (js/supabase.js)

Einziger Ort mit HTTP-Zugriffen gegen Supabase. Lädt vor `app.js`. Stellt das Objekt `SupabaseSync` bereit:

- `SupabaseSync.USER_ID` — feste Benutzer-ID (`'mario'`)
- `SupabaseSync.isConfigured()` — `false`, solange die Platzhalter nicht ersetzt sind
- `SupabaseSync.isLoggedIn()` / `signIn(email, pw)` / `signOut()` / `lastEmail()` — Anmeldung (Sitzung in `localStorage` unter `sb_session`). Alle Requests senden das Access-Token; bei 401 einmal erneuern, bei eindeutigem Auth-Fehler Event `sb-auth-required` auslösen
- `syncReady()` (app.js) — `isConfigured() && isLoggedIn()`; Schreib-, Lese- und Live-Sync prüfen das statt `isConfigured()`
- `showLogin()` / `submitLogin(e)` / `onLoggedIn()` / `logoutSupabase()` — Login-Maske und Abmelden
- Intern: `request(method, table, {query, body, prefer})` — wirft bei Status ≥ 300 mit `"<status>: <text>"`; `replaceByTs` (PATCH, dann INSERT wenn kein Treffer), `deleteByTs`, `clearTable` für Tabellen mit UNIQUE auf `ts`
- `saveDay({ts, date, items, totals})` / `deleteDay(ts)` / `clearDays()` — Purin-Historie (`purin_history`)
- `saveWalk({ts, date, data})` / `deleteWalk(ts)` / `clearWalks()` / `pullWalks()` — Geh-Historie (`walk_history`)
- `pushToday({ts, items, settings})` / `pullToday()` — Tagesverbrauch (`purin_today`, UNIQUE auf `user_id`)
- `saveSettings(settings)` — setzt nur die Spalte `settings` von `purin_today` (items und ts bleiben); ohne Zeile wird eine leere angelegt
- `pullDays()` — Purin-Historie lesen (letzte 90 Tage, neueste zuerst)
- `pullBaseFoods()` — Basisdaten (`lebensmittel`, `user_id='__base__'`, nur lesen)
- `pullFoods()` — eigene Lebensmittel lesen (sortiert nach `id`)
- `saveFood(food, oldName?)` — eigenes Lebensmittel speichern; mit `oldName` zuerst den alten Namen entfernen
- `deleteFood(name)` — eigenes Lebensmittel löschen
- `replaceFoods(foods)` — alle eigenen Lebensmittel ersetzen (PATCH je Name, POST ohne Treffer, DELETE veralteter Namen zuletzt). Derzeit ohne Aufrufer in der App; manueller Upload wurde entfernt.

Fehler werden nicht in `js/supabase.js` angezeigt. Der Aufrufer entscheidet, ob er `setSyncStatus` oder `showToast` nutzt.

### Live-Sync
- `liveRefresh()` — Holt aktuelle Daten von Supabase ohne vollständigen Sync
  - Wird aufgerufen: beim Laden, bei `window focus`, bei `visibilitychange`
  - Aktualisiert Tracker, Purin-Historie und Walk-Historie falls Änderungen vorliegen

### Gesamtverbrauch (Seite `summary`)
- `renderSummary()` — Kalorienbilanz aus dem Serverstand (`pullDays`, `pullToday`, `pullWalks`, `pullIndoor`); ohne Anmeldung nur ein Hinweis
- `buildSummaryDaily(days, today, burnRows)` — Kalorien je Tag: Aufnahme aus `purin_history` (ohne heute) + `purin_today`, Verbrauch aus Gehrechner und Indoor-Rad plus Grundverbrauch. Karten (`renderSummary`) und Verlauf nutzen dieselben Tageswerte
- **Grundverbrauch ohne Sport:** `_baseBurn` (`{value, ts}`, `localStorage` `purin_base_burn`), `saveBaseBurn()`, `applyRemoteBaseBurn(settings)`. Fester kcal-Wert je Tag, angerechnet an jedem Tag mit Aufnahme oder Einheit sowie heute; ohne Wert bleibt das Verhalten unverändert. Settings-Felder `base_burn`, `base_burn_ts`, neuerer Zeitstempel gewinnt
- `renderSummaryChart()` / `initSummaryDateRange(keys)` / `resetSummaryDateRange()` — Verlauf mit zwei Linien („Aufgenommen“, „Verbraucht“); die Differenz steht als Zahl im Tooltip (`afterBody`) und in `#schart-diff` (Summe nur über Tage mit beiden Werten). Tage ohne Eintrag sind Lücken, keine Nullen
- Kalorienziel wurde entfernt. Der Altwert `purin_kcal_goal` wird beim Laden aus `localStorage` gelöscht; Server-Felder `kcal_goal`/`kcal_goal_ts` werden nicht mehr gelesen oder geschrieben
- `currentSyncSettings()` — alle Werte für `purin_today.settings`; jeder Schreibvorgang auf `purin_today` schickt die ganze Liste

### Gehrechner
- `calcWalk()` — Berechnet Strecke, Höhenmeter, kcal, MET, HR, Schritte, Wasser
- `calcWalkEdit()` — Neuberechnung im Edit-Modal
- `saveWalkDay()` — Berechnung in Walk-Historie speichern
- Formeln: ACSM Walking Formula, Karvonen Herzfrequenz

### Diagramme
- `renderChart()` — Purin-Verlaufsdiagramm mit Chart.js
- `renderWalkChart()` — Walk-Verlaufsdiagramm mit Chart.js
- `initDateRange()` / `resetDateRange()` — Datumsbereich für Purin-Chart
- `initWalkDateRange()` / `resetWalkDateRange()` — Datumsbereich für Walk-Chart
- `parseDayDate(dateStr)` / `toISO(d)` / `localISO(ts)` — Datums-Hilfsfunktionen. `toISO` liefert das Datum in **Ortszeit** (nie `toISOString()` dafür verwenden: UTC ergibt in Deutschland um Mitternacht den Vortag). Datumsfelder werden mit `new Date(wert + 'T00:00:00')` gelesen
- `METRIC_CONFIG` — Metriken für Purin-Chart (purin, kcal, protein, etc.)
- `WALK_METRIC_CONFIG` — Metriken für Walk-Chart (km, kcal, steps, etc.)

### UI
- `switchPage(name)` — Zwischen Seiten wechseln (purin / walk)
- `switchTab(name)` — Tracker-Tabs (tracker / history / chart)
- `switchWalkTab(name)` — Walk-Tabs (calc / history / chart)
- `showToast(msg, duration)` — Kurze Statusmeldungen

### Dark/Light Mode
- `isDarkMode()` — true wenn Dark aktiv (prüft `data-theme`-Attribut, Fallback auf System-Präferenz)
- `toggleTheme()` — Wechselt hell/dunkel, setzt `data-theme` auf `<html>`, speichert in `localStorage('theme')`
- `updateThemeBtn()` — Aktualisiert Label des Toggle-Buttons (`#theme-toggle`)
- `initTheme()` — Wird beim Laden aufgerufen; liest `localStorage('theme')` und setzt `data-theme`

---

## Typischer Update-Workflow

```bash
# 1. Änderungen direkt via Claude Code im Repo bearbeiten
# 1a. Vor dem Push: npm run check && npx playwright test
#     (ein roter Test stoppt den Deploy; Charakterisierungstests prüfen Request-Körper exakt)
# 2. Committen und pushen
git add .
git commit -m "Feature/Fix: Beschreibung"
git push origin main   # Remote heißt hier "origin" (https://github.com/slapshot75/healthtracker.git)

# 3. Pipeline abwarten (~3 Min, Tests + Deploy + Smoke) → grün ✓
# 4. App aufrufen: https://slapshot75.github.io/healthtracker/
# 5. Ctrl+Shift+R für Hard Reload
```

---

## Bekannte Eigenheiten

- **UNIQUE constraint** auf `ts` in `purin_history` / `walk_history` und auf `user_id` in `purin_today` → deshalb DELETE+INSERT statt UPSERT
- **Branch heißt `main`** → in `.github/workflows/deploy.yml` definiert
- **Platzhalter-Check** in `SupabaseSync.isConfigured()` nutzt `.includes('PLACEHOLDER')` statt direktem Vergleich, weil `sed` ALLE Vorkommen ersetzt
- **ts wird normalisiert** auf `00:00:00` des Tages via `getDayTs()` → verhindert doppelte Einträge in Supabase
- **Live-Sync** läuft passiv im Hintergrund (kein Polling-Interval) — nur bei Fokuswechsel
- **`data[]`** ist immer `currentBaseData + customFoods` — nie direkt schreiben, `mergeCustomFoods()` verwenden
- **`lebensmittel`** Tabelle: `user_id='__base__'` für Basisdaten (read-only), eigene `user_id` für Custom Foods — UNIQUE auf `(user_id, name)`
- **`js/local-config.js`** — für lokale Entwicklung gedacht; steht in `.gitignore` und wird nie committet. **Achtung:** `index.html` bindet die Datei derzeit nicht ein, lokal ohne Pipeline ist Cloud-Sync daher aus. Auf GitHub Pages werden Keys durch die Pipeline ersetzt
- **XSS-Schutz in inline-Handlern** — alle dynamischen Werte in `onclick`/`oninput`-Attributen (item.id, day.ts, d.ts, d._customIdx) werden mit `Number()` erzwungen, damit manipulierte localStorage-Einträge keinen Code einschleusen können
- **Theme-Toggle** — `data-theme="dark|light"` auf `<html>` überschreibt `@media (prefers-color-scheme)` mit höherer CSS-Spezifität; Anti-Flash-Script im `<head>` setzt `data-theme` vor CSS-Rendering aus localStorage; Charts rufen `isDarkMode()` auf statt direkt `matchMedia`
- **PWA** — `manifest.json`, `sw.js`, `icons/` und `js/pwa.js` müssen in `.github/workflows/deploy.yml` mitkopiert werden. Neue Dateien in der App-Shell-Liste von `sw.js` ergänzen und `CACHE` bei Änderungen hochzählen.
- **Content-Security-Policy** steht als `<meta>` in `index.html` (GitHub Pages kann keine Header setzen). Sie enthält den Supabase-Host und die cdnjs-URL fest: bei Projektwechsel oder neuem CDN-Skript die Policy anpassen. `'unsafe-inline'` für Skripte bleibt, solange 138 Inline-Handler im HTML/JS stehen. `e2e/csp.spec.js` prüft die Policy im Browser (Playwright läuft mit `bypassCSP: true`, der CSP-Test überschreibt das).
- **Abhängigkeiten** — neue Pakete oder CDN-Skripte nur nach Prüfung laut `docs/dependency-policy.md` (Standardfunktionen zuerst, feste Versionen, Entwicklungs-Tools bleiben in `devDependencies`)

---

## Tests (Playwright, `e2e/`)

- Start: `npx playwright test` (startet `http-server` auf Port 3000). Syntax-Check: `npm run check`.
- Specs importieren `test`/`expect` aus `e2e/support/fixtures.js`, nicht direkt aus `@playwright/test`. Die Fixture liefert Chart.js aus einem lokalen Cache statt vom CDN (`e2e/support/chartjs-cache.js` lädt die Datei einmal je Lauf und prüft sie gegen den SRI-Hash aus `index.html`).
- `e2e/support/supabase-mock.js` — `setupSupabase(page, responses, {loggedIn})` fängt alle Supabase-Aufrufe ab und zeichnet sie auf. Später registrierte `page.route`-Regeln im Test haben Vorrang (so simuliert `auth-refresh.spec.js` ein 401).
- Tests laufen in `Europe/Berlin`. Hängt ein Test an „heute“, die Uhr festsetzen (`page.clock.setFixedTime`, siehe `summary.spec.js`), sonst kippt er um Mitternacht.
- Rechenlogik wird mit von Hand nachgerechneten, exakten Werten geprüft (`walk.spec.js`, `indoor.spec.js`).
- Auf Ubuntu 26.04 unterstützt Playwright den Browser-Download nicht: `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64` vor `npx playwright install chromium` und vor dem Testlauf setzen.
- `npm ci --dry-run` nicht verwenden: es leert `node_modules`.

---

## CSS-Variablen (Dark/Light Mode)

```css
--bg, --bg2, --bg3          /* Hintergründe */
--text, --text2, --text3    /* Textfarben */
--border, --border2         /* Rahmen */
--radius, --radius-lg       /* Ecken */
```

---

## Geräte-Sync

- Die Benutzer-ID ist fest in `js/supabase.js` hinterlegt (`SupabaseSync.USER_ID = 'mario'`), es gibt kein Eingabefeld
- **Anmeldung:** Passwort-Login über Supabase Auth (E-Mail + Passwort). Ohne gültige Sitzung blockiert die Login-Maske (`#login-overlay`) die App. Die Sitzung liegt im `localStorage` (`sb_session`), das Token wird bei Ablauf automatisch erneuert. Abmelden über den Button „Abmelden“.
- Die öffentliche Registrierung ist im Supabase-Dashboard **abgeschaltet**; Benutzer wird manuell angelegt (siehe `supabase/2026-11-09-auth-rls.sql`)
- Alle Geräte mit derselben Konfiguration teilen sich dieselben Daten (nach Anmeldung)
- **Server überschreibt immer** die lokalen Daten beim Download
- **Erstmigration nur einmal:** Lokale Daten werden bei leerem Server nur hochgeladen, solange das Gerät diese Datenart noch nie synchronisiert hat (Marker `purin_synced_purin` / `purin_synced_walk` / `purin_synced_foods` / `purin_indoor_synced` im `localStorage`). Danach bedeutet ein leerer Server „auf einem anderen Gerät gelöscht“ und der lokale Stand wird geleert. Ein Gerät, das offline neue Einträge angelegt hat, verliert diese beim nächsten Abgleich, wenn der Server leer ist.
- **Live-Sync** aktualisiert automatisch bei Fensterwechsel (kein manueller Trigger nötig)
