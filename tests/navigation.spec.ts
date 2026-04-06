import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates to major pages via main menu', async ({ page }) => {
    await page.goto('/');
    
    // In a responsive nav, we target the desktop or main header nav
    const header = page.locator('header').first();
    
    await header.getByRole('link', { name: /events/i }).click();
    await expect(page).toHaveURL(/.*\/events/);
    
    await header.getByRole('link', { name: /resources/i }).click();
    await expect(page).toHaveURL(/.*\/resources/);
    
    await header.getByRole('link', { name: /solutions/i }).click();
    await expect(page).toHaveURL(/.*\/solutions/);
  });

  test('404 page for nonexistent route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    
    // Some frameworks might return 404 status differently in E2E but page content will show 404
    expect(response?.status()).toBe(404);
    
    // Expect the Next.js standard 404 page text
    await expect(page.getByText('This page could not be found.')).toBeVisible({ timeout: 10000 });
  });
});
