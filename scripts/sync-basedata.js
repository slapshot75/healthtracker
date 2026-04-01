#!/usr/bin/env node
// Holt alle Basisdaten (user_id='__base__') aus Supabase und überschreibt
// baseData[] in js/app.js (Zeilen 1 bis zur schließenden "];")
//
// Verwendung:
//   SUPABASE_URL=https://... SUPABASE_KEY=eyJ... node scripts/sync-basedata.js

const fs   = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Fehler: SUPABASE_URL und SUPABASE_KEY als Umgebungsvariablen setzen.');
  process.exit(1);
}

async function fetchBaseData() {
  let all = [];
  let offset = 0;
  const limit = 500;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/lebensmittel?user_id=eq.__base__&order=id.asc&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
    });
    if (!res.ok) throw new Error(`Supabase Fehler: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    all = all.concat(rows);
    if (rows.length < limit) break;
    offset += limit;
  }
  return all;
}

function rowToJs(r) {
  const n = v => Number(v);
  return `  {name:${JSON.stringify(r.name)},category:${JSON.stringify(r.category)},purin:${n(r.purin)},protein:${n(r.protein)},kcal:${n(r.kcal)},carbs:${n(r.carbs)},fiber:${n(r.fiber)},fat:${n(r.fat)}}`;
}

(async () => {
  try {
    console.log('Lade Basisdaten aus Supabase…');
    const rows = await fetchBaseData();
    console.log(`${rows.length} Einträge geladen.`);

    if (rows.length === 0) {
      console.error('Keine Basisdaten in Supabase (user_id=__base__) gefunden – abgebrochen.');
      process.exit(1);
    }

    // Gruppieren nach Kategorie für bessere Lesbarkeit
    const byCategory = {};
    for (const r of rows) {
      (byCategory[r.category] = byCategory[r.category] || []).push(r);
    }

    let lines = ['const baseData = ['];
    for (const [cat, items] of Object.entries(byCategory)) {
      lines.push(`  // ${cat}`);
      lines.push(...items.map(rowToJs).map((l, i, a) => i < a.length - 1 ? l + ',' : l + ','));
    }
    // letztes Komma entfernen
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
    lines.push('];');

    const appPath = path.join(__dirname, '..', 'js', 'app.js');
    const content = fs.readFileSync(appPath, 'utf8');

    // baseData-Block ersetzen: von "const baseData = [" bis zur schließenden "];"
    const start = content.indexOf('const baseData = [');
    const end   = content.indexOf('];', start) + 2;
    if (start === -1 || end === 1) {
      console.error('baseData-Block in app.js nicht gefunden.');
      process.exit(1);
    }

    const newContent = content.slice(0, start) + lines.join('\n') + content.slice(end);
    fs.writeFileSync(appPath, newContent, 'utf8');
    console.log(`app.js aktualisiert (${rows.length} Einträge).`);
  } catch (e) {
    console.error('Fehler:', e.message);
    process.exit(1);
  }
})();
