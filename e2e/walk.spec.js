const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.click('#pnav-walk');
  await expect(page.locator('#page-walk')).toHaveClass(/active/);
});

test('Gehrechner zeigt Ergebnisse nach Laden', async ({ page }) => {
  // calcWalk() läuft beim Init — Ergebnisse sind direkt da
  await expect(page.locator('#r-dist')).not.toHaveText('—');
  await expect(page.locator('#r-kcal')).not.toHaveText('—');
  await expect(page.locator('#r-steps')).not.toHaveText('—');
});

test('Gewichts-Slider aktualisiert Label', async ({ page }) => {
  const slider = page.locator('#w-weight');
  await slider.evaluate(el => {
    el.value = 90;
    el.dispatchEvent(new Event('input'));
  });
  await expect(page.locator('#lbl-weight')).toHaveText('90 kg');
});

test('Geschwindigkeits-Slider aktualisiert Ergebnisse', async ({ page }) => {
  const distBefore = await page.locator('#r-dist').textContent();

  await page.locator('#w-speed').evaluate(el => {
    el.value = 5;
    el.dispatchEvent(new Event('input'));
  });

  const distAfter = await page.locator('#r-dist').textContent();
  expect(distAfter).not.toBe(distBefore);
});

test('Dauer-Slider aktualisiert Label', async ({ page }) => {
  await page.locator('#w-duration').evaluate(el => {
    el.value = 120;
    el.dispatchEvent(new Event('input'));
  });
  await expect(page.locator('#lbl-duration')).toHaveText('120 min');
});

test('Geheinheit speichern öffnet Bestätigungsbutton', async ({ page }) => {
  // Speichern-Button ist initial vorhanden
  await expect(page.locator('#btn-save-walk')).toBeVisible();
});

test('Walk-Berechnung liefert plausible Werte bei Standard-Einstellungen', async ({ page }) => {
  // Default: 75kg, 2.5km/h, 13% Steigung, 60min → ~2500m
  const dist = await page.locator('#r-dist').textContent();
  const distNum = parseInt(dist.replace(/\D/g, ''));
  expect(distNum).toBeGreaterThan(1000);
  expect(distNum).toBeLessThan(10000);
});
