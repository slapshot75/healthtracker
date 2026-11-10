import { test, expect } from './support/fixtures.js';

// Prüft die Content-Security-Policy im echten Browser (ohne bypassCSP).
test.use({ bypassCSP: false });

test.describe('Content-Security-Policy', () => {
  test('Policy ist gesetzt und erlaubt nur den Supabase-Host für Verbindungen', async ({ page }) => {
    await page.goto('/');
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("connect-src 'self' https://sqcdjemmerejltbncqrs.supabase.co");
    expect(csp).toContain("object-src 'none'");
  });

  test('Verbindung an einen fremden Host wird vom Browser blockiert', async ({ page }) => {
    await page.goto('/');
    const violations = await page.evaluate(async () => {
      const seen = [];
      document.addEventListener('securitypolicyviolation', (e) => seen.push(e.violatedDirective));
      try { await fetch('https://example.com/probe'); } catch (e) { /* erwartet */ }
      await new Promise((r) => setTimeout(r, 200));
      return seen;
    });
    expect(violations.some((d) => d.startsWith('connect-src'))).toBe(true);
  });

  test('App läuft ohne CSP-Verletzungen (Laden, Tabs, Theme, Seitenwechsel)', async ({ page }) => {
    const violations = [];
    page.on('console', (msg) => { if (/Content Security Policy|Refused to/i.test(msg.text())) violations.push(msg.text()); });
    await page.goto('/');
    await page.click('#theme-toggle');
    await page.click('#pnav-walk');
    await page.click('#pnav-purin');
    await page.click('#tab-btn-history');
    await page.waitForTimeout(300);
    expect(violations).toEqual([]);
  });

  test('Skript von einem fremden Host wird blockiert', async ({ page }) => {
    await page.goto('/');
    const violations = await page.evaluate(async () => {
      const seen = [];
      document.addEventListener('securitypolicyviolation', (e) => seen.push(e.violatedDirective));
      const s = document.createElement('script');
      s.src = 'https://example.com/evil.js';
      document.head.appendChild(s);
      await new Promise((r) => setTimeout(r, 300));
      return seen;
    });
    expect(violations.some((d) => d.startsWith('script-src'))).toBe(true);
  });
});
