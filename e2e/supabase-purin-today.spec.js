import { test, expect } from './support/fixtures.js';
import { setupSupabase, writesTo, readsFrom } from './support/supabase-mock.js';

// Charakterisierungstests für den aktuellen Tagesverbrauch (purin_today).

const ITEM = { id: 1, name: 'Testfood', grams: 100, unit: 'g', purin: 50, kcal: 100, protein: 5, carbs: 10, fat: 2, fiber: 0 };

test.describe('Supabase – purin_today', () => {
  test('saveToStorage: PATCH über user_id, ohne Treffer POST mit items und settings, kein DELETE', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate((item) => {
      trackerItems = [item];
      saveToStorage();
    }, ITEM);

    await expect.poll(() => writesTo(requests, 'purin_today').length).toBe(2);
    const [patch, post] = writesTo(requests, 'purin_today');

    expect(patch.method).toBe('PATCH');
    expect(patch.query).toBe('?user_id=eq.mario');
    expect(writesTo(requests, 'purin_today').some((r) => r.method === 'DELETE')).toBe(false);

    expect(post.method).toBe('POST');
    expect(post.body.user_id).toBe('mario');
    expect(typeof post.body.ts).toBe('number');
    expect(post.body.items).toEqual([ITEM]);
    expect(post.body.settings).toEqual({ purin_limit: 180, purin_limit_ts: 0, kcal_goal: null, kcal_goal_ts: 0, base_burn: null, base_burn_ts: 0 });
  });

  test('pushToday: schlägt der POST fehl, wird nichts gelöscht', async ({ page }) => {
    const requests = await setupSupabase(page, { 'FAIL:POST:purin_today': true });

    await page.evaluate((item) => {
      trackerItems = [item];
      saveToStorage();
    }, ITEM);

    await expect.poll(() => writesTo(requests, 'purin_today').length).toBe(2);
    await page.waitForTimeout(300);
    const methods = writesTo(requests, 'purin_today').map((r) => r.method);
    expect(methods).toEqual(['PATCH', 'POST']);
  });

  test('liveRefresh: übernimmt neueren Serverstand in den Tracker', async ({ page }) => {
    const serverItem = { ...ITEM, id: 2, name: 'Serverfood', grams: 50 };
    const requests = await setupSupabase(page, {
      purin_today: [{ user_id: 'mario', ts: Date.now() + 600000, items: [serverItem], settings: { purin_limit: 180, purin_limit_ts: 0 } }],
    });

    await page.evaluate(() => liveRefresh());

    const reads = readsFrom(requests, 'purin_today');
    expect(reads.length).toBeGreaterThanOrEqual(1);
    expect(reads[0].query).toMatch(/user_id=eq\.mario/);

    const names = await page.evaluate(() => trackerItems.map((i) => i.name));
    expect(names).toEqual(['Serverfood']);
  });

  test('liveRefresh: lädt lokale Items hoch, wenn der Server keinen Eintrag hat', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate((item) => {
      trackerItems = [item];
      liveRefresh();
    }, ITEM);

    await expect.poll(() => writesTo(requests, 'purin_today').length).toBe(2);
    const [del, post] = writesTo(requests, 'purin_today');
    expect(del.query).toBe('?user_id=eq.mario');
    expect(post.body.items).toEqual([ITEM]);
  });
});
