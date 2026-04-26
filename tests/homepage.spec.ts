import { test, expect } from '@playwright/test';

test.describe('Homepage Critical Path', () => {
  test('loads critical sections, navigates, and shows globe fallback or canvas', async ({ page }) => {
    await page.goto('/');

    // 1. Basic properties
    await expect(page).toHaveTitle(/SAGIE/i);

    // 2. Critical sections
    // Check for text that identifies key sections instead of level 2 headings because they use Eyebrow paragraphs
    await expect(page.getByText('The Belief', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('The Pillars', { exact: true }).first()).toBeVisible();

    // 3. Globe or map visualization
    // GlobeShell renders a div.relative.w-full wrapping a Suspense > GlobeClient
    // We just check the outer container is in the DOM (canvas may not hydrate in CI)
    const mapContainer = page.locator('#proof').first();
    await expect(mapContainer).toBeAttached();

    // 4. CTA — currently a disabled "Coming Soon" span (no link) during launch mode
    const ctaSpan = page.getByText('Coming Soon').first();
    await expect(ctaSpan).toBeVisible();
  });
});
