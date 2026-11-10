import { test, expect } from './support/fixtures.js';
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

test.describe('Escaping – Inline-Handler', () => {
  test('Monats-Chip: onclick ist nach HTML-Decodierung gültiger JavaScript-Code', async ({ page }) => {
    await setupSupabase(page);
    await page.evaluate(() => {
      localStorage.setItem('purin_tracker_history', JSON.stringify([
        { ts: 1700000000000, date: 'Dienstag, 14.11.2023', items: [], totals: { purin: 0, kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } },
      ]));
      renderHistory();
    });
    const attr = await page.locator('.month-chip').first().getAttribute('onclick');
    // Der Browser hat den HTML-Teil bereits decodiert; der Ausdruck muss als JS parsbar sein
    expect(() => new Function(attr)).not.toThrow();
    expect(attr).toMatch(/^selectHistoryMonth\('purin',".*"\)$/);
  });
});
