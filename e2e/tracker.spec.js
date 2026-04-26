const { test, expect } = require('@playwright/test');

test('Lebensmitteltabelle wird geladen', async ({ page }) => {
  await page.goto('/');
  // Warte bis mindestens eine Tabellenzeile da ist
  await expect(page.locator('#tbody tr').first()).toBeVisible({ timeout: 10000 });
  const rowCount = await page.locator('#tbody tr').count();
  expect(rowCount).toBeGreaterThan(50);
});

test('Tabellensuche filtert Ergebnisse', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tbody tr').first()).toBeVisible({ timeout: 10000 });

  await page.fill('#search', 'Schwein');
  const rowCount = await page.locator('#tbody tr').count();
  expect(rowCount).toBeGreaterThan(0);

  const firstRow = await page.locator('#tbody tr').first().textContent();
  expect(firstRow.toLowerCase()).toContain('schwein');
});

test('Tabelle nach Name sortieren', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tbody tr').first()).toBeVisible({ timeout: 10000 });

  await page.click('#th-name');
  await expect(page.locator('#th-name')).toHaveClass(/sorted/);
});

test('Tracker-Suche zeigt Vorschläge', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tbody tr').first()).toBeVisible({ timeout: 10000 });

  await page.fill('#tracker-search', 'Schwein');
  await expect(page.locator('#suggestions')).toBeVisible();

  const items = page.locator('#suggestions > div');
  await expect(items.first()).toBeVisible();
});

test('Lebensmittel per Suche zum Tracker hinzufügen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tbody tr').first()).toBeVisible({ timeout: 10000 });

  // Suchen und ersten Vorschlag auswählen
  await page.fill('#tracker-search', 'Schweinefleisch');
  await expect(page.locator('#suggestions')).toBeVisible();
  await page.locator('#suggestions > div').first().click();

  // Direkt per Button hinzufügen
  await page.click('button[onclick="addFromInput()"]');

  // Tracker-Liste sollte sichtbar sein
  await expect(page.locator('#tracker-list')).toBeVisible();
  await expect(page.locator('#tracker-empty')).not.toBeVisible();
  await expect(page.locator('#tracker-totals')).toBeVisible();
});

test('Lebensmittel per quickAdd-Modal hinzufügen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tbody tr').first()).toBeVisible({ timeout: 10000 });

  // "+" Button der ersten Tabellenzeile klicken
  await page.locator('#tbody tr').first().locator('.btn-add-row').click();

  // Modal öffnet sich
  await expect(page.locator('#gram-modal')).toHaveClass(/open/);
  await expect(page.locator('#modal-name')).not.toBeEmpty();

  // Bestätigen
  await page.click('.btn-confirm');

  // Tracker zeigt Item
  await expect(page.locator('#tracker-list')).toBeVisible();
  await expect(page.locator('#tracker-empty')).not.toBeVisible();
});

test('Tracker zurücksetzen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tbody tr').first()).toBeVisible({ timeout: 10000 });

  // Item hinzufügen
  await page.fill('#tracker-search', 'Schweinefleisch');
  await expect(page.locator('#suggestions')).toBeVisible();
  await page.locator('#suggestions > div').first().click();
  await page.click('button[onclick="addFromInput()"]');
  await expect(page.locator('#tracker-list')).toBeVisible();

  // Zurücksetzen und Dialog bestätigen
  page.once('dialog', dialog => dialog.accept());
  await page.click('button[onclick="resetTracker()"]');

  await expect(page.locator('#tracker-empty')).toBeVisible();
  await expect(page.locator('#tracker-list')).not.toBeVisible();
});
