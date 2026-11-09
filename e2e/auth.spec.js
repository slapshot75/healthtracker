import { test, expect } from '@playwright/test';
import { setupSupabase, readsFrom, TEST_PASSWORD } from './support/supabase-mock.js';

// Charakterisierungstests für die Passwort-Anmeldung (Supabase Auth).

test.describe('Anmeldung', () => {
  test('ohne Sitzung wird die Login-Maske gezeigt', async ({ page }) => {
    await setupSupabase(page, {}, { loggedIn: false });
    await expect(page.locator('#login-overlay')).toHaveClass(/open/);
  });

  test('falsches Passwort: Fehlermeldung, Maske bleibt offen', async ({ page }) => {
    await setupSupabase(page, {}, { loggedIn: false });
    await page.fill('#login-email', 'test@example.com');
    await page.fill('#login-password', 'falsch');
    await page.click('#login-submit');

    await expect(page.locator('#login-error')).toHaveText('E-Mail oder Passwort falsch');
    await expect(page.locator('#login-overlay')).toHaveClass(/open/);
  });

  test('richtiges Passwort: Maske schließt, neues Token wird genutzt', async ({ page }) => {
    const requests = await setupSupabase(page, {}, { loggedIn: false });
    await page.fill('#login-email', 'test@example.com');
    await page.fill('#login-password', TEST_PASSWORD);
    await page.click('#login-submit');

    await expect(page.locator('#login-overlay')).not.toHaveClass(/open/);

    const authCall = requests.find((r) => r.table === 'auth');
    expect(authCall.query).toBe('/auth/v1/token?grant_type=password');
    expect(authCall.body).toEqual({ email: 'test@example.com', password: TEST_PASSWORD });

    // Nach dem Login lädt die App den Serverstand mit dem neuen Token
    await expect.poll(() => readsFrom(requests, 'purin_history').length).toBeGreaterThan(0);
    expect(readsFrom(requests, 'purin_history')[0].auth).toBe('Bearer new-access');
  });

  test('angemeldet: Anfragen tragen das Sitzungs-Token, nicht den Anon-Key', async ({ page }) => {
    const requests = await setupSupabase(page);
    await page.evaluate(() => SupabaseSync.pullDays());

    const reads = readsFrom(requests, 'purin_history');
    expect(reads.length).toBe(1);
    expect(reads[0].auth).toBe('Bearer test-access');
    expect(reads[0].auth).not.toContain('test-key');
  });
});
