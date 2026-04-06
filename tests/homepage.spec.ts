import { test, expect } from '@playwright/test';

test.describe('Homepage Critical Path', () => {
  test('loads critical sections, navigates, and shows globe fallback or canvas', async ({ page }) => {
    await page.goto('/');

    // 1. Basic properties
    await expect(page).toHaveTitle(/SAGIE/i);
    await expect(page.locator('nav').first()).toBeVisible();

    // 2. Critical sections
    // Check for text that identifies key sections instead of level 2 headings because they use Eyebrow paragraphs
    await expect(page.getByText('The Belief', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('The Pillars', { exact: true }).first()).toBeVisible();
    
    // 3. Globe or map visualization
    // We expect either the lazy-loaded canvas or its placeholder to exist in the DOM
    const mapContainer = page.locator('.aspect-\\[4\\/3\\], .aspect-square').first();
    await expect(mapContainer).toBeAttached();

    // 4. CTA
    const applyLink = page.getByRole('link', { name: /Apply for Membership/i }).first();
    await expect(applyLink).toBeVisible();
  });
});
