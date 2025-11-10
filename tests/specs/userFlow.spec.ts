import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { RatingPage } from '../pages/RatingPage';
import { testData } from '../utils/testData';
import { apiClient } from '../utils/apiClient';
import { dbHelper } from '../utils/dbHelper';

test.describe('User Flow - Rate Your Organization', () => {
  test('User registration, rating, and dashboard validation', async ({ page }) => {
    const login = new LoginPage(page);
    const register = new RegisterPage(page);
    const dashboard = new DashboardPage(page);
    const rating = new RatingPage(page);
    const uniqueId = Math.random().toString(36).substring(2, 8);
    console.log('Loaded testData:', testData);
    testData.newUser.name = `User_${uniqueId}`;
    testData.newUser.email = `user_${uniqueId}@test.com`;
    testData.company = testData.company+ uniqueId;

    await login.goto();
    await login.switchToSignUp();
    await register.register(testData.newUser.name,
      testData.newUser.email,
      testData.newUser.password,
      testData.newUser.department);
    await page.waitForTimeout(3000);

    // After registration -> dashboard
    await dashboard.verifyEmployeeView();
    await dashboard.clickRateNow();
    await page.waitForTimeout(5000);

    // Rate once
    await rating.submitRating(testData.company + ' Pvt Ltd');
    await expect(page).toHaveURL(/dashboard.html/);

    const response = await apiClient.get('/employees');
    expect(response.status).toBe(200);
    expect(response.data.some((emp: any) => emp.email === testData.newUser.email)).toBeTruthy();

    // ✅ DB Validation
    const emp = dbHelper.getEmployeeByEmail(testData.newUser.email);
    expect(emp).toBeTruthy();

    const ratingData = dbHelper.getRatingByEmployeeId(emp.id);
    
    expect(ratingData.company_name).toBe(testData.company + ' Pvt Ltd');
    expect(ratingData.salary).toBeGreaterThan(0);
    const responserate = await apiClient.get(`/rating/check/${emp.id}`);
    expect(responserate.status).toBe(200);
    expect(responserate.data.exists).toBe(true);
    // Validate already rated
    await dashboard.verifyAlreadyRated();
  });
});
