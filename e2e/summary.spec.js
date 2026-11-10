import { test, expect } from './support/fixtures.js';
import { setupSupabase, writesTo } from './support/supabase-mock.js';

// Seite "Gesamtverbrauch": Kalorienbilanz, Verlauf und Kalorienziel.
// Die Uhr im Browser steht fest auf dem 15.06.2026, 12:00 Uhr (Europe/Berlin). So hängt
// "heute" nicht an der echten Uhrzeit und der Test bleibt auch um Mitternacht stabil.

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 5, 15, 10, 0, 0);

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(NOW);
});
const EARLIER = NOW - 3 * DAY;

const SERVER = {
  // Vergangener Tag: 1800 kcal aufgenommen
  purin_history: [{ ts: EARLIER, date: 'früher', items: [], totals: { purin: 0, kcal: 1800, protein: 0, carbs: 0, fat: 0, fiber: 0 } }],
  // Heute: 400 + 200 kcal
  purin_today: [{ ts: NOW, items: [{ id: 1, name: 'A', grams: 100, kcal: 400 }, { id: 2, name: 'B', grams: 100, kcal: 200 }], settings: {} }],
  // Verbrauch: früher 300 (Gehen) + 200 (Rad), heute 250 (Gehen)
  walk_history: [
    { ts: EARLIER + 1000, date: 'früher', data: { ts: EARLIER + 1000, kcal: 300 } },
    { ts: NOW - 1000, date: 'heute', data: { ts: NOW - 1000, kcal: 250 } },
  ],
  indoor_history: [{ ts: EARLIER + 2000, date: 'früher', data: { ts: EARLIER + 2000, kcal: 200 } }],
};

async function openSummary(page) {
  await page.click('#pnav-summary');
  await expect(page.locator('#sum-status')).toContainText('Stand:');
}

test.describe('Gesamtverbrauch – Kalorienbilanz', () => {
  test('Gesamt- und Tageszeile aus dem Serverstand', async ({ page }) => {
    await setupSupabase(page, SERVER);
    await openSummary(page);

    await expect(page.locator('#sum-intake')).toHaveText('2.400');
    await expect(page.locator('#sum-burned')).toHaveText('750');
    await expect(page.locator('#sum-balance')).toHaveText('+1.650');
    await expect(page.locator('#sum-today-intake')).toHaveText('600');
    await expect(page.locator('#sum-today-burned')).toHaveText('250');
    await expect(page.locator('#sum-today-balance')).toHaveText('+350');
  });

  test('heutiger Eintrag in der Historie wird nicht doppelt gezählt', async ({ page }) => {
    const server = {
      ...SERVER,
      purin_history: [...SERVER.purin_history, { ts: NOW, date: 'heute', items: [], totals: { kcal: 999 } }],
    };
    await setupSupabase(page, server);
    await openSummary(page);

    await expect(page.locator('#sum-intake')).toHaveText('2.400');
    await expect(page.locator('#sum-today-intake')).toHaveText('600');
  });

  test('ohne Cloud-Verbindung: Hinweis statt Zahlen', async ({ page }) => {
    await page.goto('/');
    await page.click('#pnav-summary');

    await expect(page.locator('#sum-status')).toContainText('Keine Cloud-Verbindung');
    await expect(page.locator('#sum-intake')).toHaveText('—');
    await expect(page.locator('#schart-empty')).toBeVisible();
  });

  test('Chart.js nicht ladbar: Bilanz erscheint trotzdem, kein falscher Ladefehler', async ({ page }) => {
    await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort('failed'));
    await setupSupabase(page, SERVER);
    expect(await page.evaluate(() => typeof Chart)).toBe('undefined');
    await openSummary(page);

    await expect(page.locator('#sum-intake')).toHaveText('2.400');
    await expect(page.locator('#sum-balance')).toHaveText('+1.650');
  });

  test('Ladefehler: Fehlermeldung, keine Zahlen', async ({ page }) => {
    await setupSupabase(page, { ...SERVER, walk_history: { unerwartet: true } });
    await page.click('#pnav-summary');

    await expect(page.locator('#sum-status')).toContainText('Laden fehlgeschlagen');
    await expect(page.locator('#sum-intake')).toHaveText('—');
  });
});

test.describe('Gesamtverbrauch – Verlauf', () => {
  test('ein Punkt je Tag, Verbrauch aus Gehen und Rad summiert', async ({ page }) => {
    await setupSupabase(page, SERVER);
    await openSummary(page);

    const chart = await page.evaluate(() => ({
      labels: summaryChartInstance.data.labels.length,
      series: summaryChartInstance.data.datasets.map((d) => ({ label: d.label, data: d.data })),
    }));
    expect(chart.labels).toBe(2);
    expect(chart.series).toEqual([
      { label: 'Aufgenommen (kcal)', data: [1800, 600] },
      { label: 'Verbraucht (kcal)', data: [500, 250] },
    ]);
  });

  test('Auswahl "Differenz" zeigt aufgenommen minus verbraucht', async ({ page }) => {
    await setupSupabase(page, SERVER);
    await openSummary(page);
    await page.selectOption('#schart-metric', 'diff');

    const series = await page.evaluate(() => summaryChartInstance.data.datasets.map((d) => d.data));
    expect(series).toEqual([[1300, 350]]);
  });

  test('Tag ohne Eintrag bleibt eine Lücke, keine Null', async ({ page }) => {
    await setupSupabase(page, { ...SERVER, purin_today: [] });
    await openSummary(page);

    const series = await page.evaluate(() => summaryChartInstance.data.datasets.map((d) => d.data));
    expect(series).toEqual([[1800, null], [500, 250]]);
  });

  test('Zeitraum ohne Daten: Hinweis, "Alle anzeigen" stellt den Verlauf wieder her', async ({ page }) => {
    await setupSupabase(page, SERVER);
    await openSummary(page);

    await page.fill('#schart-from', '2000-01-01');
    await page.fill('#schart-to', '2000-01-02');
    await page.locator('#schart-to').dispatchEvent('change');
    await expect(page.locator('#schart-range-empty')).toBeVisible();
    await expect(page.locator('#summary-chart')).toBeHidden();

    await page.click('button[onclick="resetSummaryDateRange()"]');
    await expect(page.locator('#schart-range-empty')).toBeHidden();
    await expect(page.locator('#summary-chart')).toBeVisible();
    expect(await page.evaluate(() => summaryChartInstance.data.labels.length)).toBe(2);
  });
});

test.describe('Gesamtverbrauch – Kalorienziel', () => {
  test('Speichern schreibt nur die settings-Spalte, items bleiben unberührt', async ({ page }) => {
    const requests = await setupSupabase(page, { ...SERVER, 'PATCH:purin_today': [{ user_id: 'mario' }] });
    await openSummary(page);
    requests.length = 0;

    await page.fill('#sum-goal', '2200');
    await page.locator('#sum-goal').dispatchEvent('change');

    await expect.poll(() => writesTo(requests, 'purin_today').length).toBe(1);
    const [patch] = writesTo(requests, 'purin_today');
    expect(patch.method).toBe('PATCH');
    expect(patch.query).toBe('?user_id=eq.mario');
    expect(Object.keys(patch.body)).toEqual(['settings']);
    expect(patch.body.settings.kcal_goal).toBe(2200);
    expect(typeof patch.body.settings.kcal_goal_ts).toBe('number');
    expect(patch.body.settings.purin_limit).toBe(180); // Limit wird mitgeschickt, nicht gelöscht

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('purin_kcal_goal')));
    expect(stored.value).toBe(2200);
  });

  test('leeres Feld entfernt das Ziel', async ({ page }) => {
    const requests = await setupSupabase(page, { ...SERVER, 'PATCH:purin_today': [{ user_id: 'mario' }] });
    await openSummary(page);
    await page.fill('#sum-goal', '2200');
    await page.locator('#sum-goal').dispatchEvent('change');
    await expect.poll(() => writesTo(requests, 'purin_today').length).toBeGreaterThan(0);
    requests.length = 0;

    await page.fill('#sum-goal', '');
    await page.locator('#sum-goal').dispatchEvent('change');

    await expect.poll(() => writesTo(requests, 'purin_today').length).toBe(1);
    expect(writesTo(requests, 'purin_today')[0].body.settings.kcal_goal).toBeNull();
  });

  test('neueres Ziel vom Server wird übernommen', async ({ page }) => {
    const server = { ...SERVER, purin_today: [{ ...SERVER.purin_today[0], settings: { kcal_goal: 1900, kcal_goal_ts: 5000 } }] };
    await setupSupabase(page, server);
    await openSummary(page);

    await expect(page.locator('#sum-goal')).toHaveValue('1900');
  });

  test('älteres Ziel vom Server überschreibt den lokalen Wert nicht', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('purin_kcal_goal', JSON.stringify({ value: 2500, ts: 9000 }));
    });
    const server = { ...SERVER, purin_today: [{ ...SERVER.purin_today[0], settings: { kcal_goal: 1900, kcal_goal_ts: 5000 } }] };
    await setupSupabase(page, server);
    await openSummary(page);

    await expect(page.locator('#sum-goal')).toHaveValue('2500');
  });
});
