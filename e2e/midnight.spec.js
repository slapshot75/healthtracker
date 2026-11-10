import { test, expect } from './support/fixtures.js';
import { setupSupabase, writesTo } from './support/supabase-mock.js';

// Regressionstest: Der Mitternachts-Reset archiviert den Tagesverbrauch unter dem Tag,
// an dem er zuletzt geschrieben wurde, nicht unter "gestern".

const FORMAT = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
const ITEM = { id: 1, name: 'Testfood', grams: 100, unit: 'g', purin: 50, kcal: 100, protein: 5, carbs: 10, fat: 2, fiber: 0 };

test.describe('Mitternachts-Reset', () => {
  test('Items von vor 3 Tagen werden unter diesem Tag archiviert', async ({ page }) => {
    await setupSupabase(page);
    const result = await page.evaluate((item) => {
      const d = new Date();
      d.setDate(d.getDate() - 3);
      const pad = (n) => String(n).padStart(2, '0');
      localStorage.setItem('purin_tracker_items_date', `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`);
      localStorage.setItem('purin_tracker_history', '[]');
      trackerItems = [item];
      checkMidnightReset();
      const h = JSON.parse(localStorage.getItem('purin_tracker_history'));
      return {
        expectedDate: d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }),
        expectedTs: getDayTs(d),
        archived: h[0],
        trackerLeft: trackerItems.length,
      };
    }, ITEM);

    expect(result.archived.date).toBe(result.expectedDate);
    expect(result.archived.ts).toBe(result.expectedTs);
    expect(result.archived.items).toHaveLength(1);
    expect(result.trackerLeft).toBe(0);
  });

  test('Nachträge: vorhandener Tageseintrag wird mit dem Tracker-Stand ersetzt, Zeitstempel bleibt', async ({ page }) => {
    const requests = await setupSupabase(page);
    const result = await page.evaluate(() => {
      const d = new Date();
      d.setDate(d.getDate() - 3);
      const pad = (n) => String(n).padStart(2, '0');
      const label = d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
      const earlier = { id: 1, name: 'A', grams: 100, unit: 'g', purin: 50, kcal: 100, protein: 5, carbs: 10, fat: 2, fiber: 0 };
      const later   = { id: 2, name: 'B', grams: 50, unit: 'g', purin: 20, kcal: 40, protein: 2, carbs: 4, fat: 1, fiber: 0 };
      localStorage.setItem('purin_tracker_items_date', `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`);
      localStorage.setItem('purin_tracker_history', JSON.stringify([
        { ts: getDayTs(d), date: label, items: [earlier], totals: calcTotals([earlier]) },
      ]));
      // Tracker enthält den gespeicherten Stand plus den Nachtrag
      trackerItems = [earlier, later];
      checkMidnightReset();
      const h = JSON.parse(localStorage.getItem('purin_tracker_history'));
      return { count: h.length, items: h[0].items.length, ts: h[0].ts, expectedTs: getDayTs(d), trackerLeft: trackerItems.length };
    });

    expect(result.count).toBe(1);
    expect(result.items).toBe(2);
    expect(result.ts).toBe(result.expectedTs);
    expect(result.trackerLeft).toBe(0);
    await expect.poll(() => writesTo(requests, 'purin_history').length).toBeGreaterThan(0);
  });

  test('ohne Items-Datum: Herkunft ist lastDate', async ({ page }) => {
    await setupSupabase(page);
    const result = await page.evaluate((item) => {
      const d = new Date();
      d.setDate(d.getDate() - 2);
      const pad = (n) => String(n).padStart(2, '0');
      localStorage.removeItem('purin_tracker_items_date');
      localStorage.setItem('purin_last_date', `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`);
      localStorage.setItem('purin_tracker_history', '[]');
      trackerItems = [item];
      checkMidnightReset();
      const h = JSON.parse(localStorage.getItem('purin_tracker_history'));
      return { expectedDate: d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }), archived: h[0] };
    }, ITEM);

    expect(result.archived.date).toBe(result.expectedDate);
  });
});
