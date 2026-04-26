import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  // Navbar is hidden during simple homepage launch — skip menu navigation
  test.skip('navigates to major pages via main menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('nav').first();

    await header.getByRole('link', { name: /events/i }).click();
    await expect(page).toHaveURL(/.*\/events/, { timeout: 10000 });

    await header.getByRole('link', { name: /resources/i }).click();
    await expect(page).toHaveURL(/.*\/resources/, { timeout: 10000 });

    await header.getByRole('link', { name: /solutions/i }).click();
    await expect(page).toHaveURL(/.*\/solutions/, { timeout: 10000 });
  });

  test('404 page for nonexistent route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    // Some frameworks might return 404 status differently in E2E but page content will show 404
    expect(response?.status()).toBe(404);

    // Expect the Next.js standard 404 page text
    await expect(page.getByText("This page doesn't exist, but there's plenty to explore.")).toBeVisible({ timeout: 10000 });
  });
});
