const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../helpers/auth');

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/reports');
  });

  test('RPT-01 reports page renders all sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Reports/i })).toBeVisible();
    await expect(page.getByText('Overdue Books')).toBeVisible();
    await expect(page.getByText('Top Borrowed Books')).toBeVisible();
    await expect(page.getByText('Most Active Members')).toBeVisible();
  });

  test('RPT-02 overdue books table loads rows or empty state', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const overdueBody = page.locator('#overdueTableBody');
    await expect(overdueBody).not.toContainText(/Loading\.\.\./i);
    await expect(overdueBody.locator('tr').first()).toBeVisible();
  });

  test('RPT-03 top borrowed books section renders data rows', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const topBooksBody = page.locator('#topBooksTableBody');
    await expect(topBooksBody).not.toContainText(/Loading\.\.\./i);
    await expect(topBooksBody.locator('tr').first()).toBeVisible();
  });

  test('RPT-04 active members section renders data rows', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const activeMembersBody = page.locator('#activeMembersTableBody');
    await expect(activeMembersBody).not.toContainText(/Loading\.\.\./i);
    await expect(activeMembersBody.locator('tr').first()).toBeVisible();
  });
});
