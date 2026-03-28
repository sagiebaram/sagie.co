import { test, expect } from '@playwright/test';

// -----------------------------------------------------------------------
// Helper: set up a route mock that returns { success: true } for POST
// requests to a given API path, and continues all other requests.
// -----------------------------------------------------------------------
async function mockApplicationRoute(page: import('@playwright/test').Page, formName: string) {
  await page.route(`**/api/applications/${formName}`, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.continue();
    }
  });
}

// -----------------------------------------------------------------------
// Membership form  (/apply)
// -----------------------------------------------------------------------
test('membership form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'membership');
  await page.goto('/apply');

  // Fill required text / email inputs using name attributes
  await page.fill('[name="fullName"]', 'Ada Lovelace');
  await page.fill('[name="email"]', 'ada@example.com');
  await page.fill('[name="location"]', 'London');

  // Role is a <select> — pick the first real option
  await page.selectOption('[name="role"]', 'Founder');

  // Required textareas
  await page.fill('[name="whatTheyNeed"]', 'Building a compiler for the next century.');
  await page.fill('[name="howTheyKnowSagie"]', 'I heard about SAGIE from a colleague at a conference.');

  // Click submit button
  await page.getByRole('button', { name: /submit application/i }).click();

  // FormSuccess renders "Application received" eyebrow + headline
  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll be in touch/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Chapter form  (/apply/chapter)
// -----------------------------------------------------------------------
test('chapter form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'chapter');
  await page.goto('/apply/chapter');

  await page.fill('[name="fullName"]', 'Grace Hopper');
  await page.fill('[name="email"]', 'grace@example.com');
  await page.fill('[name="city"]', 'New Haven');
  await page.fill('[name="whyLead"]', 'This city has a thriving startup scene that needs more structure.');
  await page.fill('[name="background"]', 'Former naval officer and computer scientist.');
  await page.fill('[name="chapterVision"]', 'Monthly meetups, annual summit, mentorship programme.');

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll reach out if it's the right time/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Solutions form  (/apply/solutions)
// -----------------------------------------------------------------------
test('solutions form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'solutions');
  await page.goto('/apply/solutions');

  await page.fill('[name="fullName"]', 'Margaret Hamilton');
  await page.fill('[name="email"]', 'margaret@example.com');

  // Service Category is a <select>
  await page.selectOption('[name="category"]', 'Technology & Product');

  await page.fill('[name="bio"]', 'Software engineer who put humans on the moon.');
  await page.fill('[name="servicesOffered"]', 'Technical architecture reviews and product strategy.');

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll review your application/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Ventures form  (/apply/ventures)
// -----------------------------------------------------------------------
test('ventures form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'ventures');
  await page.goto('/apply/ventures');

  await page.fill('[name="fullName"]', 'Alan Turing');
  await page.fill('[name="email"]', 'alan@example.com');
  await page.fill('[name="companyName"]', 'Turing Machines Inc.');
  await page.fill('[name="building"]', 'A universal computing machine that solves the halting problem.');

  // Stage is a <select>
  await page.selectOption('[name="stage"]', 'Pre-seed');

  await page.fill('[name="whySagie"]', 'Looking for founders who think in abstractions.');

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll be in touch/i)).toBeVisible({ timeout: 10000 });
});
