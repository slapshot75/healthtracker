import { test, expect } from '@playwright/test';

// Durchgehender Nutzerweg über die Oberfläche (ohne Cloud):
// Lebensmittel erfassen → Tag speichern → Historie → Menge bearbeiten → Tag löschen.

test('Tag erfassen, speichern, bearbeiten und löschen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tbody tr').first()).toBeVisible();

  // 100 g erfassen
  await page.fill('#tracker-search', 'Schweinefleisch');
  await page.locator('#suggestions > div').first().click();
  await page.fill('#tracker-grams', '100');
  await page.click('button[onclick="addFromInput()"]');
  await expect(page.locator('#tracker-totals')).toBeVisible();

  // Tag speichern wechselt in die Historie
  await expect(page.locator('#btn-save-day')).toBeEnabled();
  await page.click('#btn-save-day');
  await expect(page.locator('#tab-history')).toHaveClass(/active/);
  const day = page.locator('.history-day');
  await expect(day).toHaveCount(1);
  await expect(day.locator('.history-day-item-name')).toContainText('(100 g)');

  const kcalPill = day.locator('.history-day-pill', { hasText: 'kcal' }).locator('strong');
  const kcal100 = Number(await kcalPill.textContent());
  expect(kcal100).toBeGreaterThan(0);

  // Bearbeiten: Menge verdoppeln
  await day.locator('button[title="Tag bearbeiten"]').click();
  await expect(page.locator('#edit-modal')).toHaveClass(/open/);
  await page.locator('#edit-items .edit-item-grams').fill('200');
  await page.click('#edit-modal .btn-confirm');
  await expect(page.locator('#edit-modal')).not.toHaveClass(/open/);

  await expect(day.locator('.history-day-item-name')).toContainText('(200 g)');
  await expect(kcalPill).toHaveText(String(kcal100 * 2));

  // Die Änderung liegt im Speicher, nicht nur in der Anzeige
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('purin_tracker_history')));
  expect(stored).toHaveLength(1);
  expect(stored[0].items[0].grams).toBe(200);
  expect(stored[0].totals.kcal).toBe(kcal100 * 2);

  // Löschen
  await day.locator('button[title="Tag löschen"]').click();
  await expect(page.locator('.history-day')).toHaveCount(0);
  await expect(page.locator('#history-list')).toContainText('Noch keine gespeicherten Tage');
  expect(await page.evaluate(() => localStorage.getItem('purin_tracker_history'))).toBe('[]');
});
