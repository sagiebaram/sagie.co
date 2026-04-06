# Sprint 04-05 — Claude Code Session Prompts
**Sprint:** 04-06-2026 → 04-07-2026

---

## TRACK 1: Critical Accessibility + Visual Tokens
Branch: `fix/accessibility-visual-tokens`
Priority: Critical
Effort: L (6-8hr)

### Notion Tracker Items
| Task | Page ID | Priority |
|------|---------|----------|
| Track 1: Critical Accessibility + Visual Tokens | 33a5efbd-09e3-81b6-9efd-c91a631bcb96 | Critical |

### Notion Status Updates
On start: set status to "In Development"
On PR: set status to "In Review" + add PR URL
On merge: set status to "Done"

### Goal
Fix all WCAG 2.2 AA failures, raise text contrast and font sizes, add privacy consent to forms, fix form method to POST, and add missing ARIA attributes across the site.

### Files to Create/Modify
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

### Acceptance Criteria
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

### Technical Context
- **Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript strict
- **Tailwind v4:** No tailwind.config.js — CSS-first config via `src/app/globals.css` and `postcss.config.mjs`. Color tokens defined as CSS custom properties.
- **Forms:** Use `react-hook-form` + Zod schemas from `src/lib/schemas.ts`. All API routes use `withValidation` HOF from `src/lib/validation.ts`.
- **Country data:** Comes from `country-state-city` npm package v3.2.1. Filter Palestine at the component rendering level in `LocationFields.tsx` and `PhoneField.tsx` — do NOT fork the package.
- **GSAP:** All animations use GSAP with GSAPCleanup component for unmount. Scroll-triggered animations use `IntersectionObserver`. The `prefers-reduced-motion` fix should be a CSS-level override that disables the initial `opacity: 0` state, not a JS change.
- **Metadata:** Next.js App Router uses `export const metadata: Metadata = {}` or `export function generateMetadata()` in page.tsx files.

### Implementation Details
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

---

## TRACK 2: UI Components Polish
Branch: `fix/ui-components`
Priority: High
Effort: M (3-5hr)

### Notion Tracker Items
| Task | Page ID | Priority |
|------|---------|----------|
| Track 2: UI Components Polish | 33a5efbd-09e3-81c7-880e-cc7ee3f5cbe0 | High |

### Notion Status Updates
On start: set status to "In Development"
On PR: set status to "In Review" + add PR URL
On merge: set status to "Done"

### Goal
Fix navbar quality issues, shrink the footer, fix the Who's it for card layout, and improve section navigation dots.

### Files to Create/Modify
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/sections/WhoItsFor.tsx`
- `src/constants/personas.ts`
- `src/components/ui/SectionNav.tsx`

### Acceptance Criteria
- [ ] Navbar logo and "Apply to Join" button are visually consistent, crisp, and aligned
- [ ] Footer is noticeably more compact — reduced padding, tighter layout
- [ ] Footer newsletter email form is REMOVED entirely (not hidden — removed from DOM)
- [ ] Who's it for cards: the small square icon in the top-right corner is positioned identically on every card
- [ ] Who's it for cards: the outline/border wraps fully and consistently around each card in all states (default, hover, flipped)
- [ ] Section nav dots are minimum 20×20px hit target
- [ ] Section nav inactive labels have opacity ≥ 0.65
- [ ] Section nav labels appear at full opacity on hover AND keyboard focus
- [ ] Responsive: all changes look correct on Desktop, Tablet, Mobile
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes

### Technical Context
- **Navbar:** `src/components/layout/Navbar.tsx` — check current logo implementation (SVG? Image? CSS?). The "Apply to Join" button should use the site's Button component with consistent sizing.
- **Footer:** `src/components/layout/Footer.tsx` — currently contains a newsletter email collection form. Remove the entire newsletter section. Keep the pillar columns, legal links, and copyright.
- **WhoItsFor:** Uses persona data from `src/constants/personas.ts`. Cards have a flip interaction with GSAP. The issue is the small square icon in the top-right and the outline border around the card.
- **SectionNav:** `src/components/ui/SectionNav.tsx` — sticky side navigation with dots. Currently 5×5px dots at 0.35 opacity.

### Implementation Details
1. **Navbar:**
   - Audit the logo rendering — is it SVG inline, an `<img>`, or a component? Ensure it renders at crisp resolution on all screens
   - The "Apply to Join" CTA should match the rest of the site's button styling (consistent padding, font-size, border-radius)
   - Check alignment: logo left, nav links center or right, CTA right — ensure vertical centering

2. **Footer:**
   - Delete the newsletter form section entirely from the Footer component
   - Remove any associated state, imports, or API calls related to newsletter subscription in the footer
   - Reduce vertical padding/margins throughout the footer
   - Tighten the column layout — less whitespace between sections
   - Verify the footer still contains: pillar links (ECO, Solutions, Ventures), legal links (Privacy, Terms), and copyright

3. **WhoItsFor cards:**
   - Inspect the card component for the top-right icon element — it should use `position: absolute; top: [value]; right: [value]` with identical values on every card
   - The outline/border: ensure `border` or `outline` property wraps the full card including rounded corners. Check for `overflow: hidden` clipping issues.
   - Test in both default and flipped states — the outline should persist through the flip animation

4. **SectionNav dots:**
   - Increase the dot `<button>` element size to minimum `width: 20px; height: 20px`
   - Add padding or a larger click area if the visual dot should remain small: `padding: 8px` around a 6px dot
   - Raise `opacity` of inactive labels from 0.35 to 0.65
   - Add `:hover` and `:focus-visible` state that sets label opacity to 1.0
   - Ensure tooltip/label appears on keyboard focus, not just mouse hover

---

## TRACK 3: Globe + Performance Fixes
Branch: `fix/globe-performance`
Priority: High
Effort: S-M (2-3hr)

### Notion Tracker Items
| Task | Page ID | Priority |
|------|---------|----------|
| Track 3: Globe + Performance Fixes | 33a5efbd-09e3-8162-aada-cd44a79e5502 | High |

### Notion Status Updates
On start: set status to "In Development"
On PR: set status to "In Review" + add PR URL
On merge: set status to "Done"

### Goal
Make the globe visible on tablet and mobile, fix point sizing, add proper TypeScript types, and optimize CircuitBackground for high-DPI screens.

### Files to Create/Modify
- `src/components/GlobeClient.tsx`
- `src/components/GlobeNetwork.tsx`
- `src/components/GlobeShell.tsx`
- `src/components/ui/CircuitBackground.tsx`
- `src/types/index.ts` or `src/types/globe.ts` (new if needed)

### Acceptance Criteria
- [ ] Globe renders and is interactive on tablet (768px-1024px) and mobile (<768px)
- [ ] Globe point size is 0.1, altitude is 0.010
- [ ] No `any` types remain in Globe components — all data (arcs, points, labels) has proper TypeScript interfaces
- [ ] CircuitBackground scales correctly on high-DPI (2x, 3x) displays without performance degradation
- [ ] CircuitBackground reduces particle count on mobile (< 768px)
- [ ] No console errors or warnings from Globe or CircuitBackground
- [ ] `npm run typecheck` passes with no new type errors

### Technical Context
- **Globe:** Uses `react-globe.gl` (2.37.0) + `three` (0.183.2). The globe is rendered in `GlobeClient.tsx` (client component with `"use client"`), data in `GlobeNetwork.tsx`, wrapper in `GlobeShell.tsx`.
- **CircuitBackground:** `src/components/ui/CircuitBackground.tsx` — canvas-based particle animation. Known concern: scaling on high-DPI.
- **GSAPCleanup:** If any GSAP animations exist in these components, wrap with GSAPCleanup.

### Implementation Details
1. **Globe visibility on tablet/mobile:**
   - Check if the globe is hidden via CSS (`hidden`, `display: none`, or responsive class like `lg:block`)
   - If hidden, make it visible at all breakpoints. If performance is the concern, consider a static fallback image at mobile sizes or a smaller globe
   - Ensure the container is responsive — the globe should scale to fit its container width
   - Test touch interactions (rotate, zoom) work on mobile

2. **Globe point config:**
   - Find where point size and altitude are configured (likely props on the Globe component or in GlobeNetwork data)
   - Set `pointRadius: 0.1` and `pointAltitude: 0.010` (or equivalent prop names)

3. **Globe type safety:**
   - Define interfaces for: `GlobePoint` (lat, lng, size, color, label), `GlobeArc` (startLat, startLng, endLat, endLng, color), `GlobeLabel`
   - Replace all `any` types in GlobeClient, GlobeNetwork, GlobeShell with these interfaces
   - Add types to the callback functions (onClick, onHover, etc.)

4. **CircuitBackground optimization:**
   - Add `window.devicePixelRatio` awareness — scale canvas resolution but limit to 2x max
   - Detect mobile via `window.innerWidth < 768` and reduce particle count (e.g., 50% of desktop count)
   - Use `requestAnimationFrame` efficiently — ensure animation loop is cleaned up on unmount
   - Consider `will-change: transform` CSS optimization

---

## TRACK 4: Scroll Position Fix
Branch: `fix/scroll-position`
Priority: High
Effort: S (1-2hr)

### Notion Tracker Items
| Task | Page ID | Priority |
|------|---------|----------|
| Track 4: Scroll Position Fix | 33a5efbd-09e3-813e-ad64-e8cf4b216d58 | High |

### Notion Status Updates
On start: set status to "In Development"
On PR: set status to "In Review" + add PR URL
On merge: set status to "Done"

### Goal
Fix the page load scroll reveal behavior — currently scrolls back to the top on initial load instead of preserving the user's scroll position.

### Files to Create/Modify
- `src/components/ui/ScrollReveal.tsx`
- `src/hooks/useScrollReveal.ts`
- `src/components/ui/TransitionLink.tsx`
- `src/components/ui/PageHeroAnimation.tsx`

### Acceptance Criteria
- [ ] When navigating between pages, the new page loads at the expected position (top for new navigations, preserved for back/forward)
- [ ] Browser back/forward button preserves scroll position
- [ ] Scroll reveal animations still fire correctly when scrolling down
- [ ] Page transitions (View Transition API from PR #29) still work smoothly
- [ ] No flash of content at wrong scroll position on page load

### Technical Context
- **ScrollReveal:** `src/components/ui/ScrollReveal.tsx` — wraps sections with IntersectionObserver-based reveal.
- **useScrollReveal:** `src/hooks/useScrollReveal.ts` — custom hook for scroll-triggered animations.
- **TransitionLink:** `src/components/ui/TransitionLink.tsx` — handles page transitions using View Transition API (PR #29).
- **PageHeroAnimation:** `src/components/ui/PageHeroAnimation.tsx` — hero entrance animation.
- **The bug:** On initial page load (or page transition), the scroll position resets to top. This likely happens because:
  1. ScrollReveal sets elements to `opacity: 0` initially, and
  2. The page height changes as elements become visible, causing scroll position to shift, OR
  3. The TransitionLink or PageHeroAnimation explicitly scrolls to top

### Implementation Details
1. **Diagnose the cause:**
   - Check if `window.scrollTo(0, 0)` or `scrollTop = 0` is called anywhere in TransitionLink, PageHeroAnimation, or layout components
   - Check if Next.js `scrollRestoration` is being overridden
   - Check if the View Transition API callbacks reset scroll

2. **Fix scroll restoration:**
   - If Next.js scroll restoration is disabled, re-enable it or implement manual restoration
   - If a component is explicitly scrolling to top, add a condition: only scroll to top on forward navigation, not on back/forward or same-page reload
   - Consider using `history.scrollRestoration = 'manual'` with a custom implementation that saves/restores position

3. **Ensure animations still work:**
   - ScrollReveal should still trigger on scroll — the fix should preserve position without breaking IntersectionObserver triggers
   - Test: navigate to a page, scroll down, navigate away, press back — should return to previous scroll position with all content visible

---

## TRACK 5: Form Validation UX
Branch: `feature/form-validation-ux`
Priority: Medium
Effort: M (3-5hr)
**⚠️ DEPENDS ON TRACK 1 MERGE — do not start until Track 1 is merged to main**

### Notion Tracker Items
| Task | Page ID | Priority |
|------|---------|----------|
| Track 5: Form Validation UX | 33a5efbd-09e3-81a6-b01e-c0fd04f8cf09 | Medium |

### Notion Status Updates
On start: set status to "In Development"
On PR: set status to "In Review" + add PR URL
On merge: set status to "Done"

### Goal
Enhance form validation UX with visual valid/invalid states, animated feedback, and cascading field locks.

### Files to Create/Modify
- `src/components/forms/MembershipForm.tsx`
- `src/components/forms/ChapterForm.tsx`
- `src/components/forms/SolutionsForm.tsx`
- `src/components/forms/VenturesForm.tsx`
- `src/components/forms/ContactForm.tsx`
- `src/components/forms/SuggestEventForm.tsx`
- `src/components/ui/FormField.tsx`
- `src/components/ui/LocationFields.tsx`
- `src/app/globals.css` (validation state classes)

### Acceptance Criteria
- [ ] Invalid fields show red border + red error text on blur (after first interaction)
- [ ] Valid fields show green border + green checkmark icon on blur
- [ ] Validation state transitions are animated (smooth border color change, error text slides in)
- [ ] Error text is minimum 14px, high contrast against background
- [ ] Country → State → City fields: State is disabled/locked until Country is selected; City is disabled until State/Country is selected
- [ ] Locked fields have a visual "disabled" state (dimmed, with a lock icon or tooltip)
- [ ] All existing form submission functionality still works
- [ ] All existing tests pass

### Technical Context
- **Forms use:** `react-hook-form` (7.72.0) + `@hookform/resolvers` (5.2.2) with Zod schemas from `src/lib/schemas.ts`
- **FormField:** `src/components/ui/FormField.tsx` — reusable form field wrapper component. This is likely where validation state styling should be centralized.
- **LocationFields:** `src/components/ui/LocationFields.tsx` — handles Country/State/City fields. Uses `country-state-city` package.
- **Styling:** Tailwind CSS utilities + `cn()` helper for conditional classes.
- **Animation:** For validation animations, use CSS transitions (not GSAP) — these are simple state changes that don't need a full animation library.

### Implementation Details
1. **Validation state styles** (globals.css + FormField):
   - Define CSS classes: `.field-valid`, `.field-invalid`, `.field-locked`
   - `.field-valid`: green border (`border-green-500`), green checkmark icon
   - `.field-invalid`: red border (`border-red-500`), red error text
   - `.field-locked`: dimmed opacity (0.5), `pointer-events: none`, subtle lock indicator
   - Add `transition: border-color 0.2s ease, opacity 0.2s ease` for smooth state changes

2. **FormField component enhancement:**
   - Accept validation state from react-hook-form (`formState.errors`, `formState.touchedFields`, `formState.dirtyFields`)
   - Show invalid state: when field is touched AND has an error
   - Show valid state: when field is touched AND has no error AND has a value
   - Show neutral state: when field is untouched
   - Error text: animate in with `max-height` + `opacity` transition

3. **Field locking cascade:**
   - In LocationFields.tsx: use `watch()` from react-hook-form to observe Country and State values
   - State field: `disabled` until Country has a value
   - City field: `disabled` until State has a value (or Country if no states)
   - When a parent field changes, reset child fields (e.g., changing Country clears State and City)
   - Apply `.field-locked` styling to disabled fields

---

## TRACK 6: SVG Icons Integration
Branch: `feature/svg-icons`
Priority: Medium
Effort: S-M (2-3hr)
**⚠️ DEPENDS ON: Sagie adding SVG files to repo**

### Notion Tracker Items
| Task | Page ID | Priority |
|------|---------|----------|
| Track 6: SVG Icons Integration (static) | 33a5efbd-09e3-8151-9b96-ff77a8f7c207 | Medium |

### Notion Status Updates
On start: set status to "In Development"
On PR: set status to "In Review" + add PR URL
On merge: set status to "Done"

### Goal
Add Sagie's custom SVG icons as static elements in relevant website sections.

### Files to Create/Modify
- `public/icons/` — SVG files (added by Sagie)
- Section components where icons will be placed (specific files TBD based on icon set)
- Potentially `src/components/ui/Icon.tsx` — reusable icon component

### Acceptance Criteria
- [ ] All SVG icons are placed in their designated sections
- [ ] Icons render at correct size and inherit appropriate colors
- [ ] Icons have proper `alt` text or `aria-label` for accessibility
- [ ] Icons are responsive — scale appropriately across breakpoints
- [ ] Icons are added as static elements (animation comes in a future sprint)
- [ ] No console errors from SVG rendering

### Technical Context
- **SVG approach:** Import SVGs as React components (Next.js supports this) or reference from `public/` directory via `<img>` or inline SVG.
- **Recommended:** If icons need to inherit text color, use inline SVG with `fill="currentColor"`. If they're decorative images, `<img>` with empty `alt=""` is fine.
- **Animation prep:** Since these will be animated in a future sprint, structure the SVG elements cleanly with `id` attributes on animatable paths/groups.

### Implementation Details
1. **Wait for Sagie** to push SVG files to the repo
2. **Audit the icon set** — determine what each icon represents and which section it belongs to
3. **Create an Icon component** if multiple icons share the same sizing/color pattern:
   ```tsx
   export const Icon = ({ name, size = 24, className }: IconProps) => (...)
   ```
4. **Place icons** in their sections — specific placement TBD based on the icon set
5. **Ensure accessibility** — decorative icons get `aria-hidden="true"`, meaningful icons get `aria-label`

---

## TRACK 7: Test Coverage Expansion
Branch: `test/coverage-expansion`
Priority: Medium
Effort: L (separate agent — run in parallel)

### Notion Tracker Items
| Task | Page ID | Priority |
|------|---------|----------|
| Track 7: Test Coverage Expansion | 33a5efbd-09e3-812c-98c9-d196979e84fe | Medium |

### Notion Status Updates
On start: set status to "In Development"
On PR: set status to "In Review" + add PR URL
On merge: set status to "Done"

### Goal
Generate comprehensive unit tests and E2E tests for untested modules and critical user flows.

### Files to Create/Modify
- `src/lib/__tests__/validation.test.ts` — withValidation HOF tests
- `src/lib/__tests__/email.test.ts` — sendEmails tests (if not existing)
- `src/lib/__tests__/blog.test.ts` — blog data transformation tests
- `src/lib/__tests__/events.test.ts` — events data transformation tests
- `src/lib/__tests__/members.test.ts` — members data tests
- `src/lib/__tests__/chapters.test.ts` — chapters data tests
- `src/lib/__tests__/resources.test.ts` — resources data tests
- `src/lib/__tests__/solutions.test.ts` — solutions data tests
- `src/lib/__tests__/calendar.test.ts` — calendar integration tests
- `tests/homepage.spec.ts` — E2E homepage critical path
- `tests/forms.spec.ts` — E2E form submission flows
- `tests/blog.spec.ts` — E2E blog navigation + slug rendering
- `tests/navigation.spec.ts` — E2E nav links, footer links, 404

### Acceptance Criteria
- [ ] Unit tests exist for ALL lib modules (validation, email, blog, events, members, chapters, resources, solutions, calendar)
- [ ] Unit tests cover: valid data, invalid data, edge cases, error paths
- [ ] E2E tests cover: homepage load, form submission (at least membership), blog listing + slug, 404 page
- [ ] API error path tests: rate limiting returns 429, invalid data returns 422, Notion failure returns 500
- [ ] Ventures form E2E: verify founder vs investor Type property differentiation
- [ ] All tests pass: `npm run test:ci` and `npx playwright test`
- [ ] No snapshot tests (project convention)

### Technical Context
- **Unit testing:** Vitest 4.1.2 with `@vitest/coverage-v8`. Mocking: `vi.mock()` for modules.
- **Commonly mocked:** `server-only`, `@notionhq/client`, `resend`, `@sentry/nextjs`
- **Fixture pattern:** Module-level constants named `FULL_PAGE_FIXTURE`, `MINIMAL_EVENT_FIXTURE` — must mirror real Notion API response shapes.
- **E2E:** Playwright 1.58.2. CI runs single worker. Base URL from `PLAYWRIGHT_TEST_BASE_URL` or localhost:3000.
- **Bypass header:** `x-vercel-protection-bypass` with `VERCEL_AUTOMATION_BYPASS_SECRET` for CI preview testing.

### Implementation Details
1. **Unit tests — pattern to follow:**
   - Read existing tests in `src/lib/__tests__/` to understand the mocking pattern
   - For each lib module: create fixtures from real Notion API shapes, test the transformation functions, test error handling
   - For validation.ts: test rate limiting (mock Date.now), honeypot detection, Zod schema validation, all error responses

2. **E2E tests — critical paths:**
   - Homepage: loads, all sections visible, globe renders (or fallback), nav works
   - Forms: navigate to /apply, fill out membership form, submit, verify success state
   - Blog: listing loads, filters work, click into a post, post renders correctly
   - Navigation: all nav links resolve, footer links work, /nonexistent returns 404 page

3. **Run tests before marking done:**
   - `npm run test:ci` — all unit tests pass
   - `npx playwright test` — all E2E tests pass (requires dev server running)
