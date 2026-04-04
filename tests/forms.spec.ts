import { test, expect } from '@playwright/test';

// -----------------------------------------------------------------------
// Helper: interact with a custom dropdown (data-dropdown trigger + option)
// -----------------------------------------------------------------------
async function selectDropdownOption(
  page: import('@playwright/test').Page,
  fieldName: string,
  optionText: string
) {
  // Click the dropdown trigger
  await page.locator(`[data-dropdown="${fieldName}"]`).click()
  // Click the option in the listbox
  await page.getByRole('option', { name: optionText }).click()
}

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

async function mockRoute(page: import('@playwright/test').Page, path: string) {
  await page.route(`**${path}`, async (route) => {
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

  // Country → State → City cascade (US requires state)
  await selectDropdownOption(page, 'country', 'United Kingdom');
  // UK has curated cities — select from dropdown
  await selectDropdownOption(page, 'city', 'London');

  // Phone (required) — react-phone-number-input renders an input inside .phone-input-dark
  await page.locator('.phone-input-dark input[type="tel"]').fill('+44 20 7946 0958');

  // Role is a custom dropdown — click trigger then option
  await selectDropdownOption(page, 'role', 'Founder');

  // Optional fields
  await page.fill('[name="company"]', 'Analytical Engine Co.');
  await page.fill('[name="whatTheyOffer"]', 'First algorithms ever written.');

  // Click at least one category checkbox (custom div role="checkbox")
  await page.locator('#category [role="checkbox"]', { hasText: 'Founder' }).click();

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
// Membership form — blur validation
// -----------------------------------------------------------------------
test('membership form shows blur validation errors', async ({ page }) => {
  await page.goto('/apply');
  // Wait for react-hook-form hydration — submit button is rendered by the form component
  await page.getByRole('button', { name: /submit application/i }).waitFor();

  // Click into fullName and blur without entering anything
  await page.locator('[name="fullName"]').focus();
  await page.locator('[name="fullName"]').blur();

  // Error message should appear
  await expect(page.getByText('What should we call you?')).toBeVisible({ timeout: 5000 });

  // Type a valid value — error should clear (blur triggers revalidation)
  await page.locator('[name="fullName"]').fill('Ada Lovelace');
  await page.locator('[name="fullName"]').blur();
  await expect(page.getByText('What should we call you?')).not.toBeVisible({ timeout: 5000 });
});

// -----------------------------------------------------------------------
// Chapter form  (/apply/chapter)
// -----------------------------------------------------------------------
test('chapter form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'chapter');
  await page.goto('/apply/chapter');

  await page.fill('[name="fullName"]', 'Grace Hopper');
  await page.fill('[name="email"]', 'grace@example.com');

  // Country → City cascade (GB has no state field, curated city list)
  await selectDropdownOption(page, 'country', 'United Kingdom');
  await selectDropdownOption(page, 'city', 'Edinburgh');

  // Phone (required)
  await page.locator('.phone-input-dark input[type="tel"]').fill('+44 131 496 0000');

  await page.fill('[name="communitySize"]', 'About 500 people');
  await page.fill('[name="whyLead"]', 'This city has a thriving startup scene that needs more structure.');
  await page.fill('[name="background"]', 'Former naval officer and computer scientist.');
  await page.fill('[name="chapterVision"]', 'Monthly meetups, annual summit, mentorship programme.');

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll reach out if it's the right time/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Chapter form — blur validation
// -----------------------------------------------------------------------
test('chapter form shows blur validation errors', async ({ page }) => {
  await page.goto('/apply/chapter');
  await page.getByRole('button', { name: /submit application/i }).waitFor();

  await page.locator('[name="fullName"]').focus();
  await page.locator('[name="fullName"]').blur();
  await expect(page.getByText('What should we call you?')).toBeVisible({ timeout: 5000 });

  await page.locator('[name="fullName"]').fill('Grace Hopper');
  await page.locator('[name="fullName"]').blur();
  await expect(page.getByText('What should we call you?')).not.toBeVisible({ timeout: 5000 });
});

// -----------------------------------------------------------------------
// Solutions form  (/apply/solutions)
// -----------------------------------------------------------------------
test('solutions form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'solutions');
  await page.goto('/apply/solutions');

  await page.fill('[name="providerName"]', 'Margaret Hamilton');
  await page.fill('[name="email"]', 'margaret@example.com');

  // Phone (required)
  await page.locator('.phone-input-dark input[type="tel"]').fill('+1 617 555 0199');

  await page.fill('[name="linkedIn"]', 'https://linkedin.com/in/margaret');

  // Service Category is a custom dropdown
  await selectDropdownOption(page, 'category', 'Technology & Product');

  await page.fill('[name="bio"]', 'Software engineer who put humans on the moon.');
  await page.fill('[name="servicesOffered"]', 'Technical architecture reviews and product strategy.');
  await page.fill('[name="portfolioUrl"]', 'https://hamilton.dev');
  await page.fill('[name="rateRange"]', '$200-300/hr');

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll review your application/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Solutions form — blur validation
// -----------------------------------------------------------------------
test('solutions form shows blur validation errors', async ({ page }) => {
  await page.goto('/apply/solutions');
  await page.getByRole('button', { name: /submit application/i }).waitFor();

  await page.locator('[name="providerName"]').focus();
  await page.locator('[name="providerName"]').blur();
  await expect(page.getByText('What should we call you?')).toBeVisible({ timeout: 5000 });

  await page.locator('[name="providerName"]').fill('Margaret Hamilton');
  await page.locator('[name="providerName"]').blur();
  await expect(page.getByText('What should we call you?')).not.toBeVisible({ timeout: 5000 });
});

// -----------------------------------------------------------------------
// Ventures form  (/apply/ventures)
// -----------------------------------------------------------------------
test('ventures form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'ventures');
  await page.goto('/apply/ventures');

  await page.fill('[name="founderName"]', 'Alan Turing');
  await page.fill('[name="email"]', 'alan@example.com');
  await page.fill('[name="companyName"]', 'Turing Machines Inc.');
  await page.fill('[name="oneLineDescription"]', 'A universal computing machine that solves the halting problem.');

  // Phone (required)
  await page.locator('.phone-input-dark input[type="tel"]').fill('+44 20 7946 0123');

  // Stage is a custom dropdown
  await selectDropdownOption(page, 'stage', 'Pre-Seed');

  // Sector is a custom dropdown
  await selectDropdownOption(page, 'sector', 'AI / ML');
  await page.fill('[name="raiseAmount"]', '$500K');
  await page.fill('[name="linkedIn"]', 'https://linkedin.com/in/turing');
  await page.fill('[name="pitchDeckUrl"]', 'https://deck.turing.io');

  await page.fill('[name="whySAGIE"]', 'Looking for founders who think in abstractions.');

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll be in touch/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Ventures form — blur validation
// -----------------------------------------------------------------------
test('ventures form shows blur validation errors', async ({ page }) => {
  await page.goto('/apply/ventures');
  await page.getByRole('button', { name: /submit application/i }).waitFor();

  await page.locator('[name="founderName"]').focus();
  await page.locator('[name="founderName"]').blur();
  await expect(page.getByText('What should we call you?')).toBeVisible({ timeout: 5000 });

  await page.locator('[name="founderName"]').fill('Alan Turing');
  await page.locator('[name="founderName"]').blur();
  await expect(page.getByText('What should we call you?')).not.toBeVisible({ timeout: 5000 });
});

// -----------------------------------------------------------------------
// Suggest event form  (/suggest-event)
// -----------------------------------------------------------------------
test('suggest event form submits and shows success state', async ({ page }) => {
  await mockRoute(page, '/api/suggest-event');
  await page.goto('/suggest-event');

  // Updated field names: suggestedBy (was yourName), removed eventType/proposedDate/yourEmail
  await page.fill('[name="eventName"]', 'SAGIE Miami Founder Meetup');
  await page.fill('[name="suggestedBy"]', 'Katherine Johnson');
  await page.locator('textarea[name="description"]').fill('A casual networking event for founders in the Miami ecosystem.');

  await page.getByRole('button', { name: /submit suggestion/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we got your idea/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Suggest event form — blur validation
// -----------------------------------------------------------------------
test('suggest event form shows blur validation errors', async ({ page }) => {
  await page.goto('/suggest-event');
  await page.getByRole('button', { name: /submit suggestion/i }).waitFor();

  await page.locator('[name="eventName"]').focus();
  await page.locator('[name="eventName"]').blur();
  await expect(page.getByText("What's the event called?")).toBeVisible({ timeout: 5000 });

  await page.locator('[name="eventName"]').fill('SAGIE Miami Founder Meetup');
  await page.locator('[name="eventName"]').blur();
  await expect(page.getByText("What's the event called?")).not.toBeVisible({ timeout: 5000 });
});
