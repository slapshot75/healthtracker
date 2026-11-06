import { test, expect } from '@playwright/test';

test('HealthTracker-Startseite lädt erfolgreich', async ({ page }) => {
  const response = await page.goto('/');

  expect(response).not.toBeNull();
  expect(response!.ok()).toBeTruthy();

  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveTitle('');
});