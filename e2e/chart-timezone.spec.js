import { test, expect } from './support/fixtures.js';

// Regressionstest: Der Datumsbereich der Verlaufsdiagramme rechnet in Ortszeit.
// Früher lief die Umrechnung über UTC (toISOString / new Date('YYYY-MM-DD')). In
// Europe/Berlin fiel dadurch der als "Von" gewählte Tag aus dem Diagramm, und der
// vorbelegte Starttag lag einen Tag zu früh. CI läuft in UTC und sah das nie.
test.use({ timezoneId: 'Europe/Berlin', locale: 'de-DE' });

const DAY = '2026-11-10';

test.describe('Verlaufsdiagramme: Datumsbereich in Ortszeit', () => {
  test('Purin: Starttag ist vorbelegt und der gewählte Von-Tag wird angezeigt', async ({ page }) => {
    await page.goto('/');
    const res = await page.evaluate((day) => {
      const d = new Date(2026, 10, 10); // lokale Mitternacht
      const date = d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
      localStorage.setItem('purin_tracker_history', JSON.stringify([
        { ts: d.getTime(), date, items: [], totals: { purin: 100, kcal: 500, protein: 1, carbs: 1, fat: 1, fiber: 1 } },
      ]));
      switchTab('chart');
      const preset = document.getElementById('chart-from').value;
      document.getElementById('chart-from').value = day;
      document.getElementById('chart-to').value = day;
      renderChart();
      return { preset, points: historyChartInstance ? historyChartInstance.data.labels.length : 0 };
    }, DAY);
    expect(res.preset).toBe(DAY);
    expect(res.points).toBe(1);
  });

  test('Gehrechner: Einheit kurz nach Mitternacht gehört zum gewählten Von-Tag', async ({ page }) => {
    await page.goto('/');
    const res = await page.evaluate((day) => {
      const d = new Date(2026, 10, 10, 0, 30); // 00:30 Ortszeit
      localStorage.setItem('purin_walk_history', JSON.stringify([
        { ts: d.getTime(), date: '10.11.2026', dist: 2500, elev: 300, kcal: 400, steps: 4000, met: 5, duration: 60 },
      ]));
      switchPage('walk');
      switchWalkTab('chart');
      const preset = document.getElementById('wchart-from').value;
      document.getElementById('wchart-from').value = day;
      document.getElementById('wchart-to').value = day;
      renderWalkChart();
      return { preset, points: walkChartInstance ? walkChartInstance.data.labels.length : 0 };
    }, DAY);
    expect(res.preset).toBe(DAY);
    expect(res.points).toBe(1);
  });

  test('Indoor-Rad: Einheit kurz nach Mitternacht gehört zum gewählten Von-Tag', async ({ page }) => {
    await page.goto('/');
    const res = await page.evaluate((day) => {
      const d = new Date(2026, 10, 10, 0, 30);
      localStorage.setItem('purin_indoor_history', JSON.stringify([
        { ts: d.getTime(), date: '10.11.2026', dur: 60, tss: 50, if: 0.7, kcal: 500, watts: 150, np: 150, dist: 0, elev: 0, cad: 85 },
      ]));
      switchPage('indoor');
      switchIndoorTab('chart');
      const preset = document.getElementById('ichart-from').value;
      document.getElementById('ichart-from').value = day;
      document.getElementById('ichart-to').value = day;
      renderIndoorChart();
      return { preset, points: indoorChartInstance ? indoorChartInstance.data.labels.length : 0 };
    }, DAY);
    expect(res.preset).toBe(DAY);
    expect(res.points).toBe(1);
  });
});
