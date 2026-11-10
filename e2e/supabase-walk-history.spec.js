import { test, expect } from './support/fixtures.js';
import { setupSupabase, writesTo, readsFrom } from './support/supabase-mock.js';

// Charakterisierungstests für die Geh-Historie (walk_history).

const WALK = { km: 5, kcal: 300, steps: 6500 };

test.describe('Supabase – walk_history', () => {
  test('saveWalkDay ohne bestehenden Eintrag: PATCH ohne Treffer, dann POST mit data', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate((walk) => {
      lastWalkResult = walk;
      saveWalkDay();
    }, WALK);

    await expect.poll(() => writesTo(requests, 'walk_history').length).toBe(2);
    const [patch, post] = writesTo(requests, 'walk_history');

    expect(patch.method).toBe('PATCH');
    expect(patch.query).toMatch(/^\?ts=eq\.\d+&user_id=eq\.mario$/);

    expect(post.method).toBe('POST');
    expect(post.body.user_id).toBe('mario');
    expect(post.body.ts).toBe(Number(patch.query.match(/ts=eq\.(\d+)/)[1]));
    expect(typeof post.body.date).toBe('string');
    expect(post.body.data).toMatchObject({ ...WALK, ts: post.body.ts, date: post.body.date });
  });

  test('deleteWalkDay: DELETE filtert nach user_id und ts', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate(() => deleteWalkDay(1700000001000));

    await expect.poll(() => writesTo(requests, 'walk_history').length).toBe(1);
    const [del] = writesTo(requests, 'walk_history');
    expect(del.method).toBe('DELETE');
    expect(del.query).toBe('?user_id=eq.mario&ts=eq.1700000001000');
  });

  test('clearWalkHistory: DELETE ohne ts-Filter, nur für user_id', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate(() => clearWalkHistory());

    await expect.poll(() => writesTo(requests, 'walk_history').length).toBe(1);
    const [del] = writesTo(requests, 'walk_history');
    expect(del.method).toBe('DELETE');
    expect(del.query).toBe('?user_id=eq.mario');
  });

  test('liveRefresh: liest walk_history sortiert und übernimmt abweichenden Serverstand', async ({ page }) => {
    const requests = await setupSupabase(page, {
      walk_history: [{ ts: 1700000001000, date: 'Dienstag, 14.11.2023', data: { km: 3, kcal: 120 } }],
    });

    await page.evaluate(() => liveRefresh());

    const reads = readsFrom(requests, 'walk_history');
    expect(reads.length).toBeGreaterThanOrEqual(1);
    expect(reads[0].query).toBe('?user_id=eq.mario&order=ts.desc&limit=200');

    const local = await page.evaluate(() => getWalkHistory());
    expect(local).toEqual([{ km: 3, kcal: 120, ts: 1700000001000, date: 'Dienstag, 14.11.2023' }]);
  });

  test('liveRefresh: lädt lokale Geh-Historie hoch, wenn der Server leer ist', async ({ page }) => {
    const requests = await setupSupabase(page);
    const entry = { ts: 1700000002000, date: 'Mittwoch, 15.11.2023', km: 4, kcal: 200 };

    await page.evaluate((e) => {
      // Erstgerät simulieren: noch nie synchronisiert
      localStorage.removeItem('purin_synced_walk');
      localStorage.setItem('purin_walk_history', JSON.stringify([e]));
      liveRefresh();
    }, entry);

    await expect.poll(() => writesTo(requests, 'walk_history').length).toBe(2);
    const [del, post] = writesTo(requests, 'walk_history');
    expect(del.query).toBe('?ts=eq.1700000002000&user_id=eq.mario');
    expect(post.body.data).toEqual(entry);
  });
});
