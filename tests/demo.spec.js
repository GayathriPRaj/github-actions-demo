// tests/demo.spec.js
const { test, expect } = require('@playwright/test');

test('verify page title on Example.com', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});

test('verify heading text', async ({ page }) => {
  await page.goto('https://example.com');
  const heading = page.locator('h1');
  await expect(heading).toHaveText('Example Domain');
});