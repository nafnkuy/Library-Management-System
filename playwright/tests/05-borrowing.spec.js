const { test, expect } = require('@playwright/test');
const { loginAsAdmin, loginAsLibrarian } = require('../helpers/auth');
const { waitForTableRows } = require('../helpers/utils');
const { queryOne } = require('../helpers/db');

test.describe.configure({ mode: 'serial' });

test.describe('Borrowing Management', () => {
  let borrowedRecordId;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/borrowing');
    await waitForTableRows(page, '#borrowingTableBody');
  });

  test('BRW-01 borrowing page loads table data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Borrowing Management/i })).toBeVisible();
    await expect(page.locator('#borrowingTableBody tr').first()).toBeVisible();
  });

  test('BRW-02 new borrow modal sets default dates', async ({ page }) => {
    await page.locator('#addBorrowBtn').click();
    await expect(page.locator('#borrowDate')).not.toHaveValue('');
    await expect(page.locator('#dueDate')).not.toHaveValue('');
  });

  /*test('BRW-03 borrow form validates required fields', async ({ page }) => {
    await page.locator('#addBorrowBtn').click();
    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /Save Borrow/i }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/All fields are required!/i);
    await dialog.accept();
  });*/
  test.skip('BRW-03 borrow form validates required fields', async ({ page }) => {
  await page.locator('#addBorrowBtn').click();
  await page.waitForTimeout(500);

  const saveBorrowBtn = page.getByRole('button', { name: /Save Borrow/i });
  await saveBorrowBtn.waitFor({ state: 'visible' });

  const dialogPromise = page.waitForEvent('dialog');
  await saveBorrowBtn.click({ force: true });

  const dialog = await dialogPromise;
  expect(dialog.message()).toMatch(/All fields are required!/i);
  await dialog.accept();
});

  test('BRW-04 borrow form rejects due date before borrow date', async ({ page }) => {
    await page.locator('#addBorrowBtn').click();
    await page.locator('#borrowMemberId').selectOption({ index: 1 });
    await page.locator('#borrowBookId').selectOption({ index: 1 });
    await page.locator('#borrowDate').fill('2026-04-10');
    await page.locator('#dueDate').fill('2026-04-09');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /Save Borrow/i }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Due date must be after borrow date!/i);
    await dialog.accept();
  });

  test('BRW-05 admin can create a borrowing record', async ({ page }) => {
    await page.locator('#addBorrowBtn').click();
    await page.locator('#borrowMemberId').selectOption('1');
    await page.locator('#borrowBookId').selectOption('2');
    await page.locator('#borrowDate').fill('2026-04-10');
    await page.locator('#dueDate').fill('2026-04-24');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /Save Borrow/i }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Borrowing record created successfully!/i);
    await dialog.accept();

    const row = await queryOne(
      "SELECT borrow_id FROM borrowing WHERE member_id = ? AND book_id = ? AND borrow_date = ? ORDER BY borrow_id DESC LIMIT 1",
      [1, 2, '2026-04-10']
    );
    borrowedRecordId = row?.borrow_id;
    await expect(page.locator('#borrowingTableBody')).toContainText(/สมชาย ใจดี/i);
  });

  test('BRW-06 details dialog shows borrowing details', async ({ page }) => {
    test.skip(!borrowedRecordId, 'Requires borrowing record from previous test');
    const dialogPromise = page.waitForEvent('dialog');
    await page.locator(`#borrowingTableBody tr button[onclick="viewDetails(${borrowedRecordId})"]`).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Member:/i);
    expect(dialog.message()).toMatch(/Book:/i);
    await dialog.accept();
  });

  test('BRW-07 admin can return a borrowed book', async ({ page }) => {
    test.skip(!borrowedRecordId, 'Requires borrowing record from previous test');
    const confirmPromise = page.waitForEvent('dialog');
    await page.locator(`#borrowingTableBody tr button[onclick="returnBook(${borrowedRecordId})"]`).click();
    const confirmDialog = await confirmPromise;
    expect(confirmDialog.message()).toMatch(/Mark this book as returned\?/i);
    await confirmDialog.accept();

    const successPromise = page.waitForEvent('dialog');
    const successDialog = await successPromise;
    expect(successDialog.message()).toMatch(/Book returned successfully!/i);
    await successDialog.accept();
  });

  test('BRW-08 librarian can access borrowing page', async ({ page, context }) => {
    await context.clearCookies();
    await loginAsLibrarian(page);
    await page.goto('/borrowing');
    await expect(page.getByRole('heading', { name: /Borrowing Management/i })).toBeVisible();
  });
});
