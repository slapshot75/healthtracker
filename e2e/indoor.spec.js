import { test, expect } from '@playwright/test';

// Indoor-Rad-Rechner: feste Eingaben, von Hand nachgerechnete Ergebnisse.
//   IF   = NP / FTP
//   TSS  = Sekunden · NP · IF / (FTP · 36)
//   kJ   = Ø Watt · Sekunden / 1000
//   kcal = kJ / Wirkungsgrad / 4,184

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.click('#pnav-indoor');
  await expect(page.locator('#page-indoor')).toHaveClass(/active/);
});

test('Standardwerte: 60 min, 150 W, FTP 150, 22 % Wirkungsgrad', async ({ page }) => {
  await expect(page.locator('#ri-if')).toHaveText('1,00');
  await expect(page.locator('#ri-tss')).toHaveText('100');
  await expect(page.locator('#ri-kj')).toHaveText('540');
  await expect(page.locator('#ri-kcal')).toHaveText('587');   // 540 / 0,22 / 4,184 = 586,7
});

test('eigene Eingaben mit NP: TSS, IF, Arbeit, Kalorien, Tempo', async ({ page }) => {
  await page.fill('#i-duration', '60');
  await page.fill('#i-watts', '200');
  await page.fill('#i-np', '220');
  await page.fill('#i-ftp', '250');
  await page.fill('#i-dist', '30');

  await expect(page.locator('#ri-if')).toHaveText('0,88');     // 220 / 250
  await expect(page.locator('#ri-tss')).toHaveText('77');      // 3600 · 220 · 0,88 / 9000 = 77,4
  await expect(page.locator('#ri-kj')).toHaveText('720');      // 200 · 3600 / 1000
  await expect(page.locator('#ri-kcal')).toHaveText('782');    // 720 / 0,22 / 4,184 = 782,2
  await expect(page.locator('#ri-speed')).toHaveText('30,0');
});

test('ohne NP zählt die Durchschnittsleistung als NP', async ({ page }) => {
  await page.fill('#i-watts', '200');
  await page.fill('#i-np', '');
  await page.fill('#i-ftp', '250');

  await expect(page.locator('#ri-if')).toHaveText('0,80');
  await expect(page.locator('#ri-tss')).toHaveText('64');      // 3600 · 200 · 0,8 / 9000
});

test('ohne Dauer: keine Ergebnisse, Hinweis statt Zahlen', async ({ page }) => {
  await page.fill('#i-duration', '');

  for (const id of ['#ri-tss', '#ri-if', '#ri-kcal', '#ri-kj']) {
    await expect(page.locator(id)).toHaveText('—');
  }
  await expect(page.locator('#indoor-info')).toContainText('Zeit und FTP');
});

test('Einheit speichern: Eintrag mit den berechneten Werten in der Historie', async ({ page }) => {
  await page.fill('#i-watts', '200');
  await page.fill('#i-np', '220');
  await page.fill('#i-ftp', '250');
  await page.click('#btn-save-indoor');

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('purin_indoor_history')));
  expect(saved).toHaveLength(1);
  expect(saved[0]).toMatchObject({ dur: 60, watts: 200, np: 220, ftp: 250, tss: 77, if: 0.88, kj: 720, kcal: 782 });
});
