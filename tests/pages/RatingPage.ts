import { Page } from '@playwright/test';

export class RatingPage {
  constructor(private page: Page) {}

  async submitRating(company: string) {
    await this.page.fill('#company', company);
    await this.page.selectOption('#salary', '4');
    await this.page.selectOption('#growth', '5');
    await this.page.selectOption('#benefits', '5');
    await this.page.selectOption('#balance', '4');
    await this.page.click('button:has-text("Submit Rating")');
  }
}
