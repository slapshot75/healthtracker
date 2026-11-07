// Gemeinsame Supabase-Attrappe für die Charakterisierungstests.
// Fängt alle REST-Aufrufe per Route ab, zeichnet sie auf und antwortet mit
// vorgegebenen GET-Ergebnissen (Standard: leere Liste).

export const SUPABASE = 'https://test.supabase.co';
const SUPABASE_REST = SUPABASE + '/rest/v1/';

// responses: { [tabelle]: Antwort-Array | (query) => Antwort-Array } für GET-Anfragen
export async function setupSupabase(page, responses = {}) {
  const requests = [];

  await page.addInitScript((url) => {
    window.LOCAL_SUPABASE_URL = url;
    window.LOCAL_SUPABASE_KEY = 'test-key';
  }, SUPABASE);

  await page.route(SUPABASE_REST + '**', async (route) => {
    const req = route.request();
    let body = null;
    try { body = req.postData() ? JSON.parse(req.postData()) : null; } catch (e) { body = req.postData(); }
    const url = new URL(req.url());
    const table = url.pathname.replace('/rest/v1/', '');
    requests.push({ method: req.method(), table, query: url.search, body });

    if (req.method() === 'GET') {
      const entry = responses[table];
      const payload = (typeof entry === 'function' ? entry(url.search) : entry) ?? [];
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
    } else {
      await route.fulfill({ status: 204, body: '' });
    }
  });

  page.on('dialog', (d) => d.accept());
  await page.goto('/');
  // Das Laden löst eigene Lese- und Abgleichvorgänge aus (liveRefresh). Die abwarten
  // und verwerfen, damit nur die Aktion des Tests gezählt wird.
  await page.waitForLoadState('networkidle');
  requests.length = 0;
  return requests;
}

export function writesTo(requests, table) {
  return requests.filter((r) => r.table === table && r.method !== 'GET');
}

export function readsFrom(requests, table) {
  return requests.filter((r) => r.table === table && r.method === 'GET');
}
