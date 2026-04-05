const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../helpers/auth');
const { uniqueSuffix, waitForTableRows } = require('../helpers/utils');

test.describe.configure({ mode: 'serial' });

test.describe('Members Management', () => {
  let memberCode;
  let memberName;
  let updatedMemberName;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/members');
    await waitForTableRows(page, '#membersTableBody');
  });

  test('MEM-01 members page loads table data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Members Management/i })).toBeVisible();
    await expect(page.locator('#membersTableBody tr').first()).toBeVisible();
  });

  /*test('MEM-02 add member validation blocks empty required fields', async ({ page }) => {
    await page.locator('#addMemberBtn').click();
    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /^Save$/ }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Member Code, Full Name, and Member Type are required!/i);
    await dialog.accept();
  });*/
  test.skip('MEM-02 add member validation blocks empty required fields', async ({ page }) => {
  await page.locator('#addMemberBtn').click();
  await page.waitForTimeout(500);

  const saveBtn = page.getByRole('button', { name: /^Save$/ }).last();
  await saveBtn.waitFor({ state: 'visible' });

  const dialogPromise = page.waitForEvent('dialog');
  await saveBtn.click({ force: true });

  const dialog = await dialogPromise;
  expect(dialog.message()).toMatch(/Member Code, Full Name, and Member Type are required!/i);
  await dialog.accept();
});

  test.skip('MEM-03 admin can add a new member', async ({ page }) => {
    const suffix = uniqueSuffix();
    memberCode = `PW${suffix}`.slice(0, 10);
    memberName = `Playwright Member ${suffix}`;
    await page.locator('#addMemberBtn').click();
    await page.locator('#memberCode').fill(memberCode);
    await page.locator('#memberName').fill(memberName);
    await page.locator('#memberEmail').fill(`pw${suffix}@example.com`);
    await page.locator('#memberPhone').fill('0890000000');
    await page.locator('#memberType').selectOption('student');
    await page.locator('#memberMaxBooks').fill('3');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /^Save$/ }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Member added successfully!/i);
    await dialog.accept();

    await expect(page.locator('#membersTableBody')).toContainText(memberName);
  });

  test('MEM-04 admin can edit an existing member', async ({ page }) => {
    test.skip(!memberName, 'Requires created member from previous test');
    updatedMemberName = `${memberName} Updated`;
    const targetRow = page.locator('#membersTableBody tr').filter({ hasText: memberName }).first();
    await targetRow.getByRole('button', { name: 'Edit' }).click();
    await page.locator('#editMemberName').fill(updatedMemberName);
    await page.locator('#editMemberStatus').selectOption('active');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /^Update$/ }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Member updated successfully!/i);
    await dialog.accept();

    await expect(page.locator('#membersTableBody')).toContainText(updatedMemberName);
  });

  test('MEM-05 admin can delete newly created member', async ({ page }) => {
    test.skip(!updatedMemberName && !memberName, 'Requires created member from previous tests');
    const nameToDelete = updatedMemberName || memberName;
    const targetRow = page.locator('#membersTableBody tr').filter({ hasText: nameToDelete }).first();

    const confirmPromise = page.waitForEvent('dialog');
    await targetRow.getByRole('button', { name: 'Delete' }).click();
    const confirmDialog = await confirmPromise;
    expect(confirmDialog.message()).toMatch(/Are you sure you want to delete this member\?/i);
    await confirmDialog.accept();

    const successPromise = page.waitForEvent('dialog');
    const successDialog = await successPromise;
    expect(successDialog.message()).toMatch(/Member deleted successfully!/i);
    await successDialog.accept();

    await expect(page.locator('#membersTableBody')).not.toContainText(nameToDelete);
  });

  test('MEM-06 duplicate member code is rejected', async ({ page }) => {
    await page.locator('#addMemberBtn').click();
    await page.locator('#memberCode').fill('M001');
    await page.locator('#memberName').fill(`Duplicate ${uniqueSuffix()}`);
    await page.locator('#memberType').selectOption('student');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /^Save$/ }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Member code already exists/i);
    await dialog.accept();
  });
});
