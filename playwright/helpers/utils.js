function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

async function acceptNextDialog(page) {
  const dialogPromise = page.waitForEvent('dialog');
  const dialog = await dialogPromise;
  const message = dialog.message();
  await dialog.accept();
  return message;
}

async function dismissNextDialog(page) {
  const dialogPromise = page.waitForEvent('dialog');
  const dialog = await dialogPromise;
  const message = dialog.message();
  await dialog.dismiss();
  return message;
}

async function waitForTableRows(page, tbodySelector) {
  await page.waitForFunction((selector) => {
    const tbody = document.querySelector(selector);
    return tbody && tbody.querySelectorAll('tr').length > 0;
  }, tbodySelector);
}

module.exports = {
  uniqueSuffix,
  acceptNextDialog,
  dismissNextDialog,
  waitForTableRows,
};
