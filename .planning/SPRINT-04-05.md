# Sprint 04-05 | 04-06-2026 → 04-07-2026

**Theme:** Accessibility Overhaul + UI Polish + Foundation Planning
**Duration:** 2 days
**Source:** Full UX/UI audit (04-05-2026) — 13 pages, score 6.8/10

---

## Audit Context

Full consolidated audit: 8 Critical, 16 Major, 17 Minor/Polish.
This sprint addresses: **all 8 Critical**, **10 of 16 Major**, **6 Polish items** + Sagie's brain dump additions.

---

## Wave 1 — Parallel (Day 1: 04-06-2026)

### TRACK 1: Critical Accessibility + Visual Tokens
**Branch:** `fix/accessibility-visual-tokens`
**Priority:** Critical | **Effort:** L (6-8hr)

| # | Item | Audit ID | Effort |
|---|------|----------|--------|
| 1 | GET→POST on all 7 PII-collecting forms | C-04 | XS |
| 2 | Privacy consent checkbox on all PII forms (link to /privacy) | C-05 | S |
| 3 | `:focus-visible` outline site-wide (2px silver, offset 3px) | M-12 | XS |
| 4 | `prefers-reduced-motion` fallback — set opacity:1, transform:none | C-01 | S |
| 5 | Muted text contrast: `rgb(110,109,105)` → `rgb(163,163,160)` or above for 4.5:1 | C-02 | XS |
| 6 | Darkest text: `rgb(90,90,88)` → eliminate at text size or raise to `rgb(138,138,136)` | C-03 | XS |
| 7 | Base font size 13px → 16px minimum (type scale token) | C-07/M-11 | S |
| 8 | Overall contrast pass — less gray, more white across tokens | Sagie | S |
| 9 | Unique page `<title>` tags for all pages | C-06 | XS |
| 10 | Investor form: "Founder Name" → "Your Name" | C-08 | XS |
| 11 | Suggest-event form: add required email field | M-14 | XS |
| 12 | Filter out Palestine from `country-state-city` package output | Sagie | XS |
| 13 | Homepage pillar duplicate cards → `aria-hidden="true"` on clones | M-02 | XS |
| 14 | aria-label on identical "Work with me →" links (/solutions) | M-05 | XS |
| 15 | aria-label on "Schedule a Call →" CTAs (/ventures) | M-06 | XS |
| 16 | aria-label on "Visit →" links (/resources) | M-13 | XS |
| 17 | Blog hero newsletter form: add proper `<label for>` association | M-07 | XS |

**Files touched:**
- `src/app/globals.css` — tokens, focus outlines, reduced-motion, font size
- `src/components/forms/*.tsx` (all 7) — consent checkbox, method, field fixes
- `src/lib/schemas.ts` — consent field in Zod schemas
- `src/app/api/suggest-event/route.ts` — accept email field
- `src/app/(marketing)/*/page.tsx` — metadata per page
- `src/components/sections/Pillars.tsx` or equivalent — aria-hidden
- `src/app/(marketing)/solutions/page.tsx` — aria-labels
- `src/app/(marketing)/ventures/page.tsx` — aria-labels
- `src/app/(marketing)/resources/page.tsx` — aria-labels
- `src/app/(marketing)/blog/page.tsx` — newsletter label fix
- `src/components/ui/LocationFields.tsx` — Palestine filter
- `src/components/ui/PhoneField.tsx` — Palestine filter

---

### TRACK 2: UI Components Polish
**Branch:** `fix/ui-components`
**Priority:** High | **Effort:** M (3-5hr)

| # | Item | Source | Effort |
|---|------|--------|--------|
| 1 | Navbar logo + "Apply to Join" button — quality/consistency fix | Sagie | S |
| 2 | Footer — make smaller + remove newsletter form entirely | Sagie (resolves P-12) | S |
| 3 | Who's it for card — square icon positioning + outline consistency | Sagie | S |
| 4 | Side-panel dots — enlarge to 20px minimum, raise inactive opacity to 0.65+ | M-03 | S |

**Files touched:**
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/sections/WhoItsFor.tsx` + `src/constants/personas.ts`
- `src/components/ui/SectionNav.tsx`

---

### TRACK 3: Globe + Performance Fixes
**Branch:** `fix/globe-performance`
**Priority:** High | **Effort:** S-M (2-3hr)

| # | Item | Source | Effort |
|---|------|--------|--------|
| 1 | Globe visible on tablet and mobile | Sagie | S |
| 2 | Globe point size → 0.1, altitude → 0.010 | Sagie | XS |
| 3 | Globe type safety — replace `any` types with proper interfaces | Known concern [LOW] | S |
| 4 | CircuitBackground — resolution scaling + reduce particles on mobile | Known concern [LOW-MEDIUM] | S |

**Files touched:**
- `src/components/GlobeClient.tsx`
- `src/components/GlobeNetwork.tsx`
- `src/components/GlobeShell.tsx`
- `src/components/ui/CircuitBackground.tsx`

---

### TRACK 4: Scroll Position Fix
**Branch:** `fix/scroll-position`
**Priority:** High | **Effort:** S (1-2hr)

| # | Item | Source | Effort |
|---|------|--------|--------|
| 1 | Page load scroll reveal — preserve scroll position, stop resetting to top | Sagie | S-M |

**Files touched:**
- `src/components/ui/ScrollReveal.tsx`
- `src/hooks/useScrollReveal.ts`
- `src/components/ui/TransitionLink.tsx`
- `src/components/ui/PageHeroAnimation.tsx`

---

## Wave 2 — After Wave 1 Merges (Day 2: 04-07-2026)

### TRACK 5: Form Validation UX
**Branch:** `feature/form-validation-ux`
**Priority:** Medium | **Effort:** M (3-5hr)
**Depends on:** Track 1 merge (both touch form components)

| # | Item | Source | Effort |
|---|------|--------|--------|
| 1 | Valid field state (green border/icon) + invalid (red border/icon) | Sagie | S |
| 2 | Validation text — more visible, larger, animated transitions | Sagie | M |
| 3 | Field locking cascade: Country → State → City (disable until parent filled) | Sagie | M |

**Files touched:**
- `src/components/forms/*.tsx` (all form components)
- `src/components/ui/FormField.tsx`
- `src/components/ui/LocationFields.tsx`
- `src/app/globals.css` (validation states)

---

### TRACK 6: SVG Icons Integration
**Branch:** `feature/svg-icons`
**Priority:** Medium | **Effort:** S-M (2-3hr)
**Depends on:** Sagie adds SVG files to repo (public/icons/ or similar)

| # | Item | Source | Effort |
|---|------|--------|--------|
| 1 | Add SVG icons as static images in relevant sections | Sagie | S |
| 2 | Ensure proper sizing, color inheritance, alt text | Best practice | S |

**Files touched:**
- `public/icons/` (new)
- Section components where icons are placed (TBD based on icon set)

---

## Parallel Throughout

### TRACK 7: Test Coverage Expansion
**Branch:** `test/coverage-expansion`
**Priority:** Medium | **Effort:** L (separate agent)

| # | Item | Source | Effort |
|---|------|--------|--------|
| 1 | Unit tests for untested lib modules | Sagie + test gaps | M |
| 2 | E2E tests for critical user flows (forms, navigation, blog) | Sagie + audit test gaps | M |
| 3 | API error path tests (rate limit, validation, Notion failures) | Known concern [MEDIUM] | M |

**Files touched:**
- `src/lib/__tests__/*.test.ts` (new + existing)
- `tests/*.spec.ts` (new)

---

## Co-work Deliverables (Planning, No Code)

### A: Multi-Step Form Architecture + Auth Decision
**Deliverable:** `.planning/ARCHITECTURE-FORMS.md`

Scope:
- Current form structure audit (7 forms, what each collects)
- Multi-step form pattern recommendation (wizard vs progressive disclosure)
- Form consolidation plan for member portal launch
- Auth decision: Clerk vs Supabase Auth — pros/cons/recommendation
- Data model for unified user profile
- Migration path from current forms to portal-integrated forms

### B: Contribution Page Design Prompts
**Deliverable:** `.planning/DESIGN-CONTRIBUTION-PAGE.md`

Scope:
- Page purpose: Allow community members to contribute time, skills, expertise, connections, business
- Information architecture recommendation
- Claude.ai prompts for designing the page layout, copy, and UX flow
- Visual direction aligned with SAGIE brand (dark theme, Bebas Neue/DM Sans, circuit board aesthetic)

---

## Capacity Math

| Track | Effort | Hours (est) |
|-------|--------|-------------|
| Track 1 | L | 6-8 |
| Track 2 | M | 3-5 |
| Track 3 | S-M | 2-3 |
| Track 4 | S | 1-2 |
| Track 5 | M | 3-5 |
| Track 6 | S-M | 2-3 |
| Track 7 | L | parallel |
| **Total** | | **17-26** |

**With parallelism:**
- Day 1: Tracks 1-4 concurrent → max(6-8hr) = 8hr
- Day 2: Tracks 5-6 concurrent (after Wave 1 merges) → max(3-5hr) = 5hr
- Track 7: runs parallel throughout on separate agent
- Co-work deliverables: produced during planning session

**Effective capacity usage:** ~13hr sequential equivalent / 16hr available = **81%** ✅

---

## Deferred to Next Sprint

| Item | Reason |
|------|--------|
| Multi-step form implementation | XL effort — architecture planned this sprint, build next |
| Solutions & Ventures page rework | XL — needs design direction; Sagie flagged as "worst pages" |
| Full responsive audit | L — do after base fixes land |
| Events RSVP/registration links | Depends on Notion URL fields (Open Item #4) |
| Orbits animation | Assets ready; schedule for next sprint |
| Form consolidation for member portal | Depends on auth decision (being made this sprint) |
| Resource submission form rework | Deferred — Known concern [MEDIUM] |

## Considerations (Parked)

| Item | Notes |
|------|-------|
| Navbar dropdown for pillars | Sagie flagged as consideration |
| Brand page (logo, colors, typography) | Sagie flagged as consideration |
| Globe heatmap alternative | Needs design direction |
| Newsletter placement decision | Footer form being dropped; decide new location next sprint |

## Known Concerns — Status

| Concern | Severity | Status |
|---------|----------|--------|
| Missing Notion property handling | MEDIUM | Deferred — no incidents |
| In-memory rate limiter | LOW | Accepted at scale |
| Role field single→multi select | MEDIUM | Deferred — member portal |
| Referral source → dropdown | LOW | Deferred — member portal |
| Generic error messages | MEDIUM | **Track 5** (validation UX) |
| Resource form rework | MEDIUM | Deferred next sprint |
| Honeypot timing | LOW | Deferred |
| HTML injection in Notion content | MEDIUM | Deferred — no incidents |
| CircuitBackground high-DPI | LOW-MEDIUM | **Track 3** |
| Globe type safety | LOW | **Track 3** |
| Checkbox accessibility | MEDIUM | **Track 1** (focus outlines) |
| No analytics | LOW | Deferred |
| API error paths untested | MEDIUM | **Track 7** |
| E2E critical flows | MEDIUM | **Track 7** |

## Backlog (Deprioritized — per Sagie)

- B-2: Marquee ticker (DEV-82)
- B-5: Circuit trace SVG (DEV-85)
- B-6: Horizontal gallery
- B-7: Editorial layout
- B-8: Scene reveal (DEV-88)
