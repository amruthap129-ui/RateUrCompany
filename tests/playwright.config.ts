import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs', // 👈 your test folder relative to /tests
  timeout: 30 * 1000,
  retries: 0,
  reporter: [['html', { open: 'never' }]], // Generates HTML report,
  use: {
    baseURL: 'http://127.0.0.1:5500/RateUrCompany/frontend/',
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
