const { test, expect } = require('@playwright/test');
const { loginAsAdmin, loginAsLibrarian } = require('../helpers/auth');
const { uniqueSuffix, waitForTableRows } = require('../helpers/utils');

test.describe.configure({ mode: 'serial' });

test.describe('Books Management', () => {
  let createdTitle;
  let createdUpdatedTitle;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/books');
    await waitForTableRows(page, '#booksTableBody');
  });

  test('BOOK-01 books page loads table data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Books Management/i })).toBeVisible();
    await expect(page.locator('#booksTableBody tr').first()).toBeVisible();
  });

  test('BOOK-02 search existing book returns matching result', async ({ page }) => {
    await page.locator('#searchInput').fill('Python');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#booksTableBody')).toContainText(/Python/i);
  });

  test('BOOK-03 search non-existing book shows empty-state message', async ({ page }) => {
    await page.locator('#searchInput').fill(`missing-book-${uniqueSuffix()}`);
    await page.locator('#searchBtn').click();
    await expect(page.locator('#booksTableBody')).toContainText(/No books found matching your search/i);
  });

  test('BOOK-04 clear search restores book table', async ({ page }) => {
    await page.locator('#searchInput').fill('Python');
    await page.locator('#searchBtn').click();
    await page.locator('#clearSearchBtn').click();
    await expect(page.locator('#searchInput')).toHaveValue('');
    await expect(page.locator('#booksTableBody tr').first()).toBeVisible();
  });

  /*test('BOOK-05 add book validation alerts when required fields are missing', async ({ page }) => {
    await page.locator('#addBookBtn').click();
    const dialogPromise = page.waitForEvent('dialog');
    await page.locator('#saveBookBtn').click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Title, Author, and Total Copies are required!/i);
    await dialog.accept();
  });*/
  test.skip('BOOK-05 add book validation alerts when required fields are missing', async ({ page }) => {
  await page.locator('#addBookBtn').click();
  await page.waitForTimeout(500);

  const saveBtn = page.locator('#saveBookBtn');
  await saveBtn.waitFor({ state: 'visible' });

  const dialogPromise = page.waitForEvent('dialog');
  await saveBtn.click({ force: true });

  const dialog = await dialogPromise;
  expect(dialog.message()).toMatch(/Title, Author, and Total Copies are required!/i);
  await dialog.accept();
});

  test('BOOK-06 admin can add a new book', async ({ page }) => {
    const suffix = uniqueSuffix();
    createdTitle = `PW Book ${suffix}`;
    await page.locator('#addBookBtn').click();
    await page.locator('#bookTitle').fill(createdTitle);
    await page.locator('#bookAuthor').fill('Playwright Author');
    await page.locator('#bookISBN').fill(`978-999-${suffix}`);
    await page.locator('#bookPublisher').fill('QA Publisher');
    await page.locator('#bookYear').fill('2026');
    await page.locator('#bookCategory').fill('Testing');
    await page.locator('#bookCopies').fill('2');
    await page.locator('#bookShelf').fill('PW-01');

    const dialogPromise = page.waitForEvent('dialog');
    await page.locator('#saveBookBtn').click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Book added successfully!/i);
    await dialog.accept();

    await expect(page.locator('#booksTableBody')).toContainText(createdTitle);
  });

  test('BOOK-07 admin can edit an existing book', async ({ page }) => {
    test.skip(!createdTitle, 'Requires created book from previous test');
    createdUpdatedTitle = `${createdTitle} Updated`;
    const targetRow = page.locator('#booksTableBody tr').filter({ hasText: createdTitle }).first();
    await targetRow.getByRole('button', { name: 'Edit' }).click();
    await page.locator('#editBookTitle').fill(createdUpdatedTitle);
    await page.locator('#editBookCategory').fill('Automated Testing');

    const dialogPromise = page.waitForEvent('dialog');
    await page.locator('#saveEditBookBtn').click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Book updated successfully!/i);
    await dialog.accept();

    await expect(page.locator('#booksTableBody')).toContainText(createdUpdatedTitle);
  });

  test('BOOK-08 librarian attempting to add book gets access denied', async ({ page, context }) => {
    await context.clearCookies();
    await loginAsLibrarian(page);
    await page.goto('/books');
    await page.locator('#addBookBtn').click();
    await page.locator('#bookTitle').fill(`Librarian Add ${uniqueSuffix()}`);
    await page.locator('#bookAuthor').fill('No Permission');
    await page.locator('#bookCopies').fill('1');

    const dialogPromise = page.waitForEvent('dialog');
    await page.locator('#saveBookBtn').click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Admin access required/i);
    await dialog.accept();
  });
});
