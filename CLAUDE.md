# Gesundheitstools – Purin & Gehrechner

## Projektübersicht
Persönliche Gesundheits-Web-App mit zwei Hauptbereichen:
1. **Purin-Lebensmitteldatenbank** mit Tagesverbrauchsrechner, Historie und Verlauf
2. **Gehrechner** mit Berechnung von Strecke, Höhenmeter, Kalorien, Herzfrequenz etc.

---

## Projektstruktur

```
purin-app/
├── index.html              # HTML-Struktur (kein Inline-CSS, kein Inline-JS)
├── css/
│   └── styles.css          # Alle CSS-Regeln
├── js/
│   └── app.js              # Alle JavaScript-Funktionen + Datenbasis
├── .gitlab-ci.yml          # CI/CD Pipeline für GitLab Pages
├── supabase_setup.sql      # Einmalig in Supabase ausführen
└── CLAUDE.md               # Diese Datei
```

---

## Deployment

- **Hosting:** GitLab Pages → `https://slapshot1701.gitlab.io/claude`
- **Branch:** `master`
- **Pipeline:** `.gitlab-ci.yml` injiziert Supabase-Keys via `sed` in `js/app.js`
- **Supabase-Keys** werden NICHT im Repository gespeichert — nur als GitLab CI/CD Variables

### GitLab CI/CD Variables
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

- RLS ist **deaktiviert** (nur persönliche Nutzung)
- UPSERT-Strategie: **DELETE + INSERT** (wegen UNIQUE constraints)

---

## Technischer Stack

- **Reines Vanilla JS** — kein Framework, kein Build-Tool
- **Chart.js 4.4.1** via CDN für Verlaufsdiagramme
- **localStorage** für lokale Datenpersistenz
- **Supabase REST API** für Cloud-Sync
- **CSS Custom Properties** für Dark/Light Mode

---

## Wichtige Funktionen in app.js

### Datenbasis
- `data[]` — 455 Lebensmittel mit Purin, Eiweiß, kcal, KH, Fett, Ballaststoffe
- `getLevel(p)` — Purin-Stufe (low/medium/high/very-high)
- `getRec(p)` — Verzehrempfehlung pro Woche
- `calcTotals(items)` — Nährwert-Summen berechnen

### Tracker
- `addTrackerItem(food, grams)` — Lebensmittel hinzufügen
- `saveDay()` — Tagesverbrauch in Historie speichern
- `resetTracker()` — Tagesverbrauch zurücksetzen
- `checkMidnightReset()` — Automatischer Reset um Mitternacht

### Historie
- `getHistory()` / `renderHistory()` — Purin-Historie
- `getWalkHistory()` / `renderWalkHistory()` — Geh-Historie
- `getDayTs()` — Normalisierter Timestamp (00:00:00 des Tages) → verhindert Duplikate

### Supabase Sync
- `syncUpload()` — Alle lokalen Daten zu Supabase hochladen
- `syncDownload()` — Daten von Supabase laden (Server überschreibt lokal)
- `supabaseUpsert(table, body)` — DELETE + INSERT für zuverlässiges Update
- `supabaseRequest(method, table, body, query)` — Basis-Fetch-Funktion

### Gehrechner
- `calcWalk()` — Berechnet Strecke, Höhenmeter, kcal, MET, HR, Schritte, Wasser
- `saveWalkDay()` — Berechnung in Walk-Historie speichern
- Formeln: ACSM Walking Formula, Karvonen Herzfrequenz

### UI
- `switchPage(name)` — Zwischen Seiten wechseln (purin / walk)
- `switchTab(name)` — Tracker-Tabs (tracker / history / chart)
- `switchWalkTab(name)` — Walk-Tabs (calc / history / chart)
- `renderChart()` / `renderWalkChart()` — Verlaufsdiagramme mit Chart.js
- `showToast(msg)` — Kurze Statusmeldungen

---

## Typischer Update-Workflow

```bash
# 1. Neue Datei(en) von Claude erhalten
# 2. In VS Code ersetzen
cp ~/Downloads/app.js js/app.js

# 3. Committen und pushen
git add .
git commit -m "Feature/Fix: Beschreibung"
git push origin master

# 4. Pipeline abwarten (~1 Min) → grün ✓
# 5. App aufrufen: https://slapshot1701.gitlab.io/claude
# 6. Ctrl+Shift+R für Hard Reload
```

---

## Bekannte Eigenheiten

- **UNIQUE constraint** auf `ts` in `purin_history` / `walk_history` und auf `user_id` in `purin_today` → deshalb DELETE+INSERT statt UPSERT
- **Branch heißt `master`** (nicht `main`) → in `.gitlab-ci.yml` beachten
- **Platzhalter-Check** in `syncUpload/Download` nutzt `.includes('PLACEHOLDER')` statt direktem Vergleich, weil `sed` ALLE Vorkommen ersetzt
- **ts wird normalisiert** auf `00:00:00` des Tages via `getDayTs()` → verhindert doppelte Einträge in Supabase

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
