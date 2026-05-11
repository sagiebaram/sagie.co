# ADR: Membership Form — Multi-Step Wizard (v2)

**Date:** 2026-04-08
**Status:** Approved — all open questions resolved 04-08-2026
**Revision:** v2 — incorporates Sagie's feedback on step structure, matchmaking tags, and UX decisions
**Depends on:** ARCHITECTURE-FORMS.md decisions (locked)

---

## Locked Decisions (from Sagie's v1 review)

| Decision | Choice |
|----------|--------|
| Wizard pattern | Option C — hybrid with nuqs URL params |
| Tier field | Defaulted to Explorer, NOT shown in wizard |
| Review step editing | Inline edit modal (not URL navigation) |
| Step transitions | CSS fade animation (not GSAP) |
| Draft restoration | Silent restore from sessionStorage (no prompt) |
| Auth | Supabase (future sprint — not part of this ADR) |

---

## 1. Component Architecture

### Wizard Container

`MembershipWizard` owns step state, a single `react-hook-form` `<FormProvider>`, progress indicator, navigation, sessionStorage backup, and CSS fade transitions.

```
┌────────────────────────────────────────────────────────────┐
│  MembershipWizard                                          │
│  ├── ProgressBar (6-step indicator)                        │
│  ├── <FormProvider {...methods}>                           │
│  │   ├── StepAboutYou              (step 1)               │
│  │   ├── StepLocation              (step 2)               │
│  │   ├── StepProfessionalIdentity  (step 3)               │
│  │   ├── StepRoleAndNeeds          (step 4 — matchmaking) │
│  │   ├── StepTellUsMore            (step 5)               │
│  │   └── StepReview                (step 6)               │
│  ├── WizardNav (Back / Next / Submit)                      │
│  └── StepEditModal (inline editing from Review)            │
└────────────────────────────────────────────────────────────┘
```

### Key design decisions

- **Single form instance.** `useForm()` called once in `MembershipWizard`. Steps access it via `useFormContext()`. No data loss on step transitions.
- **FormField.tsx reused as-is.** Current `FormField`, `PhoneField`, `LocationFields`, `PrivacyConsent` all work unchanged.
- **Steps are plain components, not routes.** `MembershipWizard` conditionally renders the active step.
- **Dynamic sub-fields.** Steps 3 and 4 use a `DynamicSubField` pattern — selecting a checkbox reveals a child text input. Implemented via `watch()` on the parent multi-select.
- **Inline edit modal.** Review step opens a focused modal with one step's fields for quick edits without URL navigation.
- **CSS fade transitions.** Step changes use a CSS `opacity` + `transform` transition (150ms). No GSAP dependency.

### Fade transition implementation

```css
.wizard-step-enter {
  opacity: 0;
  transform: translateY(8px);
}
.wizard-step-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 150ms ease, transform 150ms ease;
}
```

On step change, the outgoing step unmounts immediately and the incoming step mounts with the `.wizard-step-enter` class, which is swapped to `.wizard-step-active` on the next frame via `requestAnimationFrame`.

---

## 2. Step Breakdown

### Step 1: About You — unchanged from v1

| Field | Component | Schema Field | Required |
|-------|-----------|-------------|----------|
| Full Name | `FormField` (text) | `fullName` | Yes |
| Email | `FormField` (email) | `email` | Yes |
| Phone | `PhoneField` | `phone` | Yes |
| LinkedIn URL | `FormField` (url) | `linkedIn` | No |

**Per-step schema:**

```ts
const StepAboutYouSchema = MembershipSchema.pick({
  fullName: true,
  email: true,
  phone: true,
  linkedIn: true,
})
```

### Step 2: Location — unchanged from v1

| Field | Component | Schema Field | Required |
|-------|-----------|-------------|----------|
| Country | `LocationFields` | `country` | Yes |
| State / Province | `LocationFields` | `state` | Conditional |
| City | `LocationFields` | `city` | Yes |

**Per-step schema:**

```ts
const StepLocationSchema = MembershipSchema.pick({
  country: true,
  state: true,
  city: true,
}).superRefine(locationSuperRefine)
```

Note: `locationSuperRefine` needs to be exported from `schemas.ts`.

### Step 3: Your Professional Identity — NEW (replaces v1 Step 3)

**Concept:** "How do you work?" — multi-select with dynamic sub-fields.

| Field | Component | Schema Field | Required |
|-------|-----------|-------------|----------|
| How do you work? | `FormField` (checkbox-group) | `workStyle` | Yes (min 1) |
| Company name | `FormField` (text) — shown when "Company" selected | `companyName` | Conditional |
| Organization name | `FormField` (text) — shown when "Organization" selected | `organizationName` | Conditional |
| What do you do? | `FormField` (text) — shown when "Freelancer" selected | `freelancerDescription` | Conditional |

**Checkbox options for `workStyle`:** Each opens its own independent sub-field.
- `Company` — reveals "Company name" text field
- `Organization` — reveals "Organization name" text field
- `Freelancer` — reveals "What do you do?" text field

If multiple are selected, all corresponding sub-fields appear.

**Dynamic sub-field logic:**

```ts
const workStyle = watch('workStyle') ?? []
const showCompanyField = workStyle.includes('Company')
const showOrganizationField = workStyle.includes('Organization')
const showFreelancerField = workStyle.includes('Freelancer')
```

**Per-step schema:**

```ts
const workStyleOptions = ['Company', 'Organization', 'Freelancer'] as const

const StepProfessionalIdentitySchema = z.object({
  workStyle: z.array(z.enum(workStyleOptions)).min(1, 'Select at least one'),
  companyName: z.string().max(200).trim().optional(),
  organizationName: z.string().max(200).trim().optional(),
  freelancerDescription: z.string().max(200).trim().optional(),
}).superRefine((data, ctx) => {
  if (data.workStyle.includes('Company') && !data.companyName?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter your company name.', path: ['companyName'] })
  }
  if (data.workStyle.includes('Organization') && !data.organizationName?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter your organization name.', path: ['organizationName'] })
  }
  if (data.workStyle.includes('Freelancer') && !data.freelancerDescription?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please describe what you do.', path: ['freelancerDescription'] })
  }
})
```

### Step 4: Your Role & What You're Looking For — NEW (matchmaking foundation)

**Concept:** Two multi-select tag groups that power future matchmaking — identity (supply) and needs (demand).

**Field 1: "I am a..." (identity tags)**

Each tag renders as: **checkbox label** with smaller helper text below.
Notion/Supabase stores only the label (no helper text).

| Label (stored value) | Helper text (UI only) | Sub-field |
|-----|-----------|-----------|
| Founder | Building a startup | — |
| Investor | Angel, VC, LP | — |
| Service Provider | Consultants, agencies, freelance services | "What do you offer?" (text) |
| Job Seeker | Looking for a role | — |
| Corporate Executive | Works at an established company | — |
| Ecosystem Builder | Community leaders, accelerator operators, gov/econ dev | — |
| Advisor / Mentor | Experienced, wants to give back | — |
| Student / Early Career | Learning, exploring | — |

Required: at least one selection.

**Field 2: "I'm looking for..." (need tags)**

Same pattern: label + helper text below.

| Label (stored value) | Helper text (UI only) |
|-----|-----------|
| Co-founder | Looking for a partner to build with |
| Funding | Seeking investment |
| Deal flow | Looking for startups to invest in |
| Talent / Hiring | Building a team |
| Clients / Customers | Looking for business |
| Mentorship | Wants guidance |
| Service providers | Needs specific help — legal, design, etc. |
| Community / Network | Connect with like-minded people |
| Partnership opportunities | Strategic alliances, distribution |
| A job | Actively seeking employment |

Required: at least one selection.

**Per-step schema:**

```ts
const identityTagOptions = [
  'Founder', 'Investor', 'Service Provider', 'Job Seeker',
  'Corporate Executive', 'Ecosystem Builder', 'Advisor / Mentor',
  'Student / Early Career',
] as const

const needTagOptions = [
  'Co-founder', 'Funding', 'Deal flow', 'Talent / Hiring',
  'Clients / Customers', 'Mentorship', 'Service providers',
  'Community / Network', 'Partnership opportunities', 'A job',
] as const

const StepRoleAndNeedsSchema = z.object({
  identityTags: z.array(z.enum(identityTagOptions)).min(1, 'Select at least one'),
  needTags: z.array(z.enum(needTagOptions)).min(1, 'Select at least one'),
  serviceProviderDetail: z.string().max(500).trim().optional(),
}).superRefine((data, ctx) => {
  if (data.identityTags.includes('Service Provider') && !data.serviceProviderDetail?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please describe what you offer.', path: ['serviceProviderDetail'] })
  }
})
```

### Step 5: Tell Us More — REWORKED

All fields are **required** (v1 had them optional). New fields added, one removed.

| Field | Component | Schema Field | Required |
|-------|-----------|-------------|----------|
| What are you building or working on? | `FormField` (textarea) | `whatTheyNeed` | Yes |
| What are you looking for in a community? | `FormField` (textarea) | `communityExpectation` | Yes |
| What does a community mean to you? | `FormField` (textarea) | `communityMeaning` | Yes |
| Why SAGIE? | `FormField` (textarea) | `howTheyKnowSagie` | Yes |
| How did you hear about us? | `FormField` (select) | `referralSource` | Yes |
| Who referred you? | `FormField` (text) — shown when "Referral" selected | `referralName` | Conditional |

**Removed from v1:** `whatTheyOffer` ("What do you bring to the community?") — replaced by matchmaking tags + new community questions.

**Referral dropdown options:**
- Google Search
- Social Media (LinkedIn, Twitter, etc.)
- Friend or Colleague
- Event
- Podcast
- Article / Blog
- Referral → reveals "Who referred you?" text field

No "Other" option — "Referral" is the catch-all.

**Per-step schema:**

```ts
const referralSourceOptions = [
  'Google Search', 'Social Media', 'Friend or Colleague',
  'Event', 'Podcast', 'Article / Blog', 'Referral',
] as const

const StepTellUsMoreSchema = z.object({
  whatTheyNeed: spamCheckedText('Tell us what you\'re working on.'),
  communityExpectation: spamCheckedText('Tell us what you\'re looking for.'),
  communityMeaning: spamCheckedText('Tell us what community means to you.'),
  howTheyKnowSagie: spamCheckedText('Tell us why SAGIE.'),
  referralSource: z.enum(referralSourceOptions, { error: 'Please select how you heard about us.' }),
  referralName: z.string().max(100).trim().optional(),
}).superRefine((data, ctx) => {
  if (data.referralSource === 'Referral' && !data.referralName?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please tell us who referred you.', path: ['referralName'] })
  }
})
```

### Step 6: Review + Submit — UPDATED

Renders a read-only summary of all entered data. Clicking a section header opens an **inline edit modal** with that step's fields.

| Field | Component | Required |
|-------|-----------|----------|
| Summary display | `ReviewSummary` | — |
| Privacy consent | `PrivacyConsent` | Yes |
| Newsletter consent | New checkbox | Yes |

**Two consent checkboxes (both required):**

1. **Privacy consent** (existing) — "I agree to the Privacy Policy" with link to /privacy
2. **Newsletter consent** (new) — "Subscribe to The SAGIE Letter — weekly insights on ecosystem building, startups, and community."

**No per-step schema** — full `MembershipSchema` validates on submit.

---

## 3. Validation UX Per Step

### Trigger behavior

| Event | Behavior |
|-------|----------|
| Field blur | Validate that field (`mode: 'onBlur'`) |
| "Next" button click | Validate all fields in current step. Block advance if invalid. |
| Re-editing after blur error | Clear error on change (`reValidateMode: 'onChange'`) |
| "Back" button click | No validation — always allowed |
| "Submit" on step 6 | Full schema validation before POST |
| Modal "Save" | Validate edited step's fields, close modal if valid |

### Step-level validation

```ts
const STEP_FIELDS: Record<StepId, (keyof FormData)[]> = {
  'about-you': ['fullName', 'email', 'phone', 'linkedIn'],
  'location': ['country', 'state', 'city'],
  'professional-identity': ['workStyle', 'companyName', 'freelancerDescription'],
  'role-and-needs': ['identityTags', 'needTags', 'serviceProviderDetail'],
  'tell-us-more': ['whatTheyNeed', 'communityExpectation', 'communityMeaning', 'howTheyKnowSagie', 'referralSource', 'referralName'],
  'review': [], // full schema on submit
}

async function handleNext() {
  const fields = STEP_FIELDS[currentStep]
  const valid = await trigger(fields)
  if (valid) goToStep(nextStep)
}
```

### Dynamic sub-field validation

Steps 3, 4, and 5 have conditional sub-fields. The `superRefine` on their schemas handles this — `trigger()` runs the full step schema including refinements. Sub-fields that are hidden (parent not selected) are ignored by the refinement.

### Blocking advancement

Users cannot advance past a step with required field errors. The "Next" button triggers validation, and if it fails, the first errored field receives focus via `shouldFocusError: true`.

---

## 4. Progress Indicator

### Design — 6 steps

```
  ①────②────③────④────⑤────⑥
About  Location  Identity  Role  More  Review
```

| State | Visual |
|-------|--------|
| Completed | Filled circle (silver background) + checkmark |
| Current | Outlined circle (silver border) + step number |
| Upcoming | Dim circle (border-default) + step number |
| Connector line (completed) | Silver |
| Connector line (upcoming) | border-default |

### Implementation

```ts
interface ProgressBarProps {
  steps: { id: StepId; label: string }[]
  currentStep: StepId
  completedSteps: Set<StepId>
  onStepClick: (step: StepId) => void
}
```

### Clickable navigation

Users can click a completed step to jump back. Upcoming steps are disabled.

### Mobile (< 640px)

With 6 steps, labels don't fit. Mobile shows:
- Circles only (no labels), connected by lines
- Current step label displayed below the indicator bar
- Step counter text: "Step 3 of 6"

---

## 5. Data Flow

### Updated form data shape

```ts
type MembershipFormData = {
  // Step 1: About You
  fullName: string
  email: string
  phone: string
  linkedIn?: string

  // Step 2: Location
  country: string
  state?: string
  city: string

  // Step 3: Professional Identity
  workStyle: ('Company' | 'Organization' | 'Freelancer')[]
  companyName?: string
  organizationName?: string
  freelancerDescription?: string

  // Step 4: Role & Needs (matchmaking)
  identityTags: IdentityTag[]
  needTags: NeedTag[]
  serviceProviderDetail?: string

  // Step 5: Tell Us More
  whatTheyNeed: string
  communityExpectation: string
  communityMeaning: string
  howTheyKnowSagie: string
  referralSource: ReferralSource
  referralName?: string

  // Step 6: Review (consent)
  privacyConsent: boolean   // managed outside react-hook-form (existing pattern)
  newsletterConsent: boolean

  // Hidden defaults
  tier: 'Explorer'
}
```

### API route changes — REQUIRED

The payload shape has changed significantly. The API route **must be updated** to:

1. Accept the new fields (`workStyle`, `identityTags`, `needTags`, `serviceProviderDetail`, `communityExpectation`, `communityMeaning`, `referralSource`, `referralName`, `newsletterConsent`)
2. Remove handling of deleted fields (`role`, `category`, `company`, `whatTheyOffer`, `referral`)
3. Write new Notion properties (see section 9)

### Updated Notion property mapping

**Note:** The entire Notion Members DB will be rebuilt from scratch when Supabase is integrated. For now, create these as new properties on the existing DB. No need to preserve or rename old properties — they'll all be replaced.

```ts
// Properties for the wizard:
'Work Style':              { multi_select: workStyle.map(w => ({ name: w })) }
'Identity Tags':           { multi_select: identityTags.map(t => ({ name: t })) }
'Need Tags':               { multi_select: needTags.map(t => ({ name: t })) }
'Service Provider Detail': { rich_text: serviceProviderDetail }
'Company Name':            { rich_text: companyName }
'Organization Name':       { rich_text: organizationName }
'Freelancer Description':  { rich_text: freelancerDescription }
'Community Expectation':   { rich_text: communityExpectation }
'Community Meaning':       { rich_text: communityMeaning }
'Referral Source':         { select: referralSource }
'Referral Name':           { rich_text: referralName }
'Newsletter Consent':      { checkbox: newsletterConsent }

// Old properties — leave in place for historical data, don't remove:
// 'Role', 'Category', 'Company' — superseded by new fields above
```

### Error handling on submission failure

Same as v1:
1. Show error message on Step 6
2. If server returns `fieldErrors`, map to relevant step and offer "Fix errors" button
3. Rate limiting (429) shows warning on Step 6

---

## 6. URL State with nuqs

### Parser setup — 6 steps

```ts
import { useQueryState, parseAsStringLiteral } from 'nuqs'

const STEPS = [
  'about-you',
  'location',
  'professional-identity',
  'role-and-needs',
  'tell-us-more',
  'review',
] as const

type StepId = typeof STEPS[number]

const [step, setStep] = useQueryState(
  'step',
  parseAsStringLiteral(STEPS)
    .withDefault('about-you')
    .withOptions({ history: 'push', shallow: true })
)
```

**URLs:**
```
/apply?step=about-you
/apply?step=location
/apply?step=professional-identity
/apply?step=role-and-needs
/apply?step=tell-us-more
/apply?step=review
```

### URL manipulation protection

Same as v1 — `parseAsStringLiteral` rejects invalid values (falls back to `about-you`). Manual URL edits to `?step=review` render the Review step but full Zod validation blocks submission with empty required fields.

### Browser back/forward

`history: 'push'` means Back button = previous step. Works across all 6 steps.

---

## 7. Accessibility

### Keyboard navigation

| Key | Behavior |
|-----|----------|
| Tab | Move between fields within a step |
| Enter | On "Next" button → advance step |
| Escape | Close edit modal (when open) |

### Screen reader announcements

```tsx
<div aria-live="polite" className="sr-only">
  {`Step ${stepIndex + 1} of 6: ${stepLabel}`}
</div>
```

### Focus management

On step transition, focus moves to the first input of the new step:

```ts
useEffect(() => {
  requestAnimationFrame(() => {
    const firstInput = formRef.current?.querySelector<HTMLElement>(
      'input:not([type="hidden"]), select, textarea, [role="combobox"], [role="checkbox"]'
    )
    firstInput?.focus()
  })
}, [step])
```

Note: `requestAnimationFrame` ensures focus happens after the fade transition starts.

### Dynamic sub-field announcements

When a checkbox selection reveals a sub-field, wrap the sub-field in a container with `aria-live="polite"` so screen readers announce its appearance:

```tsx
{showCompanyField && (
  <div aria-live="polite">
    <FormField label="Company/Organization name" name="companyName" ... />
  </div>
)}
```

### Edit modal accessibility

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label={`Edit ${stepLabel}`}
>
```

- **Focus trap:** On open, focus moves to the first field inside the modal. Tab cycles within modal only.
- **Escape to close:** `onKeyDown` handler closes modal on Escape.
- **Return focus:** On close, focus returns to the "Edit" button that opened the modal.
- **Backdrop:** Clicking outside the modal closes it (same as Escape).

### Progress indicator ARIA

```tsx
<nav aria-label="Application progress">
  <ol>
    {steps.map((s, i) => (
      <li key={s.id} aria-current={s.id === currentStep ? 'step' : undefined}>
        ...
      </li>
    ))}
  </ol>
</nav>
```

### Step containers

Each step wrapped in `<fieldset>` with `<legend>` for screen reader grouping context.

---

## 8. sessionStorage Backup

Same strategy as v1, extended to cover all new fields.

### Save (debounced)

```ts
useEffect(() => {
  const subscription = watch((values) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      sessionStorage.setItem('membership-draft', JSON.stringify({
        ...values,
        _savedAt: Date.now(),
      }))
    }, 500)
  })
  return () => subscription.unsubscribe()
}, [watch])
```

### Restore (silent — no prompt)

```ts
useEffect(() => {
  const raw = sessionStorage.getItem('membership-draft')
  if (!raw) return
  try {
    const saved = JSON.parse(raw)
    if (saved._savedAt && Date.now() - saved._savedAt > 86_400_000) {
      sessionStorage.removeItem('membership-draft')
      return
    }
    const { _savedAt, ...formData } = saved
    reset(formData, { keepDefaultValues: false })
  } catch { /* ignore corrupt data */ }
}, [reset])
```

### Cleanup

Clear after successful submission:

```ts
sessionStorage.removeItem('membership-draft')
```

---

## 9. Matchmaking Data Model

### Concept: Supply and Demand

The matchmaking system is built on two dimensions:

- **Supply (identity tags):** "I am a..." — what someone brings to the ecosystem
- **Demand (need tags):** "I'm looking for..." — what someone needs from the ecosystem

Future portal matching logic:
- A **Founder** looking for **Funding** matches with an **Investor** looking for **Deal flow**
- A **Job Seeker** matches with someone looking for **Talent / Hiring**
- A **Service Provider** who offers "Legal consulting" matches with someone looking for **Service providers**

### Notion DB design

New properties on the Members database (`NOTION_MEMBER_DB_ID`):

| Property Name | Type | Values |
|--------------|------|--------|
| Identity Tags | Multi-select | Founder, Investor, Service Provider, Job Seeker, Corporate Executive, Ecosystem Builder, Advisor / Mentor, Student / Early Career |
| Need Tags | Multi-select | Co-founder, Funding, Deal flow, Talent / Hiring, Clients / Customers, Mentorship, Service providers, Community / Network, Partnership opportunities, A job |
| Service Provider Detail | Rich text | Free text |
| Work Style | Multi-select | Company, Organization, Freelancer |
| Company Name | Rich text | Free text |
| Freelancer Description | Rich text | Free text |
| Community Expectation | Rich text | Free text |
| Community Meaning | Rich text | Free text |
| Referral Source | Select | Google Search, Social Media, Friend or Colleague, Event, Podcast, Article / Blog, Referral |
| Referral Name | Rich text | Free text |
| Newsletter Consent | Checkbox | true/false |

### Future Supabase schema (portal — not built now)

When the portal launches, these tags will live in Supabase as arrays on the user profile:

```sql
-- Future reference only — not built in this sprint
CREATE TABLE member_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  identity_tags TEXT[] NOT NULL DEFAULT '{}',
  need_tags TEXT[] NOT NULL DEFAULT '{}',
  service_provider_detail TEXT,
  work_style TEXT[] NOT NULL DEFAULT '{}',
  -- ...other profile fields
);

-- Matchmaking index
CREATE INDEX idx_identity_tags ON member_profiles USING GIN (identity_tags);
CREATE INDEX idx_need_tags ON member_profiles USING GIN (need_tags);
```

The string literal tag values are kept consistent between the Zod schema, Notion multi-selects, and future Supabase columns. This is intentional — they are the contract.

### Tag versioning

The tag lists are v1. They will evolve. To handle this:
- Tags are defined as `as const` arrays in `schemas.ts` — single source of truth
- Notion and Supabase accept any multi-select value, so adding new tags is non-breaking
- Removing a tag requires a migration (update existing records) — flag for future consideration

---

## 10. Migration Path

### What changes in existing code

| File | Change |
|------|--------|
| `src/components/forms/MembershipForm.tsx` | **Delete.** Replaced by `MembershipWizard.tsx`. |
| `src/lib/schemas.ts` | Major update: export `locationSuperRefine`, replace `MembershipSchema` with new fields, add tag/step constants. Remove old `role`, `category`, `company`, `whatTheyOffer`, `referral` fields. |
| `src/app/(marketing)/apply/page.tsx` | Import `MembershipWizard` instead of `MembershipForm`. Add `NuqsAdapter` if not already in layout. |
| `src/app/api/applications/membership/route.ts` | Update Notion property mapping for new fields. Remove `ROLE_MAP`. Add new properties. |
| E2E tests (`tests/apply.spec.ts` or similar) | Rewrite to navigate 6 steps, fill new fields. |

### New files (10)

| File | Description |
|------|-------------|
| `src/components/forms/MembershipWizard.tsx` | Wizard container: 6-step state via nuqs, FormProvider, sessionStorage, fade transitions, submission handler |
| `src/components/forms/steps/StepAboutYou.tsx` | Step 1: fullName, email, phone, linkedIn |
| `src/components/forms/steps/StepLocation.tsx` | Step 2: LocationFields (country/state/city cascade) |
| `src/components/forms/steps/StepProfessionalIdentity.tsx` | Step 3: workStyle checkboxes with dynamic sub-fields |
| `src/components/forms/steps/StepRoleAndNeeds.tsx` | Step 4: identityTags + needTags multi-selects with service provider sub-field |
| `src/components/forms/steps/StepTellUsMore.tsx` | Step 5: 4 required textareas + referral dropdown with conditional name field |
| `src/components/forms/steps/StepReview.tsx` | Step 6: read-only summary + 2 consent checkboxes + edit buttons |
| `src/components/ui/ProgressBar.tsx` | 6-step horizontal indicator with circles + connectors |
| `src/components/ui/WizardNav.tsx` | Back / Next / Submit navigation bar |
| `src/components/ui/StepEditModal.tsx` | Inline edit modal for Review step — focus trap, escape to close |

### Unchanged (verified)

| File | Why unchanged |
|------|---------------|
| `src/components/ui/FormField.tsx` | Reused as-is inside step components |
| `src/components/ui/LocationFields.tsx` | Reused as-is in StepLocation |
| `src/components/ui/PhoneField.tsx` | Reused as-is in StepAboutYou |
| `src/components/ui/PrivacyConsent.tsx` | Reused as-is in StepReview |

### Reusability

`ProgressBar`, `WizardNav`, and `StepEditModal` are generic. Other forms can reuse them if they get wizard treatment later. `MembershipWizard` itself is specific to the membership flow — extract shared logic only if a second wizard is built.

### Notion DB preparation

Before the build sprint, these properties must be created in the Members Notion database:
- Identity Tags (multi-select)
- Need Tags (multi-select)
- Service Provider Detail (rich text)
- Work Style (multi-select)
- Company Name (rich text)
- Organization Name (rich text)
- Freelancer Description (rich text)
- Community Expectation (rich text)
- Community Meaning (rich text)
- Referral Source (select)
- Referral Name (rich text)
- Newsletter Consent (checkbox)

---

## 11. Open Questions — RESOLVED

All questions from v2 have been resolved by Sagie (04-08-2026):

1. ~~Company/Organization shared field~~ → **Resolved: separate fields.** Company opens "Company name", Organization opens "Organization name", Freelancer opens "What do you do?" — each independent.
2. ~~Newsletter consent wording~~ → **Resolved: confirmed.** "Subscribe to The SAGIE Letter — weekly insights on ecosystem building, startups, and community."
3. ~~Existing Notion "Company" property~~ → **Resolved: full DB rebuild.** Entire Notion Members DB will be recreated when Supabase integrates. No migration needed — just add new properties alongside old ones for now.
4. ~~Tag label format~~ → **Resolved: helper text below.** Checkbox label is just "Founder". Helper text "(Building a startup)" appears as smaller text below the checkbox. Notion/Supabase stores label only.
5. ~~spamCheckedText minimum~~ → **Resolved: 10 chars confirmed.** Default minimum applies to all Step 5 textareas.

**No remaining open questions. ADR is approved for sprint planning.**

---

## Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Pattern | Hybrid wizard (nuqs URL params) | Established pattern in codebase |
| Steps | 6 (was 5) | New matchmaking step + reworked professional identity |
| Form library | Single react-hook-form instance | No data loss between steps |
| Step validation | Validate on "Next" click, block if invalid | Prevents reaching Review with bad data |
| Dynamic sub-fields | watch() + conditional render | Simple, no new abstractions needed |
| Edit from Review | Inline modal with focus trap | Doesn't disrupt URL state or progress |
| Transitions | CSS fade (150ms opacity + translateY) | Lightweight, no GSAP dependency |
| URL history | `history: 'push'` | Back button = previous step |
| Storage backup | sessionStorage, silent restore, 24hr expiry | Survives refresh without prompt |
| API changes | Required — new fields, new Notion properties | Payload shape has changed |
| Matchmaking | String literal arrays (identityTags, needTags) | Future-proof for Supabase GIN indexes |
| New components | 10 new files | Clean separation, reusable primitives |
