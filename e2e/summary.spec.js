import { test, expect } from './support/fixtures.js';
import { setupSupabase, writesTo } from './support/supabase-mock.js';

// Seite "Gesamtverbrauch": Kalorienbilanz, Verlauf und Grundverbrauch.
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
      series: [summaryChartInstance, summaryChartOutInstance].map((c) => ({ label: c.data.datasets[0].label, data: c.data.datasets[0].data })),
    }));
    expect(chart.labels).toBe(2);
    expect(chart.series).toEqual([
      { label: 'Aufgenommen (kcal)', data: [1800, 600] },
      { label: 'Verbraucht (kcal)', data: [500, 250] },
    ]);
  });

  test('Differenz steht als Zahl unter dem Verlauf und im Tooltip, nur zwei Linien', async ({ page }) => {
    await setupSupabase(page, SERVER);
    await openSummary(page);

    // Tag früher: 1800 − 500 = 1300; heute: 600 − 250 = 350; Zeitraum: 2400 − 750 = 1650
    await expect(page.locator('#schart-diff')).toContainText('Differenz +1.650 kcal');
    const labels = await page.evaluate(() => [summaryChartInstance, summaryChartOutInstance].map((c) => c.data.datasets[0].label));
    expect(labels).toEqual(['Aufgenommen (kcal)', 'Verbraucht (kcal)']);
    const tip = await page.evaluate(() => summaryChartInstance.options.plugins.tooltip.callbacks.afterBody([{ dataIndex: 0 }]));
    expect(tip).toBe('Differenz: +1.300 kcal');
  });

  test('Tag ohne Eintrag bleibt eine Lücke, keine Null', async ({ page }) => {
    await setupSupabase(page, { ...SERVER, purin_today: [] });
    await openSummary(page);

    const series = await page.evaluate(() => [summaryChartInstance, summaryChartOutInstance].map((c) => c.data.datasets[0].data));
    expect(series).toEqual([[1800, null], [500, 250]]);
    // Nur der frühere Tag hat beide Werte: Differenz 1300, heute bleibt außen vor
    await expect(page.locator('#schart-diff')).toContainText('Differenz +1.300 kcal');
  });

  test('Zeitraum ohne Daten: Hinweis, "Alle anzeigen" stellt den Verlauf wieder her', async ({ page }) => {
    await setupSupabase(page, SERVER);
    await openSummary(page);

    await page.fill('#schart-from', '2000-01-01');
    await page.fill('#schart-to', '2000-01-02');
    await page.locator('#schart-to').dispatchEvent('change');
    await expect(page.locator('#schart-range-empty')).toBeVisible();
    await expect(page.locator('#summary-chart')).toBeHidden();
    await expect(page.locator('#summary-chart-out')).toBeHidden();

    await page.click('button[onclick="resetSummaryDateRange()"]');
    await expect(page.locator('#schart-range-empty')).toBeHidden();
    await expect(page.locator('#summary-chart')).toBeVisible();
    await expect(page.locator('#summary-chart-out')).toBeVisible();
    expect(await page.evaluate(() => summaryChartInstance.data.labels.length)).toBe(2);
  });
});

// Grundverbrauch ohne Sport: fester kcal-Wert je Tag mit Eintrag (und heute), addiert zu Gehen/Rad.
// Handgerechnet mit SERVER: früher 1800 aufgenommen, 500 Einheiten; heute 600 aufgenommen, 250 Einheiten.
// Grundverbrauch 2000 → früher 2500, heute 2250; Gesamt verbraucht 4750, Differenz −2.350; heute −1.650.
test.describe('Gesamtverbrauch – Grundverbrauch ohne Sport', () => {
  test('Grundverbrauch aus dem Server wird je Tag addiert (Karten und Verlauf)', async ({ page }) => {
    const server = { ...SERVER, purin_today: [{ ...SERVER.purin_today[0], settings: { base_burn: 2000, base_burn_ts: 5000 } }] };
    await setupSupabase(page, server);
    await openSummary(page);

    await expect(page.locator('#sum-burned')).toHaveText('4.750');
    await expect(page.locator('#sum-balance')).toHaveText('−2.350');
    await expect(page.locator('#sum-today-burned')).toHaveText('2.250');
    await expect(page.locator('#sum-today-balance')).toHaveText('−1.650');
    await expect(page.locator('#sum-base-burn')).toHaveValue('2000');

    const series = await page.evaluate(() => [summaryChartInstance, summaryChartOutInstance].map((c) => c.data.datasets[0].data));
    expect(series).toEqual([[1800, 600], [2500, 2250]]);
  });

  test('Speichern schreibt base_burn in die settings-Spalte', async ({ page }) => {
    const requests = await setupSupabase(page, { ...SERVER, 'PATCH:purin_today': [{ user_id: 'mario' }] });
    await openSummary(page);
    requests.length = 0;

    await page.fill('#sum-base-burn', '1800');
    await page.locator('#sum-base-burn').dispatchEvent('change');

    await expect.poll(() => writesTo(requests, 'purin_today').length).toBe(1);
    const [patch] = writesTo(requests, 'purin_today');
    expect(Object.keys(patch.body)).toEqual(['settings']);
    expect(patch.body.settings.base_burn).toBe(1800);
    expect(typeof patch.body.settings.base_burn_ts).toBe('number');
    expect(patch.body.settings).not.toHaveProperty('kcal_goal'); // altes Kalorienziel wird nicht mehr geschrieben
  });
});

test('altes Kalorienziel auf dem Server wird ignoriert und beim Speichern nicht mehr geschrieben', async ({ page }) => {
  const server = {
    ...SERVER,
    'PATCH:purin_today': [{ user_id: 'mario' }],
    purin_today: [{ ...SERVER.purin_today[0], settings: { kcal_goal: 1900, kcal_goal_ts: 5000 } }],
  };
  const requests = await setupSupabase(page, server);
  await openSummary(page);
  requests.length = 0;

  await page.fill('#sum-base-burn', '1800');
  await page.locator('#sum-base-burn').dispatchEvent('change');

  await expect.poll(() => writesTo(requests, 'purin_today').length).toBe(1);
  const [patch] = writesTo(requests, 'purin_today');
  expect(patch.body.settings).not.toHaveProperty('kcal_goal');
  expect(patch.body.settings).not.toHaveProperty('kcal_goal_ts');
  expect(await page.locator('#sum-goal').count()).toBe(0);
});
