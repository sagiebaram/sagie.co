import { test, expect } from '@playwright/test';

test.describe('Blog Flow', () => {
  test('loads blog listing, navigates to post, post renders', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/ideas from/i);
    
    // Check if there are articles listed
    const articles = page.locator('article');
    await articles.first().waitFor({ state: 'attached', timeout: 10000 }).catch(() => null);
    const count = await articles.count();
    
    if (count > 0) { // If Notion has populated data
      const firstArticle = articles.first();
      const titleLink = firstArticle.getByRole('link').first();
      
      // Click and wait for navigation
      await Promise.all([
        page.waitForNavigation(),
        titleLink.click()
      ]);
      
      // Post should render a heading with the title
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
      
      // Post should have a content section (checking for typical Notion react markdown prose wrapper)
      const contentSection = page.locator('.prose, [data-notion-content="true"], main article');
      await expect(contentSection.first()).toBeVisible({ timeout: 15000 });
    }
  });
});
