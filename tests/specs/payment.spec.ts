import { test, expect, request } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/api/payment';

test.describe('Payment API Tests', () => {
  test('✅ should process successful Stripe payment', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/process`, {
      data: {
        company_name: 'TCS',
        amount: 100,
        payment_method: 'stripe',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.transaction_id).toContain('TXN');
    console.log('💰 Success Response:', body);
  });

  test('❌ should return error for invalid card / payment method', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/process`, {
      data: {
        company_name: 'TCS',
        amount: 100,
        payment_method: 'invalidMethod',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Unsupported');
    console.log('🚫 Invalid Method Response:', body);
  });

  test('⚠️ should handle payment processor down (simulate 503)', async ({ request }) => {
    // simulate unavailable service by passing a flag
    const response = await request.post(`${BASE_URL}/process`, {
      data: {
        company_name: 'OfflineCo',
        amount: 100,
        payment_method: 'stripe',
        simulate_down: true, // custom field backend checks
      },
    });

    // in backend you can force this if simulate_down==true → throw 503
    expect([503, 500]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(false);
    console.log('⚠️ Unavailable Service Response:', body);
  });
});
