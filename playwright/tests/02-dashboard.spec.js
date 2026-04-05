const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../helpers/auth');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('DASH-01 dashboard summary cards are visible', async ({ page }) => {
    await expect(page.locator('#totalBooks')).toBeVisible();
    await expect(page.locator('#availableBooks')).toBeVisible();
    await expect(page.locator('#activeMembers')).toBeVisible();
    await expect(page.locator('#borrowedBooks')).toBeVisible();
  });

  test('DASH-02 dashboard statistics are populated', async ({ page }) => {
    await expect(page.locator('#totalBooks')).not.toHaveText('-');
    await expect(page.locator('#availableBooks')).not.toHaveText('-');
    await expect(page.locator('#activeMembers')).not.toHaveText('-');
    await expect(page.locator('#borrowedBooks')).not.toHaveText('-');
  });

  test('DASH-03 books menu navigates to books page', async ({ page }) => {
    await page.getByRole('link', { name: /Books/i }).first().click();
    await expect(page).toHaveURL(/\/books$/);
    await expect(page.getByRole('heading', { name: /Books Management/i })).toBeVisible();
  });

  test('DASH-04 members menu navigates to members page', async ({ page }) => {
    await page.getByRole('link', { name: /Members/i }).first().click();
    await expect(page).toHaveURL(/\/members$/);
    await expect(page.getByRole('heading', { name: /Members Management/i })).toBeVisible();
  });

  test('DASH-05 borrowing menu navigates to borrowing page', async ({ page }) => {
    await page.getByRole('link', { name: /Borrowing/i }).first().click();
    await expect(page).toHaveURL(/\/borrowing$/);
    await expect(page.getByRole('heading', { name: /Borrowing Management/i })).toBeVisible();
  });

  test('DASH-06 reports menu navigates to reports page', async ({ page }) => {
    await page.getByRole('link', { name: /Reports/i }).first().click();
    await expect(page).toHaveURL(/\/reports$/);
    await expect(page.getByRole('heading', { name: /Reports/i })).toBeVisible();
  });
});
