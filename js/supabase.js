// ── Supabase-Modul ──────────────────────────────────────────────
// Einziger Ort mit HTTP-Aufrufen gegen Supabase. Wird vor js/app.js geladen.
// Die Platzhalter werden von der Pipeline (.github/workflows/deploy.yml) ersetzt.
// Zugriff auf die Daten nur mit angemeldeter Sitzung (Supabase Auth, RLS für
// die Rolle "authenticated"). Der Anon-Key allein reicht nicht mehr.
const SUPABASE_URL = (typeof LOCAL_SUPABASE_URL !== 'undefined' ? LOCAL_SUPABASE_URL : 'SUPABASE_URL_PLACEHOLDER').trim();
const SUPABASE_KEY = (typeof LOCAL_SUPABASE_KEY !== 'undefined' ? LOCAL_SUPABASE_KEY : 'SUPABASE_KEY_PLACEHOLDER').trim();

const SupabaseSync = (() => {
  const USER_ID = 'mario';
  const SESSION_KEY = 'sb_session';
  const EMAIL_KEY = 'sb_email';

  function isConfigured() {
    return !!SUPABASE_URL && !SUPABASE_URL.includes('PLACEHOLDER');
  }

  // ── Sitzung (localStorage) ────────────────────────────────────
  function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function saveSession(s) {
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }
  function isLoggedIn() {
    const s = loadSession();
    return !!(s && s.access_token && s.refresh_token);
  }
  function lastEmail() {
    try { return localStorage.getItem(EMAIL_KEY) || ''; } catch (e) { return ''; }
  }

  function toSession(data, fallbackEmail) {
    return {
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
      expires_at:    Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
      email:         (data.user && data.user.email) || fallbackEmail || '',
    };
  }

  // Auth-Endpunkte (Anmelden, Erneuern). Fehler tragen den HTTP-Status.
  async function authRequest(path, body) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = new Error(res.status === 400 ? 'E-Mail oder Passwort falsch' : `Anmeldung fehlgeschlagen (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  async function signIn(email, password) {
    const data = await authRequest('token?grant_type=password', { email, password });
    saveSession(toSession(data, email));
    try { localStorage.setItem(EMAIL_KEY, email); } catch (e) {}
  }

  function signOut() {
    saveSession(null);
  }

  // Parallele Erneuerungen zusammenfassen. Nur eindeutige Auth-Fehler
  // (400/401/403) beenden die Sitzung; Netzfehler lassen sie bestehen.
  let refreshing = null;
  function refreshSession() {
    const s = loadSession();
    if (!s || !s.refresh_token) return Promise.reject(new Error('AUTH_REQUIRED'));
    if (!refreshing) {
      refreshing = authRequest('token?grant_type=refresh_token', { refresh_token: s.refresh_token })
        .then((data) => {
          saveSession(toSession(data, s.email));
          return loadSession();
        })
        .catch((e) => {
          if ([400, 401, 403].includes(e.status)) {
            saveSession(null);
            window.dispatchEvent(new Event('sb-auth-required'));
          }
          throw e;
        })
        .finally(() => { refreshing = null; });
    }
    return refreshing;
  }

  async function currentToken() {
    let s = loadSession();
    if (!s || !s.access_token) throw new Error('AUTH_REQUIRED');
    // Kurz vor Ablauf schon erneuern (60 s Puffer)
    if (s.expires_at - 60 < Date.now() / 1000) s = await refreshSession();
    return s.access_token;
  }

  // Wirft bei jedem Status >= 300, damit Aufrufer Fehler sehen.
  async function request(method, table, { query = '', body, prefer = 'return=minimal' } = {}) {
    const send = (token) => {
      const headers = {
        'apikey':        SUPABASE_KEY,
        'Authorization': 'Bearer ' + token,
        'Prefer':        prefer,
      };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      return fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    };

    let res = await send(await currentToken());
    if (res.status === 401) {
      // Token abgelaufen oder ungültig: einmal erneuern und wiederholen
      res = await send((await refreshSession()).access_token);
    }
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  const userFilter = () => `user_id=eq.${encodeURIComponent(USER_ID)}`;

  // ── Gemeinsame Muster für Tabellen mit UNIQUE auf ts ─────────
  // Vorhandenen Eintrag mit gleichem ts aktualisieren; nur wenn keine Zeile
  // getroffen wurde, neu einfügen. Nie vorher löschen: scheitert der INSERT,
  // bleibt der bisherige Eintrag erhalten.
  async function replaceByTs(table, row) {
    const updated = await request('PATCH', table, {
      query: `?ts=eq.${row.ts}&${userFilter()}`,
      body: { user_id: USER_ID, ...row },
      prefer: 'return=representation',
    });
    if (Array.isArray(updated) && updated.length > 0) return;
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

  // Ersetzt alle eigenen Lebensmittel durch die übergebene Liste, ohne vorher zu löschen:
  // 1. jeder Eintrag wird per PATCH über den Namen aktualisiert, ohne Treffer per POST angelegt
  // 2. erst wenn alle Schreibvorgänge erfolgreich waren, werden Einträge entfernt,
  //    die nicht mehr in der Liste stehen
  // Scheitert ein Schritt, bleiben bisherige Einträge erhalten.
  async function replaceFoods(foods) {
    for (const f of foods) {
      const row = { user_id: USER_ID, ...foodRow(f) };
      const updated = await request('PATCH', 'lebensmittel', {
        query: `?${userFilter()}&name=eq.${encodeURIComponent(f.name)}`,
        body: row,
        prefer: 'return=representation',
      });
      if (!(Array.isArray(updated) && updated.length > 0)) {
        await request('POST', 'lebensmittel', { body: row });
      }
    }
    const names = foods.map((f) => f.name);
    if (names.length === 0) {
      await request('DELETE', 'lebensmittel', { query: `?${userFilter()}` });
    } else {
      // PostgREST-Liste: Namen in doppelte Anführungszeichen, \ und " escapen
      const list = names.map((n) => '"' + String(n).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"').join(',');
      await request('DELETE', 'lebensmittel', { query: `?${userFilter()}&name=not.in.(${encodeURIComponent(list)})` });
    }
  }

  // ── purin_today ───────────────────────────────────────────────
  // user_id ist UNIQUE: vorhandene Zeile aktualisieren, nur ohne Treffer neu einfügen.
  async function pushToday({ ts, items, settings }) {
    const row = { user_id: USER_ID, ts, items, settings };
    const updated = await request('PATCH', 'purin_today', {
      query: `?${userFilter()}`,
      body: row,
      prefer: 'return=representation',
    });
    if (!(Array.isArray(updated) && updated.length > 0)) {
      await request('POST', 'purin_today', { body: row });
    }
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
    USER_ID, isConfigured, isLoggedIn, lastEmail, signIn, signOut,
    saveDay, deleteDay, clearDays,
    saveWalk, deleteWalk, clearWalks, pullWalks,
    pullDays,
    pullBaseFoods, pullFoods, saveFood, deleteFood, replaceFoods,
    pushToday, pullToday,
    saveIndoor, deleteIndoor, clearIndoor, pullIndoor,
  };
})();
