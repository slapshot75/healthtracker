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

test('Geheinheit speichern: Bestätigung am Button und Eintrag in der Historie', async ({ page }) => {
  await page.click('#btn-save-walk');
  await expect(page.locator('#btn-save-walk')).toHaveText('✓ Gespeichert');

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('purin_walk_history')));
  expect(saved).toHaveLength(1);
  expect(saved[0]).toMatchObject({ weight: 75, speed: 2.5, grade: 13, duration: 60, dist: 2500, kcal: 392 });
});

test('Walk-Berechnung: exakte Werte bei Standard-Einstellungen', async ({ page }) => {
  // 75 kg, 2,5 km/h, 13 % Steigung, 60 min, 45 Jahre, männlich. Von Hand nachgerechnet:
  //   VO2  = 3,5 + 0,1·41,67 + 1,8·41,67·0,13 = 17,42 ml/kg/min → MET 4,98
  //   kcal = 4,976 · 75 · 3,5 / 200 = 6,53 je Minute → 392 gesamt
  //   Puls = 70 + (17,42 / 35) · (175 − 70) = 122
  //   Schritte = 2500 / (0,7 − 0,13·0,8) = 4195; Wasser = 500 + 392
  await expect(page.locator('#r-dist')).toHaveText('2.500');
  await expect(page.locator('#r-elev')).toHaveText('325');
  await expect(page.locator('#r-kcal')).toHaveText('392');
  await expect(page.locator('#r-kcal-min')).toHaveText('6.5');
  await expect(page.locator('#r-met')).toHaveText('5');
  await expect(page.locator('#r-hr')).toHaveText('122');
  await expect(page.locator('#r-steps')).toHaveText('4.195');
  await expect(page.locator('#r-water')).toHaveText('892');
});

test('Geschlecht weiblich: höherer Ruhepuls geht in die Herzfrequenz ein', async ({ page }) => {
  await page.check('input[name="w-sex"][value="f"]');
  // 74 + (17,42 / 35) · (175 − 74) = 124
  await expect(page.locator('#r-hr')).toHaveText('124');
});
