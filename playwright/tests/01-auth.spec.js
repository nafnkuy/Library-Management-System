const { test, expect } = require('@playwright/test');
const { loginAsAdmin, loginAsLibrarian } = require('../helpers/auth');

test.describe('Authentication', () => {
  test('AUTH-01 login page renders with form controls', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Library System/i })).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('AUTH-02 invalid login shows error message', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#errorAlert')).toBeVisible();
    await expect(page.locator('#errorAlert')).toContainText(/Invalid username or password/i);
  });

  test('AUTH-03 admin can login and reach dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('#userName')).toContainText(/System Administrator/i);
  });

  test('AUTH-04 librarian can login and see own profile name', async ({ page }) => {
    await loginAsLibrarian(page);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('#userName')).toContainText(/Library Staff/i);
  });

  test('AUTH-05 protected route redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/books');
    await page.waitForURL(/\/login$/);
    await expect(page.locator('#loginForm')).toBeVisible();
  });

  test('AUTH-06 logout returns user to login screen', async ({ page }) => {
    await loginAsAdmin(page);
    await page.locator('#logoutBtn').click();
    await page.waitForURL(/\/login$/);
    await expect(page.locator('#loginForm')).toBeVisible();
  });
});
