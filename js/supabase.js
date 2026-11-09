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

  // ── Warteschlange (Outbox) ────────────────────────────────────
  // Jeder Schreibvorgang wird vor dem Senden in die Warteschlange gelegt und erst
  // entfernt, wenn er erfolgreich war. Schlägt er fehl, bleibt er erhalten und wird
  // beim nächsten Abgleich in Reihenfolge nachgeholt. Solange für eine Tabelle
  // Einträge ausstehen, darf der Serverstand dieser Tabelle nicht übernommen werden
  // (siehe hasPending in js/app.js).
  const OUTBOX_KEY = 'sb_outbox';
  // Vorgänge, die die ganze Tabelle setzen: ersetzen alle früheren Vorgänge der Tabelle
  const TABLE_WIDE = new Set(['clearDays', 'clearWalks', 'clearIndoor', 'replaceFoods', 'pushToday']);

  function loadOutbox() {
    try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]'); } catch (e) { return []; }
  }
  // Ohne Ausnahme-Fang: kann der Speicher nicht geschrieben werden, schlägt der Vorgang laut fehl.
  function saveOutbox(q) {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(q));
  }
  function newId() {
    return Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  }

  function enqueue(entry) {
    const q = loadOutbox().filter((e) => {
      if (e.table !== entry.table) return true;
      if (TABLE_WIDE.has(entry.type)) return false;  // ersetzt alle früheren Vorgänge dieser Tabelle
      return e.key !== entry.key;                    // gleiche Zeile: letzter Stand gewinnt
    });
    q.push(entry);
    saveOutbox(q);
  }

  async function doFlush() {
    for (;;) {
      const q = loadOutbox();
      if (q.length === 0) return;
      const head = q[0];
      // Wirft bei Fehler: der Eintrag bleibt in der Warteschlange
      await ACTIONS[head.type](...head.args);
      saveOutbox(loadOutbox().filter((e) => e.id !== head.id));
    }
  }

  // Serialisiert alle Abgleiche, damit nie zwei Läufe gleichzeitig senden
  let chain = Promise.resolve();
  function flushOutbox() {
    const run = chain.then(doFlush);
    chain = run.catch(() => {});
    return run;
  }

  function hasPending(table) {
    return loadOutbox().some((e) => e.table === table);
  }

  // Jeder Schreibvorgang geht durch die Warteschlange: einreihen, dann in Reihenfolge senden
  async function write(type, table, key, args) {
    enqueue({ id: newId(), type, table, key, args });
    await flushOutbox();
  }

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
  const saveDay = ({ ts, date, items, totals }) => write('saveDay', 'purin_history', `ts:${ts}`, [{ ts, date, items, totals }]);
  const deleteDay = (ts) => write('deleteDay', 'purin_history', `ts:${ts}`, [ts]);
  const clearDays = () => write('clearDays', 'purin_history', null, []);

  // ── walk_history ──────────────────────────────────────────────
  const saveWalk = ({ ts, date, data }) => write('saveWalk', 'walk_history', `ts:${ts}`, [{ ts, date, data }]);
  const deleteWalk = (ts) => write('deleteWalk', 'walk_history', `ts:${ts}`, [ts]);
  const clearWalks = () => write('clearWalks', 'walk_history', null, []);
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

  // Speichert ein eigenes Lebensmittel. Der bestehende Datensatz wird mit einem einzigen
  // PATCH geändert (auch bei Umbenennung: oldName sucht den Datensatz, der neue Name wird gesetzt).
  // Nur wenn kein Datensatz getroffen wurde, folgt ein POST. Nie vorher löschen.
  async function saveFoodNow(food, oldName = null) {
    const row = { user_id: USER_ID, ...foodRow(food) };
    const match = oldName || food.name;
    const updated = await request('PATCH', 'lebensmittel', {
      query: `?${userFilter()}&name=eq.${encodeURIComponent(match)}`,
      body: row,
      prefer: 'return=representation',
    });
    if (!(Array.isArray(updated) && updated.length > 0)) {
      await request('POST', 'lebensmittel', { body: row });
    }
  }

  function deleteFoodNow(name) {
    return request('DELETE', 'lebensmittel', { query: `?${userFilter()}&name=eq.${encodeURIComponent(name)}` });
  }

  // Ersetzt alle eigenen Lebensmittel durch die übergebene Liste, ohne vorher zu löschen:
  // 1. jeder Eintrag wird per PATCH über den Namen aktualisiert, ohne Treffer per POST angelegt
  // 2. erst wenn alle Schreibvorgänge erfolgreich waren, werden Einträge entfernt,
  //    die nicht mehr in der Liste stehen
  async function replaceFoodsNow(foods) {
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

  const saveFood = (food, oldName = null) => write('saveFood', 'lebensmittel', `name:${food.name}`, [food, oldName]);
  const deleteFood = (name) => write('deleteFood', 'lebensmittel', `name:${name}`, [name]);
  const replaceFoods = (foods) => write('replaceFoods', 'lebensmittel', null, [foods]);

  // ── purin_today ───────────────────────────────────────────────
  // user_id ist UNIQUE: vorhandene Zeile aktualisieren, nur ohne Treffer neu einfügen.
  async function pushTodayNow({ ts, items, settings }) {
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
  const pushToday = (p) => write('pushToday', 'purin_today', null, [{ ts: p.ts, items: p.items, settings: p.settings }]);

  // Liefert ein Array mit höchstens einer Zeile (leeres Array, wenn nichts vorliegt).
  function pullToday() {
    return request('GET', 'purin_today', { query: `?${userFilter()}&order=ts.desc&limit=1` });
  }

  // ── indoor_history ────────────────────────────────────────────
  const saveIndoor = ({ ts, date, data }) => write('saveIndoor', 'indoor_history', `ts:${ts}`, [{ ts, date, data }]);
  const deleteIndoor = (ts) => write('deleteIndoor', 'indoor_history', `ts:${ts}`, [ts]);
  const clearIndoor = () => write('clearIndoor', 'indoor_history', null, []);
  function pullIndoor() {
    return request('GET', 'indoor_history', { query: `?${userFilter()}&order=ts.desc&limit=200` });
  }

  // Ausführung je Vorgangstyp (ohne Warteschlange; wird nur aus doFlush aufgerufen)
  const ACTIONS = {
    saveDay:      ({ ts, date, items, totals }) => replaceByTs('purin_history', { ts, date, items, totals }),
    deleteDay:    (ts) => deleteByTs('purin_history', ts),
    clearDays:    () => clearTable('purin_history'),
    saveWalk:     ({ ts, date, data }) => replaceByTs('walk_history', { ts, date, data }),
    deleteWalk:   (ts) => deleteByTs('walk_history', ts),
    clearWalks:   () => clearTable('walk_history'),
    saveIndoor:   ({ ts, date, data }) => replaceByTs('indoor_history', { ts, date, data }),
    deleteIndoor: (ts) => deleteByTs('indoor_history', ts),
    clearIndoor:  () => clearTable('indoor_history'),
    saveFood:     (food, oldName) => saveFoodNow(food, oldName),
    deleteFood:   (name) => deleteFoodNow(name),
    replaceFoods: (foods) => replaceFoodsNow(foods),
    pushToday:    (p) => pushTodayNow(p),
  };

  return {
    USER_ID, isConfigured, isLoggedIn, lastEmail, signIn, signOut,
    flushOutbox, hasPending,
    saveDay, deleteDay, clearDays,
    saveWalk, deleteWalk, clearWalks, pullWalks,
    pullDays,
    pullBaseFoods, pullFoods, saveFood, deleteFood, replaceFoods,
    pushToday, pullToday,
    saveIndoor, deleteIndoor, clearIndoor, pullIndoor,
  };
})();
