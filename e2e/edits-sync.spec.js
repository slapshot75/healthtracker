import { test, expect } from './support/fixtures.js';
import { setupSupabase } from './support/supabase-mock.js';

// Regressionstest: Bearbeitungen müssen übernommen werden, auch wenn der Schlüssel
// (ts bzw. Name) gleich bleibt. Das Mock-Objekt wird nach dem Start geändert,
// damit der Start-Sync nicht schon die Antwort übernimmt, die der Test prüft.

const TOTALS = (purin) => ({ purin, kcal: 10, protein: 1, carbs: 1, fat: 1, fiber: 0 });
const DAY_TS = 1700000000000;

test.describe('Bearbeitungen werden synchronisiert', () => {
  test('Purin-Historie: geänderte Menge bei gleichem ts wird übernommen', async ({ page }) => {
    const resp = {};
    await setupSupabase(page, resp);
    await page.evaluate((ts) => {
      localStorage.setItem('purin_tracker_history', JSON.stringify([
        { ts, date: '14.11.2023', items: [{ id: 1, name: 'X', grams: 100, purin: 50 }], totals: { purin: 50, kcal: 10, protein: 1, carbs: 1, fat: 1, fiber: 0 } },
      ]));
    }, DAY_TS);
    resp.purin_history = [{ ts: DAY_TS, date: '14.11.2023', items: [{ id: 1, name: 'X', grams: 200, purin: 100 }], totals: TOTALS(100) }];

    await page.evaluate(() => liveRefresh());
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('purin_tracker_history'))[0].items[0].grams)).toBe(200);
  });

  test('Geh-Historie: geänderter Trainingswert bei gleichem ts wird übernommen', async ({ page }) => {
    const resp = {};
    await setupSupabase(page, resp);
    await page.evaluate((ts) => {
      localStorage.setItem('purin_walk_history', JSON.stringify([{ ts, date: '14.11.2023', km: 3, kcal: 120 }]));
    }, DAY_TS);
    resp.walk_history = [{ ts: DAY_TS, date: '14.11.2023', data: { km: 5, kcal: 200 } }];

    await page.evaluate(() => liveRefresh());
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('purin_walk_history'))[0].km)).toBe(5);
  });

  test('Indoor: geänderter Wert bei gleichem ts wird übernommen', async ({ page }) => {
    const resp = {};
    await setupSupabase(page, resp);
    await page.evaluate((ts) => {
      localStorage.setItem('purin_indoor_history', JSON.stringify([{ ts, date: '14.11.2023', dur: 30, kcal: 200 }]));
    }, DAY_TS);
    resp.indoor_history = [{ ts: DAY_TS, date: '14.11.2023', data: { dur: 45, kcal: 300 } }];

    await page.evaluate(() => liveRefresh());
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('purin_indoor_history'))[0].dur)).toBe(45);
  });

  test('Lebensmittel: geänderter Nährwert bei gleichem Namen wird übernommen', async ({ page }) => {
    const resp = {};
    await setupSupabase(page, resp);
    await page.evaluate(() => {
      customFoods = [{ name: 'Alt', category: 'Sonstiges', purin: 10, protein: 1, kcal: 10, carbs: 1, fiber: 0, fat: 0 }];
      localStorage.setItem('purin_custom_foods', JSON.stringify(customFoods));
    });
    resp.lebensmittel = [{ name: 'Alt', category: 'Sonstiges', purin: 99, protein: 1, kcal: 10, carbs: 1, fiber: 0, fat: 0 }];

    await page.evaluate(() => liveRefresh());
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('purin_custom_foods'))[0].purin)).toBe(99);
  });
});
