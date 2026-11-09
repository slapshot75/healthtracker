import { test, expect } from '@playwright/test';
import { setupSupabase } from './support/supabase-mock.js';

// Regressionstest: Gespeicherte Werte aus der Datenbank dürfen nie als HTML ausgeführt werden.
// Der Payload kommt wie ein manipulierter Serverstand über purin_history an.

const PAYLOAD = '<img src="x-payload" onerror="window.__xss = 1">';

test.describe('Escaping – Historie aus der Datenbank', () => {
  test('manipulierte Felder werden als Text angezeigt, nicht als HTML ausgeführt', async ({ page }) => {
    await setupSupabase(page, {
      purin_history: [{
        ts: 1700000000000,
        date: PAYLOAD,
        items: [{ id: 1, name: 'Testfood', grams: PAYLOAD, purin: PAYLOAD, kcal: 1, protein: 1, carbs: 1, fat: 1, fiber: 0 }],
        totals: { purin: PAYLOAD, kcal: 1, protein: 1, carbs: 1, fat: 1, fiber: 0 },
      }],
    });

    // Historie wird beim Live-Sync gerendert. Der Eintrag muss dort sichtbar sein.
    await page.evaluate(() => renderHistory());
    await expect(page.locator('.history-day').first()).toBeAttached();

    // Kein eingeschleustes Element, kein ausgeführtes Skript
    expect(await page.locator('img[src="x-payload"]').count()).toBe(0);
    expect(await page.evaluate(() => window.__xss)).toBeUndefined();

    // Der Payload steht als Text im Dokument
    const html = await page.locator('.history-day').first().innerHTML();
    expect(html).toContain('&lt;img');
  });
});
