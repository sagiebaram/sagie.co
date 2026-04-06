import { test, expect } from '@playwright/test';

test.describe('Homepage Critical Path', () => {
  test('loads critical sections, navigates, and shows globe fallback or canvas', async ({ page }) => {
    await page.goto('/');

    // 1. Basic properties
    await expect(page).toHaveTitle(/SAGIE/i);
    await expect(page.locator('nav').first()).toBeVisible();

    // 2. Critical sections
    // Check for headings that identify key sections
    await expect(page.getByRole('heading', { level: 2, name: /THE BELIEF/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /PILLARS/i }).first()).toBeVisible();
    
    // 3. Globe or map visualization
    // We expect either the lazy-loaded canvas or its placeholder to exist in the DOM
    const mapContainer = page.locator('.aspect-\\[4\\/3\\], .aspect-square').first();
    await expect(mapContainer).toBeAttached();

    // 4. CTA
    const applyLink = page.getByRole('link', { name: /Apply for Membership/i }).first();
    await expect(applyLink).toBeVisible();
  });
});
