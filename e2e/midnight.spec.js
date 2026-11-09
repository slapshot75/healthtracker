import { test, expect } from '@playwright/test';
import { setupSupabase } from './support/supabase-mock.js';

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
