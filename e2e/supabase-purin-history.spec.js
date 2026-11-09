import { test, expect } from '@playwright/test';
import { setupSupabase, writesTo, readsFrom } from './support/supabase-mock.js';

// Charakterisierungstests für die Purin-Historie gegen Supabase.
// Ziel: das heutige Verhalten (Tabelle, Filter, Körper, Reihenfolge) festhalten,
// damit der Umbau in js/supabase.js nichts unbemerkt verändert.

test.describe('Supabase – purin_history Schreiboperationen', () => {
  test('saveDay ohne bestehenden Eintrag: PATCH ohne Treffer, dann POST mit vollständigem Körper', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate(() => {
      trackerItems.length = 0;
      addTrackerItem({ name: 'Testfood', purin: 50, kcal: 100, protein: 5, carbs: 10, fat: 2, fiber: 0 }, 100);
      saveDay();
    });

    await expect.poll(() => writesTo(requests, 'purin_history').length).toBe(2);
    const [patch, post] = writesTo(requests, 'purin_history');

    expect(patch.method).toBe('PATCH');
    expect(patch.query).toMatch(/user_id=eq\.mario/);
    expect(patch.query).toMatch(/ts=eq\.\d+/);
    // Nie vorher löschen: ein fehlgeschlagener POST darf keinen Eintrag entfernen
    expect(writesTo(requests, 'purin_history').some((r) => r.method === 'DELETE')).toBe(false);

    expect(post.method).toBe('POST');
    expect(post.body.user_id).toBe('mario');
    expect(post.body.ts).toBe(Number(patch.query.match(/ts=eq\.(\d+)/)[1]));
    expect(post.body.items).toHaveLength(1);
    expect(post.body.items[0].name).toBe('Testfood');
    expect(post.body.totals).toMatchObject({ purin: 50, kcal: 100 });
    expect(typeof post.body.date).toBe('string');
  });

  test('saveDay mit bestehendem Eintrag: nur PATCH, kein DELETE, kein POST', async ({ page }) => {
    const requests = await setupSupabase(page, { 'PATCH:purin_history': [{ ts: 1 }] });

    await page.evaluate(() => {
      trackerItems.length = 0;
      addTrackerItem({ name: 'Testfood', purin: 50, kcal: 100, protein: 5, carbs: 10, fat: 2, fiber: 0 }, 100);
      saveDay();
    });

    await expect.poll(() => writesTo(requests, 'purin_history').length).toBe(1);
    await page.waitForTimeout(300);
    expect(writesTo(requests, 'purin_history').map((r) => r.method)).toEqual(['PATCH']);
  });

  test('saveDay: schlägt der POST fehl, wird nichts gelöscht', async ({ page }) => {
    const requests = await setupSupabase(page, { 'FAIL:POST:purin_history': true });

    await page.evaluate(() => {
      trackerItems.length = 0;
      addTrackerItem({ name: 'Testfood', purin: 50, kcal: 100, protein: 5, carbs: 10, fat: 2, fiber: 0 }, 100);
      saveDay();
    });

    // Der fehlgeschlagene Vorgang bleibt in der Warteschlange und wird bei jedem
    // weiteren Schreibvorgang erneut versucht: nur PATCH/POST, nie DELETE.
    await expect.poll(() => writesTo(requests, 'purin_history').length).toBeGreaterThanOrEqual(2);
    const methods = writesTo(requests, 'purin_history').map((r) => r.method);
    expect(methods.every((m) => m === 'PATCH' || m === 'POST')).toBe(true);
    expect(methods).not.toContain('DELETE');
  });

  test('deleteDay: DELETE filtert nach user_id und ts', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate(() => deleteDay(1700000000000));

    await expect.poll(() => writesTo(requests, 'purin_history').length).toBe(1);
    const [del] = writesTo(requests, 'purin_history');
    expect(del.method).toBe('DELETE');
    expect(del.query).toBe('?user_id=eq.mario&ts=eq.1700000000000');
  });

  test('clearHistory: DELETE ohne ts-Filter, nur für user_id', async ({ page }) => {
    const requests = await setupSupabase(page);

    await page.evaluate(() => clearHistory());

    await expect.poll(() => writesTo(requests, 'purin_history').length).toBe(1);
    const [del] = writesTo(requests, 'purin_history');
    expect(del.method).toBe('DELETE');
    expect(del.query).toBe('?user_id=eq.mario');
  });

  test('clearHistory: ohne Bestätigung passiert nichts in der Datenbank', async ({ page }) => {
    const requests = await setupSupabase(page);
    page.removeAllListeners('dialog');
    page.on('dialog', (d) => d.dismiss());

    await page.evaluate(() => clearHistory());
    await page.waitForTimeout(500);

    expect(writesTo(requests, 'purin_history')).toHaveLength(0);
  });
});

test.describe('Supabase – purin_history Leseoperationen', () => {
  test('liveRefresh: liest die letzten 90 Tage sortiert und übernimmt abweichenden Stand', async ({ page }) => {
    const row = { ts: 1700000003000, date: 'Donnerstag, 16.11.2023', items: [], totals: { purin: 10 } };
    const requests = await setupSupabase(page, { purin_history: [row] });

    await page.evaluate(() => liveRefresh());

    const reads = readsFrom(requests, 'purin_history');
    expect(reads.some((r) => r.query === '?user_id=eq.mario&order=ts.desc&limit=90')).toBe(true);
    const local = await page.evaluate(() => getHistory());
    expect(local).toEqual([{ ts: row.ts, date: row.date, items: [], totals: { purin: 10 } }]);
  });
});
