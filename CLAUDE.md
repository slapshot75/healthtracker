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
├── css/
│   └── styles.css          # Alle CSS-Regeln
├── js/
│   └── app.js              # Alle JavaScript-Funktionen + Datenbasis (~2210 Zeilen)
├── .github/workflows/deploy.yml  # CI/CD Pipeline für GitHub Pages
├── supabase_setup.sql      # Einmalig in Supabase ausführen
└── CLAUDE.md               # Diese Datei
```

---

## Deployment

- **Hosting:** GitHub Pages → `https://slapshot75.github.io/healthtracker/`
- **Branch:** `main`
- **Pipeline:** `.github/workflows/deploy.yml` injiziert Supabase-Keys via `sed` in `js/app.js`
- **Supabase-Keys** werden NICHT im Repository gespeichert — nur als GitHub Secrets

### GitHub Secrets
| Key | Beschreibung |
|-----|-------------|
| `SUPABASE_URL` | `https://sqcdjemmerejltbncqrs.supabase.co` |
| `SUPABASE_ANON_KEY` | anon public key (beginnt mit `eyJ...`) |

### Platzhalter in js/app.js
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

- RLS ist **deaktiviert** (nur persönliche Nutzung)
- UPSERT-Strategie: **DELETE + INSERT** (wegen UNIQUE constraints)
- `lebensmittel`: `user_id = '__base__'` für Basisdaten, eigene `user_id` für Custom Foods

---

## Technischer Stack

- **Reines Vanilla JS** — kein Framework, kein Build-Tool
- **Chart.js 4.4.1** via CDN für Verlaufsdiagramme
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
- `dbAutoSave(fn)` — Wrapper: führt fn aus, speichert dann lokal + Supabase-Today
- `STORAGE_KEY` = `'purin_tracker_today'`
- `HISTORY_KEY` = `'purin_tracker_history'`
- `WALK_HISTORY_KEY` = `'purin_walk_history'`
- `CUSTOM_FOODS_KEY` = `'purin_custom_foods'`
- `BASE_FOODS_CACHE_KEY` = `'purin_base_foods'` — Cache für Supabase-Basisdaten
- `LAST_DATE_KEY` = `'purin_last_date'` — Datum des letzten Öffnens (Midnight-Reset)
- `SYNC_USER_KEY` = `'purin_sync_user_id'` — Geräte-ID für Supabase-Sync

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

### Historie bearbeiten (Purin)
- `openEditModal(ts)` — Historien-Tag im Edit-Modal öffnen
- `closeEditModal(e)` — Modal schließen
- `renderEditItems()` — Items im Edit-Modal rendern
- `updateEditGrams(id, val)` — Grammzahl eines Items ändern
- `removeEditItem(id)` — Item aus Edit-Kopie entfernen
- `showEditSuggestions()` / `selectEditFood(idx)` — Suchfeld im Edit-Modal
- `addToEditDay()` — Lebensmittel zum bearbeiteten Tag hinzufügen
- `saveEditDay()` — Geänderten Tag speichern (localStorage + Supabase)

### Historie bearbeiten (Walk)
- `openEditWalkModal(ts)` — Walk-Eintrag im Edit-Modal öffnen
- `closeEditWalkModal(e)` — Modal schließen
- `calcWalkEdit()` — Werte im Edit-Modal neu berechnen
- `saveEditWalkDay()` — Geänderten Walk-Eintrag speichern (localStorage + Supabase)

### Supabase Sync
- `syncUpload()` — Alle lokalen Daten zu Supabase hochladen
- `syncDownload()` — Daten von Supabase laden (Server überschreibt lokal)
- `supabaseUpsert(table, body)` — DELETE + INSERT für zuverlässiges Update
- `supabaseDelete(table, ts, userId)` — Einzelnen Eintrag löschen
- `supabaseInsert(table, body)` — Neuen Eintrag einfügen
- `supabaseRequest(method, table, body, query)` — Basis-Fetch-Funktion
- `getSyncUserId()` — Geräte-ID aus Input lesen + in localStorage speichern
- `setSyncStatus(state, text)` — Sync-Status-Anzeige aktualisieren

### Live-Sync
- `liveRefresh()` — Holt aktuelle Daten von Supabase ohne vollständigen Sync
  - Wird aufgerufen: beim Laden, bei `window focus`, bei `visibilitychange`
  - Aktualisiert Tracker, Purin-Historie und Walk-Historie falls Änderungen vorliegen

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
- `parseDayDate(dateStr)` / `toISO(d)` — Datums-Hilfsfunktionen
- `METRIC_CONFIG` — Metriken für Purin-Chart (purin, kcal, protein, etc.)
- `WALK_METRIC_CONFIG` — Metriken für Walk-Chart (km, kcal, steps, etc.)

### UI
- `switchPage(name)` — Zwischen Seiten wechseln (purin / walk)
- `switchTab(name)` — Tracker-Tabs (tracker / history / chart)
- `switchWalkTab(name)` — Walk-Tabs (calc / history / chart)
- `showToast(msg, duration)` — Kurze Statusmeldungen

---

## Typischer Update-Workflow

```bash
# 1. Änderungen direkt via Claude Code im Repo bearbeiten
# 2. Committen und pushen
git add .
git commit -m "Feature/Fix: Beschreibung"
git push origin main

# 3. Pipeline abwarten (~2 Min, Tests + Deploy) → grün ✓
# 4. App aufrufen: https://slapshot75.github.io/healthtracker/
# 5. Ctrl+Shift+R für Hard Reload
```

---

## Bekannte Eigenheiten

- **UNIQUE constraint** auf `ts` in `purin_history` / `walk_history` und auf `user_id` in `purin_today` → deshalb DELETE+INSERT statt UPSERT
- **Branch heißt `main`** → in `.github/workflows/deploy.yml` definiert
- **Platzhalter-Check** in `syncUpload/Download` nutzt `.includes('PLACEHOLDER')` statt direktem Vergleich, weil `sed` ALLE Vorkommen ersetzt
- **ts wird normalisiert** auf `00:00:00` des Tages via `getDayTs()` → verhindert doppelte Einträge in Supabase
- **Live-Sync** läuft passiv im Hintergrund (kein Polling-Interval) — nur bei Fokuswechsel
- **`data[]`** ist immer `currentBaseData + customFoods` — nie direkt schreiben, `mergeCustomFoods()` verwenden
- **`lebensmittel`** Tabelle: `user_id='__base__'` für Basisdaten (read-only), eigene `user_id` für Custom Foods — UNIQUE auf `(user_id, name)`

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

- Geräte-ID wird in `localStorage` unter `purin_sync_user_id` gespeichert
- Gleiche ID auf allen Geräten → Daten werden synchronisiert
- **Server überschreibt immer** die lokalen Daten beim Download
- **Live-Sync** aktualisiert automatisch bei Fensterwechsel (kein manueller Trigger nötig)
