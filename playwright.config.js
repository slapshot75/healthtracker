const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/support/global-setup.js',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    // Wie beim Nutzer: Datumslogik läuft in Ortszeit. CI-Runner stehen sonst auf UTC.
    timezoneId: 'Europe/Berlin',
    locale: 'de-DE',
    // Die Tests fangen Supabase per Route ab (test.supabase.co). Die CSP würde diese
    // Anfragen blockieren, bevor sie abgefangen werden. Die CSP prüft e2e/csp.spec.js.
    bypassCSP: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server . -p 3000 -c-1 --silent',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
