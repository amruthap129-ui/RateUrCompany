import { Page } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async register(name: string, email: string, password: string, dept?: string) {
  // Switch to sign-up form if not visible
  const isLoginFormVisible = await this.page.isVisible('#loginForm');
  if (isLoginFormVisible) {
    await this.page.click('#toggleLink'); // click Sign Up link
  }

  // Now fill the form
  await this.page.waitForSelector('#registerForm', { state: 'visible' });
  await this.page.fill('#regName', name);
  await this.page.fill('#regEmail', email);
  await this.page.fill('#regPassword', password);
  if (dept) await this.page.fill('#regDept', dept);

  await this.page.click('#createBtn');// create account button
}

}
