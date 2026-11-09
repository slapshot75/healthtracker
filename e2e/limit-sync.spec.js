import { test, expect } from '@playwright/test';
import { setupSupabase, writesTo } from './support/supabase-mock.js';

// Regressionstest: Die Anmeldung (syncDownload) darf ein neueres Server-Limit nicht
// durch den älteren lokalen Wert überschreiben.

test.describe('Purin-Limit beim Herunterladen', () => {
  test('neueres Server-Limit gewinnt, älterer lokaler Wert wird nicht zurückgeschrieben', async ({ page }) => {
    const resp = {};
    const requests = await setupSupabase(page, resp);

    await page.evaluate(() => {
      _limitSettings = { limit: 500, ts: 1000000000000 };
      localStorage.setItem('purin_limit_settings', JSON.stringify(_limitSettings));
    });
    // Server-Stand: Limit 700, neuerer Zeitstempel. Eintrag von vor langer Zeit (kein Tag von heute)
    resp.purin_today = [{ ts: 1700000000000, items: [], settings: { purin_limit: 700, purin_limit_ts: 2000000000000 } }];

    await page.evaluate(() => syncDownload());

    const limit = await page.evaluate(() => _limitSettings.limit);
    expect(limit).toBe(700);
    const written = writesTo(requests, 'purin_today').map((r) => r.body?.settings?.purin_limit);
    expect(written).not.toContain(500);
  });
});
