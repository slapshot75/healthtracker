// Gemeinsame Test-Basis: wie @playwright/test, aber Chart.js wird aus dem lokalen Cache
// ausgeliefert statt vom CDN. Der Browser prüft weiterhin den SRI-Hash aus index.html.
const base = require('@playwright/test');
const { chartScriptTag, cachePath } = require('./chartjs-cache.js');

const test = base.test.extend({
  page: async ({ page }, use) => {
    await page.route(chartScriptTag().url, (route) => route.fulfill({
      path: cachePath(),
      contentType: 'application/javascript',
      headers: { 'access-control-allow-origin': '*' },
    }));
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
