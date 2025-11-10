import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/index.html');
  }

  async login(email: string, password: string) {
    await this.page.fill('#loginEmail', email);
    await this.page.fill('#loginPassword', password);
    await this.page.click('button:has-text("Login")');
  }

  async switchToSignUp() {
    await this.page.click('#toggleLink');
  }
}
