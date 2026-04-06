# Track 1: Critical Accessibility + Visual Tokens

**Branch:** `fix/accessibility-visual-tokens`
**Priority:** Critical | **Effort:** L (6-8hr)
**Sprint:** 04-05-2026 (04-06 → 04-07)

---

## Goal

Fix all WCAG 2.2 AA failures, raise text contrast and font sizes, add privacy consent to forms, fix form method to POST, and add missing ARIA attributes across the site.

## Notion Tracker Items

| Task | Page ID | Priority |
|------|---------|----------|
| Track 1: Critical Accessibility + Visual Tokens | 33a5efbd-09e3-81b6-9efd-c91a631bcb96 | Critical |

**On start:** set status to "In Development"
**On PR:** set status to "In Review" + add PR URL
**On merge:** set status to "Done"

## Files to Create/Modify

- `src/app/globals.css` — CSS tokens, focus outlines, reduced-motion, font size
- `src/components/forms/MembershipForm.tsx` — consent checkbox, method fix
- `src/components/forms/ChapterForm.tsx` — consent checkbox, method fix
- `src/components/forms/SolutionsForm.tsx` — consent checkbox, method fix
- `src/components/forms/VenturesForm.tsx` — consent checkbox, method fix, "Founder Name" → "Your Name" on investor path
- `src/components/forms/ContactForm.tsx` — consent checkbox, method fix
- `src/components/forms/SuggestEventForm.tsx` — add email field, method fix
- `src/components/forms/SubmitPostForm.tsx` — check if PII collected, fix method if needed
- `src/lib/schemas.ts` — add `privacyConsent` boolean field to all PII form schemas, add email to suggest-event schema
- `src/app/api/suggest-event/route.ts` — accept email field in handler
- `src/app/(marketing)/page.tsx` — metadata title
- `src/app/(marketing)/apply/page.tsx` — metadata: "Apply to Join SAGIE ECO | SAGIE"
- `src/app/(marketing)/apply/chapter/page.tsx` — metadata: "Apply as Chapter Lead | SAGIE"
- `src/app/(marketing)/apply/solutions/page.tsx` — metadata: "Apply as Solutions Provider | SAGIE"
- `src/app/(marketing)/apply/ventures/page.tsx` — metadata: "SAGIE Ventures Intake | SAGIE"
- `src/app/(marketing)/apply/ventures/founder/page.tsx` — metadata: "Founder Application | SAGIE Ventures"
- `src/app/(marketing)/apply/ventures/investor/page.tsx` — metadata: "Investor Application | SAGIE Ventures"
- `src/app/(marketing)/suggest-event/page.tsx` — metadata: "Suggest an Event | SAGIE"
- `src/app/(marketing)/contact/page.tsx` — metadata: "Contact | SAGIE"
- `src/app/(marketing)/blog/page.tsx` — newsletter label fix + metadata check
- `src/app/(marketing)/blog/[slug]/page.tsx` — metadata check
- `src/app/(marketing)/eco/page.tsx` — metadata check
- `src/app/(marketing)/events/page.tsx` — metadata check
- `src/app/(marketing)/resources/page.tsx` — aria-labels on "Visit →" links + metadata check
- `src/app/(marketing)/solutions/page.tsx` — aria-labels on "Work with me →" links + metadata check
- `src/app/(marketing)/ventures/page.tsx` — aria-labels on "Schedule a Call →" CTAs + metadata check
- `src/app/(marketing)/privacy/page.tsx` — metadata check
- `src/app/(marketing)/terms/page.tsx` — metadata check
- `src/components/ui/LocationFields.tsx` — filter out Palestine from country list
- `src/components/ui/PhoneField.tsx` — filter out Palestine from country code list
- Homepage pillar section component (likely in `src/components/sections/`) — `aria-hidden` on duplicate cards

## Acceptance Criteria

- [ ] All 7 PII-collecting forms use `method="POST"` (verify in DOM)
- [ ] Every form that collects name/email/phone has a required privacy consent checkbox linking to /privacy
- [ ] `:focus-visible` outline visible on ALL interactive elements site-wide (buttons, links, inputs, toggles)
- [ ] `@media (prefers-reduced-motion: reduce)` rule sets all scroll-animated elements to `opacity: 1; transform: none`
- [ ] Muted body text color passes WCAG AA 4.5:1 contrast on `rgb(12,12,12)` background
- [ ] No text color below 3:1 contrast ratio used for any readable text
- [ ] Base body font size is 16px minimum (hero subtitles, blog body, form labels)
- [ ] Overall color tokens shifted toward higher contrast (less gray, more white/silver)
- [ ] Every page has a unique, descriptive `<title>` tag
- [ ] Investor application form says "Your Name" not "Founder Name"
- [ ] Suggest-event form includes a required email field
- [ ] "State of Palestine" (or equivalent) is filtered from country/phone dropdowns
- [ ] Homepage pillar duplicate cards have `aria-hidden="true"` on the cloned set
- [ ] "Work with me →" links on /solutions have unique `aria-label` per provider
- [ ] "Schedule a Call →" CTAs on /ventures have `aria-label` distinguishing investor vs founder
- [ ] "Visit →" links on /resources have `aria-label` with resource name
- [ ] Blog hero newsletter input has a proper `<label for>` association
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] All existing tests pass (`npm run test:ci`)

## Technical Context

- **Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript strict
- **Tailwind v4:** No tailwind.config.js — CSS-first config via `src/app/globals.css` and `postcss.config.mjs`. Color tokens defined as CSS custom properties.
- **Forms:** Use `react-hook-form` + Zod schemas from `src/lib/schemas.ts`. All API routes use `withValidation` HOF from `src/lib/validation.ts`.
- **Country data:** Comes from `country-state-city` npm package v3.2.1. Filter Palestine at the component rendering level in `LocationFields.tsx` and `PhoneField.tsx` — do NOT fork the package.
- **GSAP:** All animations use GSAP with GSAPCleanup component for unmount. Scroll-triggered animations use `IntersectionObserver`. The `prefers-reduced-motion` fix should be a CSS-level override that disables the initial `opacity: 0` state, not a JS change.
- **Metadata:** Next.js App Router uses `export const metadata: Metadata = {}` or `export function generateMetadata()` in page.tsx files.

## Implementation Details

1. **CSS tokens first** (globals.css):
   - Define/update color custom properties for muted text, dim text, body text
   - Set `--font-size-body: 1rem` (16px) as the minimum body size
   - Add `:focus-visible` rule globally
   - Add `@media (prefers-reduced-motion: reduce)` block targeting `[data-scroll-reveal]` or equivalent selectors used by ScrollReveal
   - Shift gray tokens toward higher contrast (audit existing token values, raise each)

2. **Forms** (all 7 form components):
   - Change `<form>` from `method="GET"` to `method="POST"` (or remove method entirely if using `onSubmit` with fetch — verify the submission pattern first)
   - Add privacy consent checkbox at bottom: "I agree to SAGIE's [Privacy Policy](/privacy) and consent to processing of this data."
   - Add `privacyConsent: z.literal(true)` to each Zod schema in `schemas.ts`
   - In VenturesForm.tsx: find the investor path and change "Founder Name" label to "Your Name"
   - In SuggestEventForm.tsx: add email field (required, type email)
   - Update `src/app/api/suggest-event/route.ts` to accept and validate the new email field

3. **Page titles** (each page.tsx):
   - Audit every page's metadata export
   - Set unique, descriptive titles: "Apply to Join SAGIE ECO | SAGIE", "Contact | SAGIE", etc.
   - Format: "[Page Purpose] | SAGIE" — keep consistent

4. **ARIA fixes**:
   - Homepage: find the pillar card duplication (likely a GSAP scroll clone) and add `aria-hidden="true"` to the duplicate set
   - /solutions: each "Work with me →" link gets `aria-label="Work with [Provider Name]"`
   - /ventures: the two "Schedule a Call →" get `aria-label="Schedule a call as an investor"` and `"...as a founder"`
   - /resources: each "Visit →" link gets `aria-label="Visit [Resource Name]"`
   - /blog: newsletter input gets `id="blog-newsletter-email"` and label gets `for="blog-newsletter-email"`

5. **Country filtering**:
   - In `LocationFields.tsx` and `PhoneField.tsx`, filter the country list from `country-state-city` to exclude entries where `isoCode === "PS"` or `name === "Palestine"` (check exact key name in the package)
