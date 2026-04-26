const { test, expect } = require('@playwright/test');

test('App lädt mit korrektem Titel', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Healthcheck/);
});

test('Purin-Seite ist beim Start aktiv', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#page-purin')).toHaveClass(/active/);
  await expect(page.locator('#page-walk')).not.toHaveClass(/active/);
});

test('Zu Gehrechner wechseln und zurück', async ({ page }) => {
  await page.goto('/');
  await page.click('#pnav-walk');
  await expect(page.locator('#page-walk')).toHaveClass(/active/);
  await expect(page.locator('#page-purin')).not.toHaveClass(/active/);

  await page.click('#pnav-purin');
  await expect(page.locator('#page-purin')).toHaveClass(/active/);
});

test('Purin-Tabs wechseln', async ({ page }) => {
  await page.goto('/');

  await page.click('#tab-btn-history');
  await expect(page.locator('#tab-history')).toHaveClass(/active/);
  await expect(page.locator('#tab-tracker')).not.toHaveClass(/active/);

  await page.click('#tab-btn-chart');
  await expect(page.locator('#tab-chart')).toHaveClass(/active/);

  await page.click('#tab-btn-tracker');
  await expect(page.locator('#tab-tracker')).toHaveClass(/active/);
});

test('Walk-Tabs wechseln', async ({ page }) => {
  await page.goto('/');
  await page.click('#pnav-walk');

  await page.click('#wtab-btn-history');
  await expect(page.locator('#wtab-history')).toHaveClass(/active/);

  await page.click('#wtab-btn-calc');
  await expect(page.locator('#wtab-calc')).toHaveClass(/active/);
});
