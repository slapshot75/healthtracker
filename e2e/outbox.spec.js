import { test, expect } from '@playwright/test';
import { setupSupabase, writesTo } from './support/supabase-mock.js';

// Regressionstest: Ungesendete lokale Änderungen gehen nach einem Uploadfehler nicht verloren.
// Das Mock-Objekt (resp) wird nach dem Start geändert, damit der Start-Sync nicht schon eingreift.

const DAY = { ts: 1700000000000, date: '14.11.2023', items: [{ id: 1, name: 'X', grams: 100, purin: 50 }], totals: { purin: 50, kcal: 10, protein: 1, carbs: 1, fat: 1, fiber: 0 } };
const OTHER = { ts: 1700000000000, date: '14.11.2023', items: [{ id: 1, name: 'X', grams: 999, purin: 1 }], totals: { purin: 1, kcal: 1, protein: 0, carbs: 0, fat: 0, fiber: 0 } };

test.describe('Warteschlange für ungesendete Änderungen', () => {
  test('fehlgeschlagener Schreibvorgang bleibt in der Warteschlange und wird nachgeholt', async ({ page }) => {
    const resp = {};
    const requests = await setupSupabase(page, resp);
    resp['FAIL:POST:purin_history'] = true;

    const failed = await page.evaluate((day) => {
      localStorage.setItem('purin_tracker_history', JSON.stringify([day]));
      return SupabaseSync.saveDay(day).then(() => false, () => true);
    }, DAY);
    expect(failed).toBe(true);
    const queued = await page.evaluate(() => JSON.parse(localStorage.getItem('sb_outbox')));
    expect(queued).toHaveLength(1);

    // Server ist wieder erreichbar: Nachholen beim nächsten Abgleich
    delete resp['FAIL:POST:purin_history'];
    resp.purin_history = [DAY];
    await page.evaluate(() => liveRefresh());
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sb_outbox')).length)).toBe(0);
    const posts = writesTo(requests, 'purin_history').filter((r) => r.method === 'POST');
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[posts.length - 1].body.items[0].grams).toBe(100);
  });

  test('ausstehende Änderung wird vom Serverstand nicht überschrieben', async ({ page }) => {
    const resp = {};
    await setupSupabase(page, resp);
    resp['FAIL:POST:purin_history'] = true;
    resp['FAIL:PATCH:purin_history'] = true;

    await page.evaluate((day) => {
      localStorage.setItem('purin_tracker_history', JSON.stringify([day]));
      return SupabaseSync.saveDay(day).catch(() => {});
    }, DAY);

    // Server hat eine andere Fassung dieses Tages; der Abgleich darf sie nicht übernehmen
    resp.purin_history = [OTHER];
    await page.evaluate(() => liveRefresh());
    const local = await page.evaluate(() => JSON.parse(localStorage.getItem('purin_tracker_history')));
    expect(local[0].items[0].grams).toBe(100);
  });

  test('fehlgeschlagenes Löschen wird nicht durch den Serverstand rückgängig gemacht', async ({ page }) => {
    const resp = {};
    const requests = await setupSupabase(page, resp);
    resp['FAIL:DELETE:purin_history'] = true;

    await page.evaluate((day) => {
      localStorage.setItem('purin_tracker_history', JSON.stringify([day]));
      return SupabaseSync.deleteDay(day.ts).catch(() => {});
    }, DAY);
    // Lokal ist der Tag bereits entfernt, der Server hat ihn noch
    await page.evaluate(() => localStorage.setItem('purin_tracker_history', '[]'));
    resp.purin_history = [DAY];

    await page.evaluate(() => liveRefresh());
    const local = await page.evaluate(() => JSON.parse(localStorage.getItem('purin_tracker_history')));
    expect(local).toEqual([]);
    expect(writesTo(requests, 'purin_history').some((r) => r.method === 'DELETE')).toBe(true);
  });
});
