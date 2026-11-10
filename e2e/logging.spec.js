import { test, expect } from './support/fixtures.js';
import { setupSupabase } from './support/supabase-mock.js';

// Regressionstest: Fehlerprotokolle enthalten nur den Status, nie den Serverantworttext.
// Der Mock antwortet mit "simulated failure"; dieser Text darf nicht in der Konsole erscheinen.

test('Schreibfehler wird ohne Serverantworttext protokolliert', async ({ page }) => {
  const logs = [];
  page.on('console', (m) => logs.push(m.text()));
  await setupSupabase(page, { 'FAIL:POST:purin_history': true });
  logs.length = 0;

  await page.evaluate(() => dbAutoSave(() => SupabaseSync.saveDay({ ts: 1700000000000, date: 'x', items: [], totals: {} })));

  await expect.poll(() => logs.some((l) => l.includes('Auto-Sync'))).toBe(true);
  const all = logs.join('\n');
  expect(all).toContain('HTTP 500');
  expect(all).not.toContain('simulated failure');
});
