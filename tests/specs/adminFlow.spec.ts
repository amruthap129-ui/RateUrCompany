import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { testData } from '../utils/testData';


test.describe('Admin Flow', () => {
  test('Admin can view ratings table', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.goto();
    await login.login('admin@ryo.com', 'admin');
    await dashboard.verifyEmployeeView();
    await expect(page.locator('th', { hasText: 'Company' })).toBeVisible();
    await page.waitForSelector('table tbody tr');

    // ✅ Only verify user/company if they exist
    if (testData?.newUser?.name && testData?.company) {
      console.log(`Checking for user: ${testData.newUser.name} and company: ${testData.company}`);

      const userLocator = page.locator(`text=${testData.newUser.name}`);
      const companyLocator = page.locator(`text=${testData.company}`);

      await expect(userLocator).toBeVisible();
      await expect(companyLocator).toBeVisible();
    } else {
      console.log('⚠️ No new user found — skipping user/company verification.');
    }
  });
});