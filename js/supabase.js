// ── Supabase-Modul ──────────────────────────────────────────────
// Einziger Ort mit HTTP-Aufrufen gegen Supabase. Wird vor js/app.js geladen.
// Die Platzhalter werden von der Pipeline (.github/workflows/deploy.yml) ersetzt.
const SUPABASE_URL = (typeof LOCAL_SUPABASE_URL !== 'undefined' ? LOCAL_SUPABASE_URL : 'SUPABASE_URL_PLACEHOLDER').trim();
const SUPABASE_KEY = (typeof LOCAL_SUPABASE_KEY !== 'undefined' ? LOCAL_SUPABASE_KEY : 'SUPABASE_KEY_PLACEHOLDER').trim();

const SupabaseSync = (() => {
  const USER_ID = 'mario';

  function isConfigured() {
    return !!SUPABASE_URL && !SUPABASE_URL.includes('PLACEHOLDER');
  }

  // Wirft bei jedem Status >= 300, damit Aufrufer Fehler sehen.
  async function request(method, table, { query = '', body, prefer = 'return=minimal' } = {}) {
    const headers = {
      'apikey':        SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Prefer':        prefer,
    };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  const userFilter = () => `user_id=eq.${encodeURIComponent(USER_ID)}`;

  // ── Gemeinsame Muster für Tabellen mit UNIQUE auf ts ─────────
  // Vorhandenen Eintrag mit gleichem ts entfernen, dann neu einfügen.
  async function replaceByTs(table, row) {
    await request('DELETE', table, { query: `?ts=eq.${row.ts}&${userFilter()}` });
    await request('POST', table, { body: { user_id: USER_ID, ...row } });
  }

  function deleteByTs(table, ts) {
    return request('DELETE', table, { query: `?${userFilter()}&ts=eq.${ts}` });
  }

  function clearTable(table) {
    return request('DELETE', table, { query: `?${userFilter()}` });
  }

  // ── purin_history ─────────────────────────────────────────────
  function saveDay({ ts, date, items, totals }) {
    return replaceByTs('purin_history', { ts, date, items, totals });
  }
  const deleteDay = (ts) => deleteByTs('purin_history', ts);
  const clearDays = () => clearTable('purin_history');

  // ── walk_history ──────────────────────────────────────────────
  function saveWalk({ ts, date, data }) {
    return replaceByTs('walk_history', { ts, date, data });
  }
  const deleteWalk = (ts) => deleteByTs('walk_history', ts);
  const clearWalks = () => clearTable('walk_history');
  function pullWalks() {
    return request('GET', 'walk_history', { query: `?${userFilter()}&order=ts.desc&limit=200` });
  }

  function pullDays() {
    return request('GET', 'purin_history', { query: `?${userFilter()}&order=ts.desc&limit=90` });
  }

  // ── lebensmittel ──────────────────────────────────────────────
  // Nur die Spalten, die die Tabelle kennt.
  function foodRow(f) {
    return { name: f.name, category: f.category, purin: f.purin, protein: f.protein, kcal: f.kcal, carbs: f.carbs, fiber: f.fiber, fat: f.fat };
  }

  // Basisdaten (user_id '__base__', nur lesen)
  function pullBaseFoods() {
    return request('GET', 'lebensmittel', { query: '?user_id=eq.__base__&order=id.asc&limit=600' });
  }

  function pullFoods() {
    return request('GET', 'lebensmittel', { query: `?${userFilter()}&order=id.asc` });
  }

  // oldName gesetzt = Eintrag wurde umbenannt oder geändert: alten Namen zuerst entfernen.
  async function saveFood(food, oldName = null) {
    if (oldName) await request('DELETE', 'lebensmittel', { query: `?${userFilter()}&name=eq.${encodeURIComponent(oldName)}` });
    await request('POST', 'lebensmittel', { body: { user_id: USER_ID, ...foodRow(food) } });
  }

  function deleteFood(name) {
    return request('DELETE', 'lebensmittel', { query: `?${userFilter()}&name=eq.${encodeURIComponent(name)}` });
  }

  // Ersetzt alle eigenen Lebensmittel durch die übergebene Liste.
  async function replaceFoods(foods) {
    await request('DELETE', 'lebensmittel', { query: `?${userFilter()}` });
    for (const f of foods) {
      await request('POST', 'lebensmittel', { body: { user_id: USER_ID, ...foodRow(f) } });
    }
  }

  // ── purin_today ───────────────────────────────────────────────
  // user_id ist UNIQUE: der Tagesverbrauch wird vollständig ersetzt.
  async function pushToday({ ts, items, settings }) {
    await request('DELETE', 'purin_today', { query: `?${userFilter()}` });
    await request('POST', 'purin_today', { body: { user_id: USER_ID, ts, items, settings } });
  }

  // Liefert ein Array mit höchstens einer Zeile (leeres Array, wenn nichts vorliegt).
  function pullToday() {
    return request('GET', 'purin_today', { query: `?${userFilter()}&order=ts.desc&limit=1` });
  }

  // ── indoor_history ────────────────────────────────────────────
  function saveIndoor({ ts, date, data }) {
    return replaceByTs('indoor_history', { ts, date, data });
  }
  const deleteIndoor = (ts) => deleteByTs('indoor_history', ts);
  const clearIndoor = () => clearTable('indoor_history');
  function pullIndoor() {
    return request('GET', 'indoor_history', { query: `?${userFilter()}&order=ts.desc&limit=200` });
  }

  return {
    USER_ID, isConfigured,
    saveDay, deleteDay, clearDays,
    saveWalk, deleteWalk, clearWalks, pullWalks,
    pullDays,
    pullBaseFoods, pullFoods, saveFood, deleteFood, replaceFoods,
    pushToday, pullToday,
    saveIndoor, deleteIndoor, clearIndoor, pullIndoor,
  };
})();
