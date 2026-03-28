import { test, expect } from '@playwright/test';

// -----------------------------------------------------------------------
// Homepage  (/)
// -----------------------------------------------------------------------
test('homepage loads and shows SAGIE branding', async ({ page }) => {
  await page.goto('/');
  // Page title contains SAGIE
  await expect(page).toHaveTitle(/SAGIE/i);
  // Navbar is present — logo or nav link exists
  await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
});

// -----------------------------------------------------------------------
// Blog listing  (/blog)
// -----------------------------------------------------------------------
test('blog page loads and shows page heading', async ({ page }) => {
  await page.goto('/blog');
  // h1 contains "IDEAS FROM" regardless of Notion data
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/ideas from/i)).toBeVisible({ timeout: 15000 });
});

// -----------------------------------------------------------------------
// Events  (/events)
// -----------------------------------------------------------------------
test('events page loads and shows page heading', async ({ page }) => {
  await page.goto('/events');
  // h1 contains "WHERE THE"
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/where the/i)).toBeVisible({ timeout: 15000 });
});

// -----------------------------------------------------------------------
// Resources  (/resources)
// -----------------------------------------------------------------------
test('resources page loads and shows page heading', async ({ page }) => {
  await page.goto('/resources');
  // h1 contains "TOOLS FOR THE"
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/tools for the/i)).toBeVisible({ timeout: 15000 });
});

// -----------------------------------------------------------------------
// Solutions listing  (/solutions)
// -----------------------------------------------------------------------
test('solutions page loads and shows page heading', async ({ page }) => {
  await page.goto('/solutions');
  // h1 contains "THE EXPERTISE"
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/the expertise/i)).toBeVisible({ timeout: 15000 });
});
