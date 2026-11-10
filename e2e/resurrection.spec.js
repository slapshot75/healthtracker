import { test, expect } from './support/fixtures.js';
import { setupSupabase, writesTo } from './support/supabase-mock.js';

// Regressionstest: Auf einem anderen Gerät gelöschte Daten dürfen nicht zurückkommen.
// Ein Gerät, das schon einmal synchronisiert hat, leert bei leerem Server seinen
// lokalen Stand, statt ihn erneut hochzuladen.

const DAY = { ts: 1700000000000, date: '14.11.2023', items: [], totals: { purin: 0, kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } };
const WALK = { ts: 1700000000000, date: '14.11.2023', km: 5, kcal: 300 };
const RIDE = { ts: 1700000000000, date: '14.11.2023', dur: 30, kcal: 200 };
const FOOD = { name: 'Alt', category: 'Sonstiges', purin: 10, protein: 1, kcal: 10, carbs: 1, fiber: 0, fat: 0 };

const KINDS = [
  { kind: 'purin',  key: 'purin_tracker_history', table: 'purin_history', value: [DAY] },
  { kind: 'walk',   key: 'purin_walk_history',    table: 'walk_history',  value: [WALK] },
  { kind: 'indoor', key: 'purin_indoor_history',  table: 'indoor_history', value: [RIDE] },
  { kind: 'foods',  key: 'purin_custom_foods',    table: 'lebensmittel',  value: [FOOD] },
];

test.describe('Gelöschte Daten kommen nicht zurück', () => {
  for (const { kind, key, table, value } of KINDS) {
    test(`${kind}: bekanntes Gerät, Server leer → lokal leeren, nichts hochladen`, async ({ page }) => {
      const requests = await setupSupabase(page);
      await page.evaluate(({ key, value, kind }) => {
        localStorage.setItem(key, JSON.stringify(value));
        if (kind === 'foods') customFoods = value; // liveRefresh arbeitet mit dem Speicher-Array
        const markKeys = { purin: 'purin_synced_purin', walk: 'purin_synced_walk', foods: 'purin_synced_foods', indoor: 'purin_indoor_synced' };
        localStorage.setItem(markKeys[kind], '1');
        return liveRefresh();
      }, { key, value, kind });

      await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), key)).toBe('[]');
      expect(writesTo(requests, table)).toEqual([]);
    });

    test(`${kind}: nie synchronisiert, Server leer → lokale Daten werden hochgeladen`, async ({ page }) => {
      const requests = await setupSupabase(page);
      await page.evaluate(({ key, value, kind }) => {
        const markKeys = { purin: 'purin_synced_purin', walk: 'purin_synced_walk', foods: 'purin_synced_foods', indoor: 'purin_indoor_synced' };
        localStorage.removeItem(markKeys[kind]);
        localStorage.setItem(key, JSON.stringify(value));
        if (kind === 'foods') customFoods = value;
        return liveRefresh();
      }, { key, value, kind });

      await expect.poll(() => writesTo(requests, table).length).toBeGreaterThan(0);
      expect(writesTo(requests, table).some((r) => r.method === 'POST' || r.method === 'PATCH')).toBe(true);
    });
  }
});
