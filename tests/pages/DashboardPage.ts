import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async verifyEmployeeView() {
    await expect(this.page.locator('h1')).toHaveText(/Rate Your Organization Portal/i);
  }

  async clickRateNow() {
    await this.page.click('#rateButton');
  }

  async verifyAlreadyRated() {
    const btn = this.page.locator('#rateButton');
    await expect(btn).toBeDisabled();
  }

  async logout() {
    await this.page.click('text=Logout');
  }
}
