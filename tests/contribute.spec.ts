import { test, expect } from '@playwright/test'

/**
 * E2E coverage for /contribute (Sprint 04-11 Track 2).
 *
 * 1. Page renders — hero, ticker, cards, steps, pillars, CTA banner, form.
 * 2. Form happy path — fills every required field, submits, sees success state.
 * 3. Validation error — submits empty form, sees per-field errors (name, chips, availability, consent).
 */

async function mockContributionRoute(page: import('@playwright/test').Page) {
  await page.route('**/api/applications/contribution', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    } else {
      await route.continue()
    }
  })
}

test.describe('Contribute page', () => {
  test('renders all major sections', async ({ page }) => {
    await page.goto('/contribute')
    await page.waitForLoadState('networkidle')

    // Hero — headline uses three stacked lines; check the full phrase is visible.
    await expect(page.getByRole('heading', { level: 1, name: /BUILD\s+WITH\s+US/i })).toBeVisible()
    await expect(page.getByText('sagie.co / contribute')).toBeVisible()

    // Ways to Contribute — eyebrow + first card title
    await expect(page.getByText('Ways to Contribute', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Volunteer Your Time' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Host a SAGIE Activation' })).toBeVisible()

    // How It Works — step titles
    await expect(page.getByRole('heading', { name: 'Choose Your Form' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Create Impact' })).toBeVisible()

    // Pillars
    await expect(page.getByText('Community Foundation')).toBeVisible()
    await expect(page.getByText('ServiceHub')).toBeVisible()
    await expect(page.getByText('Equity Portfolio')).toBeVisible()

    // CTA banner
    await expect(page.getByRole('heading', { name: 'Ready to Plug In?' })).toBeVisible()

    // Form card header
    await expect(page.getByText('SAGIE ECO — Open Membership')).toBeVisible()
    await expect(page.getByRole('button', { name: /join the ecosystem/i })).toBeVisible()
  })

  test('form submits happy path and shows success state', async ({ page }) => {
    await mockContributionRoute(page)
    await page.goto('/contribute')
    await page.waitForLoadState('networkidle')

    // Ensure the form has had time to record loadTime (withValidation requires >= 3s elapsed).
    // We wait 3.5 seconds before interacting to avoid the silent-success bot trap.
    await page.waitForTimeout(3500)

    // Fill required text inputs
    await page.locator('#name').fill('Ada Lovelace')
    await page.locator('#email').fill('ada@example.com')

    // Pick two chips
    await page.getByRole('button', { name: 'Mentorship' }).click()
    await page.getByRole('button', { name: 'Collaboration' }).click()

    // Optional textarea
    await page.locator('#more').fill('Happy to run analytical engine workshops in Miami.')

    // Availability — native <select>
    await page.locator('#availability').selectOption('active')

    // Privacy consent
    await page.locator('#consent').check()

    // Submit
    await page.getByRole('button', { name: /join the ecosystem/i }).click()

    // Success state
    await expect(page.getByRole('heading', { name: /you're in the circuit/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/keep building/i)).toBeVisible()
  })

  test('form shows validation errors when required fields are empty', async ({ page }) => {
    await page.goto('/contribute')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3500)

    // Click submit without touching any field — zodResolver reports all errors at once
    await page.getByRole('button', { name: /join the ecosystem/i }).click()

    // Name error (from schema nameField error message)
    await expect(page.getByText('Name is required.')).toBeVisible({ timeout: 5000 })

    // Chip error
    await expect(page.getByText('Pick at least one area.')).toBeVisible()

    // Availability error
    await expect(page.getByText('Please select your availability.')).toBeVisible()

    // Consent error
    await expect(page.getByText("You'll need to agree to continue.")).toBeVisible()
  })
})
