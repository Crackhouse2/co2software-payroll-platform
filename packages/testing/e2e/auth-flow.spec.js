// End-to-end tests for authentication flow
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should load login page correctly', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check page title and main elements
    await expect(page).toHaveTitle(/co2software Payroll Admin/);
    await expect(page.locator('h1')).toContainText('co2software');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show configuration information', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check that API configuration is displayed
    await expect(page.locator('#apiUrlDisplay')).toBeVisible();
    await expect(page.locator('#envDisplay')).toBeVisible();
  });

  test('should switch between tabs correctly', async ({ page }) => {
    await page.goto(BASE_URL);

    // Test tab switching
    await page.click('button:has-text("Admin")');
    await expect(page.locator('#admin')).toBeVisible();
    await expect(page.locator('#login')).not.toBeVisible();

    await page.click('button:has-text("Payroll")');
    await expect(page.locator('#payroll')).toBeVisible();
    await expect(page.locator('#admin')).not.toBeVisible();

    await page.click('button:has-text("Login")');
    await expect(page.locator('#login')).toBeVisible();
    await expect(page.locator('#payroll')).not.toBeVisible();
  });

  test('should calculate payroll locally', async ({ page }) => {
    await page.goto(BASE_URL);

    // Go to payroll tab
    await page.click('button:has-text("Payroll")');

    // Fill in payroll form
    await page.fill('#hours', '40');
    await page.fill('#rate', '25');
    await page.click('#payrollForm button[type="submit"]');

    // Check results
    await expect(page.locator('#payrollResult')).toContainText('$1,000');
    await expect(page.locator('#payrollResult')).toContainText('$200');
    await expect(page.locator('#payrollResult')).toContainText('$800');
  });

  test('should handle login form validation', async ({ page }) => {
    await page.goto(BASE_URL);

    // Try to submit empty form
    await page.click('#loginForm button[type="submit"]');

    // Browser validation should prevent submission
    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should show invite form in admin tab', async ({ page }) => {
    await page.goto(BASE_URL);

    // Go to admin tab
    await page.click('button:has-text("Admin")');

    // Check invite form elements
    await expect(page.locator('#inviteEmail')).toBeVisible();
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#lastName')).toBeVisible();
    await expect(page.locator('#role')).toBeVisible();
    await expect(page.locator('#inviteForm button[type="submit"]')).toBeVisible();
  });

  test('should handle config tab functionality', async ({ page }) => {
    await page.goto(BASE_URL);

    // Go to config tab
    await page.click('button:has-text("Config")');

    // Check config elements
    await expect(page.locator('#configApiUrl')).toBeVisible();
    await expect(page.locator('button:has-text("Update API URL")')).toBeVisible();
    await expect(page.locator('button:has-text("Test API Connection")')).toBeVisible();
  });
});

test.describe('Dashboard Protection', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    // Clear any existing auth
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Try to access dashboard directly
    await page.goto(`${BASE_URL}/dashboard.html`);

    // Should be redirected back to login
    await expect(page).toHaveURL(BASE_URL + '/index.html');
    
    // Should show alert about login requirement
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('must be logged in');
      await dialog.accept();
    });
  });

  test('should show existing login notice when already authenticated', async ({ page }) => {
    // Simulate existing login
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin'
      }));
      localStorage.setItem('authTokens', JSON.stringify({
        accessToken: 'fake-token',
        expiresIn: 3600
      }));
    });

    await page.reload();

    // Should show "already logged in" notice
    await expect(page.locator('#alreadyLoggedIn')).toBeVisible();
    await expect(page.locator('#alreadyLoggedIn')).toContainText('already logged in');
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);

    // Check that elements are still visible and usable
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    
    // Tab buttons should wrap properly
    const tabButtons = page.locator('.tab-buttons');
    await expect(tabButtons).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);

    // Check layout looks good on tablet
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
});
