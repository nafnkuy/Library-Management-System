async function loginAs(page, username = 'admin', password = 'admin123') {
  await page.goto('/login');
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/dashboard$/);
}

async function loginAsAdmin(page) {
  await loginAs(page, 'admin', 'admin123');
}

async function loginAsLibrarian(page) {
  await loginAs(page, 'librarian', 'lib123');
}

module.exports = {
  loginAs,
  loginAsAdmin,
  loginAsLibrarian,
};
