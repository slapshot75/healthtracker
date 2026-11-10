import { test, expect } from '@playwright/test';
import { setupSupabase, SUPABASE } from './support/supabase-mock.js';

// Sitzungs-Erneuerung in js/supabase.js: Antwortet der Server mit 401, wird das Token
// einmal erneuert und die Anfrage wiederholt. Lehnt der Auth-Server die Erneuerung
// eindeutig ab, endet die Sitzung und die Login-Maske erscheint.

// Erste Anfrage an purin_history mit 401 beantworten, alle weiteren normal.
async function firstReadUnauthorized(page) {
  const seen = [];
  await page.route(SUPABASE + '/rest/v1/purin_history**', async (route) => {
    const auth = route.request().headers()['authorization'] || '';
    seen.push(auth);
    if (seen.length === 1) {
      await route.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"JWT expired"}' });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[{"ts":1}]' });
    }
  });
  return seen;
}

test.describe('Sitzung erneuern', () => {
  test('401: Token wird erneuert und die Anfrage mit dem neuen Token wiederholt', async ({ page }) => {
    await setupSupabase(page);
    const refreshBodies = [];
    await page.route(SUPABASE + '/auth/v1/**', async (route) => {
      refreshBodies.push({ url: route.request().url(), body: JSON.parse(route.request().postData()) });
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        access_token: 'refreshed-access', refresh_token: 'refreshed-refresh', expires_in: 3600,
      }) });
    });
    const seen = await firstReadUnauthorized(page);

    const rows = await page.evaluate(() => SupabaseSync.pullDays());

    expect(rows).toEqual([{ ts: 1 }]);
    expect(seen).toEqual(['Bearer test-access', 'Bearer refreshed-access']);
    expect(refreshBodies).toHaveLength(1);
    expect(refreshBodies[0].url).toContain('/auth/v1/token?grant_type=refresh_token');
    expect(refreshBodies[0].body).toEqual({ refresh_token: 'test-refresh' });

    const session = await page.evaluate(() => JSON.parse(localStorage.getItem('sb_session')));
    expect(session.access_token).toBe('refreshed-access');
    expect(session.refresh_token).toBe('refreshed-refresh');
    expect(session.email).toBe('test@example.com');
    await expect(page.locator('#login-overlay')).not.toHaveClass(/open/);
  });

  test('401 und abgelehnte Erneuerung: Sitzung endet, Login-Maske erscheint', async ({ page }) => {
    // Die Attrappe lehnt Erneuerungen ab (400), weil kein gültiges Passwort mitkommt.
    await setupSupabase(page);
    const seen = await firstReadUnauthorized(page);

    const error = await page.evaluate(() => SupabaseSync.pullDays().then(() => null, (e) => e.message));

    expect(error).not.toBeNull();
    expect(seen).toHaveLength(1); // keine Wiederholung ohne gültiges Token
    expect(await page.evaluate(() => localStorage.getItem('sb_session'))).toBeNull();
    expect(await page.evaluate(() => SupabaseSync.isLoggedIn())).toBe(false);
    await expect(page.locator('#login-overlay')).toHaveClass(/open/);
  });

  test('Netzfehler bei der Erneuerung: Sitzung bleibt bestehen', async ({ page }) => {
    await setupSupabase(page);
    await page.route(SUPABASE + '/auth/v1/**', (route) => route.abort('failed'));
    await firstReadUnauthorized(page);

    const error = await page.evaluate(() => SupabaseSync.pullDays().then(() => null, (e) => e.message));

    expect(error).not.toBeNull();
    expect(await page.evaluate(() => SupabaseSync.isLoggedIn())).toBe(true);
    await expect(page.locator('#login-overlay')).not.toHaveClass(/open/);
  });

  test('Abmelden: Sitzung wird entfernt, Login-Maske erscheint', async ({ page }) => {
    await setupSupabase(page); // bestätigt Dialoge automatisch
    await page.evaluate(() => logoutSupabase());

    expect(await page.evaluate(() => localStorage.getItem('sb_session'))).toBeNull();
    await expect(page.locator('#login-overlay')).toHaveClass(/open/);
  });
});
