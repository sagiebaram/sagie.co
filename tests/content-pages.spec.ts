import { test, expect } from '@playwright/test';

// -----------------------------------------------------------------------
// Homepage  (/)
// -----------------------------------------------------------------------
test('homepage loads and shows SAGIE branding', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit', timeout: 30000 });
  // Page title contains SAGIE
  await expect(page).toHaveTitle(/SAGIE/i);
  // Main nav element is in the DOM
  await expect(page.locator('nav').first()).toBeAttached({ timeout: 15000 });
});

// -----------------------------------------------------------------------
// Blog listing  (/blog)
// -----------------------------------------------------------------------
test('blog page loads and shows page heading', async ({ page }) => {
  await page.goto('/blog');
  // h1 contains "IDEAS FROM" regardless of Notion data
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/ideas from/i);
});

// -----------------------------------------------------------------------
// Events  (/events)
// -----------------------------------------------------------------------
test('events page loads and shows page heading', async ({ page }) => {
  await page.goto('/events');
  // h1 contains "WHERE THE"
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/where the/i);
});

// -----------------------------------------------------------------------
// Resources  (/resources)
// -----------------------------------------------------------------------
test('resources page loads and shows page heading', async ({ page }) => {
  await page.goto('/resources');
  // h1 contains "TOOLS FOR THE"
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/tools for the/i);
});

// -----------------------------------------------------------------------
// Solutions listing  (/solutions)
// -----------------------------------------------------------------------
test('solutions page loads and shows page heading', async ({ page }) => {
  await page.goto('/solutions');
  // h1 contains "THE EXPERTISE"
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/the expertise/i);
});
