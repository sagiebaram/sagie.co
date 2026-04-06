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
  // Click the option scoped to this field's listbox (avoids phone input country collision)
  await page.locator(`#${fieldName}-listbox`).getByRole('option', { name: optionText }).click()
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

  // Accept privacy consent
  await page.getByRole('checkbox', { name: /privacy policy/i }).check();

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

  // Accept privacy consent
  await page.getByRole('checkbox').check();

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

  // Accept privacy consent
  await page.getByRole('checkbox').check();

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
// Ventures form  (/apply/ventures/founder)
// -----------------------------------------------------------------------
test('ventures form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'ventures');
  await page.goto('/apply/ventures/founder');

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

  // Accept privacy consent
  await page.getByRole('checkbox').check();

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/we'll be in touch/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Ventures form — blur validation
// -----------------------------------------------------------------------
test('ventures form shows blur validation errors', async ({ page }) => {
  await page.goto('/apply/ventures/founder');
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
  await page.fill('[name="email"]', 'katherine@example.com');
  await page.locator('textarea[name="description"]').fill('A casual networking event for founders in the Miami ecosystem.');

  // Accept privacy consent
  await page.getByRole('checkbox').check();

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

// -----------------------------------------------------------------------
// API Error Paths
// -----------------------------------------------------------------------
test('API rate limiting returns 429 and shows error', async ({ page }) => {
  await page.route('**/api/applications/membership', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: 'Too many requests' }) });
    } else {
      await route.continue();
    }
  });
  await page.goto('/apply');
  // Fill necessary fields to enable submit
  await page.fill('[name="fullName"]', 'Ada Lovelace');
  await page.fill('[name="email"]', 'ada@example.com');
  await selectDropdownOption(page, 'country', 'United Kingdom');
  await selectDropdownOption(page, 'city', 'London');
  await page.locator('.phone-input-dark input[type="tel"]').fill('+44 20 7946 0958');
  await selectDropdownOption(page, 'role', 'Founder');
  await page.fill('[name="whatTheyNeed"]', 'Building a compiler.');
  await page.fill('[name="howTheyKnowSagie"]', 'Word of mouth.');
  await page.locator('#category [role="checkbox"]', { hasText: 'Founder' }).click();

  await page.getByRole('button', { name: /submit application/i }).click();
  // Form submission failure shows generic fallback or specific error. Usually a toast or error block
  await expect(page.getByText(/You've submitted several times recently|Too many requests/i)).toBeVisible({ timeout: 10000 });
});

test('API invalid data returns 422 and shows field errors', async ({ page }) => {
  await page.route('**/api/applications/membership', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ error: 'Validation failed', fieldErrors: { email: ['Invalid email address (from mocked)'] } }) });
    } else {
      await route.continue();
    }
  });
  await page.goto('/apply');
  
  await page.fill('[name="fullName"]', 'Ada Lovelace');
  await page.fill('[name="email"]', 'ada@example.com');
  await selectDropdownOption(page, 'country', 'United Kingdom');
  await selectDropdownOption(page, 'city', 'London');
  await page.locator('.phone-input-dark input[type="tel"]').fill('+44 20 7946 0958');
  await selectDropdownOption(page, 'role', 'Founder');
  await page.fill('[name="whatTheyNeed"]', 'Building a compiler.');
  await page.fill('[name="howTheyKnowSagie"]', 'Word of mouth.');
  await page.locator('#category [role="checkbox"]', { hasText: 'Founder' }).click();

  await page.getByRole('button', { name: /submit application/i }).click();

  // The form component maps 422 errors back to UI fields
  await expect(page.getByText('Invalid email address (from mocked)')).toBeVisible({ timeout: 10000 });
});

test('API Notion failure returns 500 and shows generic error', async ({ page }) => {
  await page.route('**/api/applications/membership', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal Server Error' }) });
    } else {
      await route.continue();
    }
  });
  await page.goto('/apply');
  
  await page.fill('[name="fullName"]', 'Ada Lovelace');
  await page.fill('[name="email"]', 'ada@example.com');
  await selectDropdownOption(page, 'country', 'United Kingdom');
  await selectDropdownOption(page, 'city', 'London');
  await page.locator('.phone-input-dark input[type="tel"]').fill('+44 20 7946 0958');
  await selectDropdownOption(page, 'role', 'Founder');
  await page.fill('[name="whatTheyNeed"]', 'Building a compiler.');
  await page.fill('[name="howTheyKnowSagie"]', 'Word of mouth.');
  await page.locator('#category [role="checkbox"]', { hasText: 'Founder' }).click();

  await page.getByRole('button', { name: /submit application/i }).click();

  await expect(page.getByText(/We couldn't submit your application|Internal Server Error/i)).toBeVisible({ timeout: 10000 });
});

// -----------------------------------------------------------------------
// Type property differentiation constraint verify
// -----------------------------------------------------------------------
test('ventures form differentiation - founder type is submitted', async ({ page }) => {
  await mockApplicationRoute(page, 'ventures');
  await page.goto('/apply/ventures/founder');

  await page.fill('[name="founderName"]', 'Alan Turing');
  await page.fill('[name="email"]', 'alan@example.com');
  await page.fill('[name="companyName"]', 'Turing Machines Inc.');
  await page.fill('[name="oneLineDescription"]', 'A universal computing machine that solves the halting problem.');
  await page.locator('.phone-input-dark input[type="tel"]').fill('+44 20 7946 0123');
  await selectDropdownOption(page, 'stage', 'Pre-Seed');
  await selectDropdownOption(page, 'sector', 'AI / ML');
  await page.fill('[name="raiseAmount"]', '$500K');
  await page.fill('[name="linkedIn"]', 'https://linkedin.com/in/turing');
  await page.fill('[name="pitchDeckUrl"]', 'https://deck.turing.io');
  await page.fill('[name="whySAGIE"]', 'Looking for founders who think in abstractions.');

  const requestPromise = page.waitForRequest(req => req.url().includes('/api/applications/ventures') && req.method() === 'POST');
  
  await page.getByRole('button', { name: /submit application/i }).click();

  const request = await requestPromise;
  const postData = JSON.parse(request.postData() || '{}');
  
  // Verify Type is Founder
  expect(postData.ventureType).toBe('founder');
});
