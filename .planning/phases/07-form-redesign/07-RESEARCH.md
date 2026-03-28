# Phase 7: Form Redesign - Research

**Researched:** 2026-03-28
**Domain:** react-hook-form + Zod, inline validation, structured inputs, Notion field audit
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Field audit:**
- All forms must match their Zod schemas exactly — every schema field gets a form input
- VenturesForm: add missing fields (founderName, linkedIn, pitchDeckUrl, sector, raiseAmount, oneLineDescription), rename mismatched fields (building → oneLineDescription, fullName → founderName)
- MembershipForm: add company (optional text), whatTheyOffer (optional textarea), category (checkbox group with all 7 enum values)
- ChapterForm: add communitySize (optional text)
- SolutionsForm, SubmitPostForm, SuggestEventForm, SubmitResourceForm: align all fields to match their respective schemas
- Notion property mismatches flagged for manual review — document gaps, don't auto-create Notion properties

**Validation behavior:**
- react-hook-form with @hookform/resolvers/zod for all 7 forms
- Validation mode: `onBlur` with `reValidateMode: onChange` — errors appear on blur, clear as soon as input becomes valid while typing
- No success indicators on valid fields — neutral state only (no error = good)
- On submit with invalid fields: show all errors simultaneously + auto-scroll/focus to first invalid field
- Custom human-friendly error messages matching the site's conversational tone (not Zod defaults)
- Preserve existing honeypot + timing bot protection
- Preserve Phase 5 rate limit handling (amber warning, Retry-After parsing, disabled button)

**Fixed-choice controls:**
- MembershipForm category: checkbox group (all 7 options visible at once)
- VenturesForm sector (8 options): dropdown select
- VenturesForm stage (5 options): dropdown select
- SolutionsForm category (6 options): dropdown select
- MembershipForm role: dropdown select — update Zod schema to enum matching dropdown options (Founder, Investor, Operator, Ecosystem Builder, Academic, Partner)
- SubmitPostForm category: dropdown with predefined blog categories (no free-text)

**Form visual polish:**
- Longer forms (Membership, Ventures) grouped into visual sections with subtle uppercase section headers (matching existing label style)
- Shorter forms (SuggestEvent, SubmitPost, SubmitResource) can stay flat — Claude's discretion
- Submit button: keep current style (silver, uppercase, display font, left-aligned)
- Checkbox group: custom-styled to match dark theme — custom checkbox with site border/color tokens
- Required field markers: keep current silver asterisk after label

### Claude's Discretion
- Section grouping names and which fields go in each section
- Whether shorter forms need section headers
- Custom error message copy (tone should be conversational, not technical)
- FormField component extensions needed for checkbox group type
- Blog category list for SubmitPostForm dropdown (derive from existing blog data)

### Deferred Ideas (OUT OF SCOPE)
- Multi-step form wizard for membership/ventures applications — tracked as FORM-04 in future requirements
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FORM-01 | All form fields validated inline on blur with per-field error messages via react-hook-form | react-hook-form `mode: 'onBlur'` + `reValidateMode: 'onChange'` with zodResolver delivers this. Error state displayed in FormField's `error` prop. |
| FORM-02 | Fixed-choice fields use dropdown selects and checkbox groups instead of free-text inputs | FormField needs `checkbox-group` type added. All 5 fixed-choice fields mapped to either `select` or `checkbox-group` type. |
| FORM-03 | All form submissions verified to land every field in Notion (schema/field audit) | Per-form audit matrix documents every schema field → form input → Notion property. Gaps flagged for manual review per locked decision. |
</phase_requirements>

---

## Summary

All 7 forms currently use hand-rolled `useState` + manual `validate()` + submit-only error display. This phase replaces that pattern with react-hook-form v7 + zodResolver, wiring the existing Zod schemas directly to form validation. The migration is mechanical but must be done carefully for each form because the rate limit, honeypot, and timing bot protection logic must survive intact.

The field audit reveals real gaps: VenturesForm tracks `building` and `fullName` locally but the API route and schema use `oneLineDescription` and `founderName` — these fields are currently lost on submission. SuggestEventForm captures `eventType` and `proposedDate` which have no corresponding EventSuggestionSchema fields or Notion write. SubmitResourceForm is structurally different (inline two-input layout, no FormField component) and needs its own migration path.

The FormField component needs one new input type (`checkbox-group`) for MembershipForm's 7-option category selector. The existing `select` type already handles dropdowns. The migration strategy should be to update FormField to accept react-hook-form's `register`/`control` props rather than the current `value`/`onChange` pair, or use a wrapper that bridges the two interfaces.

**Primary recommendation:** Install react-hook-form and @hookform/resolvers, update FormField to accept `register` return spread, migrate forms one at a time in dependency order (SubmitResourceForm first as simplest, VenturesForm last as most complex), and document all Notion property gaps in a reference table.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | ^7.72.0 | Form state, validation lifecycle, error management | Industry standard for React forms; minimal re-renders; native TypeScript; zodResolver makes it the obvious choice alongside existing Zod schemas |
| @hookform/resolvers | ^5.2.2 | Bridge between react-hook-form and Zod | Official resolver package; zodResolver converts Zod parse errors to react-hook-form field errors automatically |
| zod | ^4.3.6 (already installed) | Schema validation | Already in use across all API routes and schemas.ts; no new installation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React 19 `useRef` | (built-in) | Honeypot ref, loadTime ref | Preserve existing bot protection — these refs survive react-hook-form migration unchanged |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-hook-form | Formik | react-hook-form has less boilerplate, better TypeScript, uncontrolled inputs (better perf); Formik is older and heavier |
| zodResolver | Manual schema.safeParse in resolver | zodResolver is the standard approach, handles array field paths correctly |

**Installation:**
```bash
npm install react-hook-form @hookform/resolvers --legacy-peer-deps
```

Note: `--legacy-peer-deps` is required due to the existing `@eslint/js@10` vs `eslint@9` peer conflict documented in Phase 5.

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. Changes are confined to:
```
src/
├── components/
│   ├── forms/               # All 7 form components updated in-place
│   │   ├── MembershipForm.tsx
│   │   ├── VenturesForm.tsx
│   │   ├── ChapterForm.tsx
│   │   ├── SolutionsForm.tsx
│   │   ├── SubmitPostForm.tsx
│   │   └── SuggestEventForm.tsx
│   └── ui/
│       ├── FormField.tsx    # Add checkbox-group type + register spread support
│       └── SubmitResourceForm.tsx  # Migrated separately (different layout)
├── lib/
│   └── schemas.ts           # MembershipSchema role field: string → enum
└── __tests__/
    └── schemas.test.ts      # Existing schema tests; may need updates for role enum
```

### Pattern 1: react-hook-form with zodResolver (standard migration)

**What:** Replace all `useState` fields, manual `validate()`, and `setErrors` with a single `useForm` call. Preserve the fetch/submit logic and rate-limit state.

**When to use:** All forms except SubmitResourceForm (which has a different layout and needs Pattern 2).

```typescript
// Standard migration pattern for each form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MembershipSchema } from '@/lib/schemas'

type FormData = z.infer<typeof MembershipSchema>

export function MembershipForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(MembershipSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  // Honeypot and timing refs survive unchanged
  const trapRef = useRef('')
  const loadTime = useRef(Date.now())

  // Rate limit state survives unchanged
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null)

  const onSubmit = async (data: FormData) => {
    // Rate limit check first (before actual submit)
    if (rateLimitUntil !== null && Date.now() < rateLimitUntil) return

    try {
      const res = await fetch('/api/applications/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _trap: trapRef.current, _t: loadTime.current }),
      })
      if (res.status === 429) {
        // existing rate limit handling
      }
      // ...
    } catch { /* ... */ }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Full Name"
        name="fullName"
        required
        registration={register('fullName')}
        error={errors.fullName?.message}
      />
      {/* ... */}
    </form>
  )
}
```

### Pattern 2: FormField updated to accept `registration` prop

**What:** FormField currently takes `value` + `onChange`. react-hook-form's `register()` returns `{ name, ref, onChange, onBlur }`. The cleanest migration spreads this as a `registration` prop, keeping the component backward-compatible while supporting RHF.

```typescript
// Updated FormField prop interface
interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox-group'
  placeholder?: string
  required?: boolean
  options?: string[]
  error?: string
  // New: spread from register() instead of value/onChange
  registration?: ReturnType<UseFormRegister<Record<string, unknown>>>
}

// Usage in form:
<FormField
  label="Full Name"
  name="fullName"
  required
  registration={register('fullName')}
  error={errors.fullName?.message}
/>

// In FormField, spread onto the native input:
<input
  id={name}
  type={type}
  {...registration}
  style={inputStyle}
/>
```

### Pattern 3: Checkbox group for MembershipForm category

**What:** `category` is `z.array(z.enum([...]))` — an array of selected values. react-hook-form handles checkbox arrays via `register` with the same name on multiple checkboxes; it collects checked values into an array.

```typescript
// In FormField with type="checkbox-group":
// Each checkbox uses {...register('category')} with its own value
const CATEGORY_OPTIONS = [
  'Founder', 'Investor', 'Tech Pro', 'Ecosystem Builder',
  'Sponsor', 'Partner', 'Advisor'
]

{type === 'checkbox-group' && options?.map(opt => (
  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
    <input
      type="checkbox"
      value={opt}
      {...registration}
      style={{
        appearance: 'none',
        width: '14px',
        height: '14px',
        border: '0.5px solid var(--border-default)',
        background: 'var(--bg-card)',
        cursor: 'pointer',
      }}
    />
    <span style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
      {opt}
    </span>
  </label>
))}
```

Note: For checkbox groups, `register` spread applies to each individual checkbox input. The `name` attribute is the same for all; react-hook-form collects values into an array when multiple are checked.

### Pattern 4: Auto-scroll to first error on submit

**What:** When submit fires with invalid fields, react-hook-form's `handleSubmit` does NOT submit. The error object is populated. We need to scroll to the first invalid field.

```typescript
// react-hook-form has built-in shouldFocusError option
const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur',
  reValidateMode: 'onChange',
  shouldFocusError: true, // auto-focuses first invalid field on submit
})
// shouldFocusError: true handles focus automatically — no manual scroll needed
```

### Pattern 5: Submit-level error display (rate limit + generic)

**What:** The submit warning and generic error are not field-level — they live outside react-hook-form's error state. Keep them as `useState` exactly as before.

```typescript
// submitWarning and rateLimitUntil stay as useState — they are not form field errors
// setError('root.serverError', ...) could be used for generic errors but
// the existing pattern of errors.submit with useState is simpler and already tested
```

### Anti-Patterns to Avoid

- **Replacing the fetch/submit logic with react-hook-form submit actions:** react-hook-form's `handleSubmit` is a validation gate only — the actual `fetch` call stays as-is.
- **Removing `_trap` and `_t` from the JSON body:** These are honeypot and timing fields consumed by `withValidation`. They must be added to the fetch body manually (they are not in the Zod schema).
- **Switching `<button onClick={...}>` to `<button type="submit">`:** When using `handleSubmit`, the form needs `<form onSubmit={handleSubmit(onSubmit)}>` and the button should be `type="submit"`. This is a structural change but it's the correct approach.
- **Using `Controller` for simple text inputs:** `register()` is sufficient for all text/email/url/textarea/select inputs. `Controller` is only needed for custom controlled components with no native `ref` support — not needed here.
- **Calling `setError` for Zod validation errors:** zodResolver handles this automatically. `setError` is only needed for server-side errors (e.g., 422 responses from the API).

---

## Field Audit Matrix

This is the critical FORM-03 deliverable. Per the locked decision, gaps are flagged for manual review — not auto-fixed.

### VenturesForm Gap Analysis

| Schema Field | Current Form State Key | API Body Key Sent | Notion Property Written | Gap? |
|---|---|---|---|---|
| companyName | companyName | companyName | `Name` (title) | OK |
| founderName | `fullName` (MISMATCH) | `fullName` (wrong key) | `Contact Name` reads `body.founderName` | **DROPPED** — form sends `fullName`, route expects `founderName` |
| email | email | email | `Email` | OK |
| website | website | website | `Website` | OK |
| linkedIn | (MISSING) | (not sent) | `LinkedIn URL` | **MISSING** — field exists in schema, not in form |
| pitchDeckUrl | (MISSING) | (not sent) | `Pitch Deck URL` | **MISSING** |
| sector | (MISSING) | (not sent) | `Sector` | **MISSING** |
| stage | stage (wrong options) | stage | `Stage` | **MISMATCH** — form uses `['Idea', 'Pre-seed', ...]`, schema uses `['Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Revenue-Stage']` |
| raiseAmount | (MISSING) | (not sent) | `Raise Amount` | **MISSING** |
| oneLineDescription | `building` (MISMATCH) | `building` (wrong key) | `One-Line Description` reads `body.oneLineDescription` | **DROPPED** |
| whySAGIE | `whySagie` (case mismatch) | `whySagie` | Route uses `body.whySAGIE` | **DROPPED** — API route key is `whySAGIE`, form sends `whySagie` |

### MembershipForm Gap Analysis

| Schema Field | In Form? | Sent to API? | Notion Written? | Gap? |
|---|---|---|---|---|
| fullName | Yes | Yes | `Full Name` | OK |
| email | Yes | Yes | `Email` | OK |
| role | Yes (select, string) | Yes | `Role` rich_text | SCHEMA CHANGE NEEDED: role should be enum |
| company | No | No | `Company` written if present | **MISSING from form** |
| location | Yes | Yes | `Location` (mapped) | OK |
| tier | No (default 'Explorer') | No (default applied by schema) | `Tier` | OK — intentional default |
| linkedIn | Yes | Yes | `LinkedIn URL` | OK |
| whatTheyNeed | Yes | Yes | `What They Need` | OK |
| whatTheyOffer | No | No | `What They Offer` written if present | **MISSING from form** |
| howTheyKnowSagie | Yes | Yes | `How They Know Sagie` | OK |
| referral | Yes | Yes | `Referral` | OK |
| category | No (group) | No | `Category` multi_select written | **MISSING from form** (complex — needs checkbox group) |

### ChapterForm Gap Analysis

| Schema Field | In Form? | Gap? |
|---|---|---|
| fullName, email, city, whyLead, background, chapterVision, linkedIn | Yes | OK |
| communitySize | No | **MISSING from form** — API route writes `Existing Community Size` if present |

### SolutionsForm Gap Analysis

| Schema Field | Current Field Name | Gap? |
|---|---|---|
| providerName | `fullName` (MISMATCH) | **DROPPED** — form sends `fullName`, API reads `body.providerName` |
| email | email | OK |
| category | category (select, correct options) | OK |
| bio | bio | OK |
| servicesOffered | servicesOffered | OK |
| linkedIn | (MISSING) | **MISSING** |
| portfolioUrl | `website` (MISMATCH) | API reads `body.portfolioUrl`, form sends `website` |
| rateRange | (MISSING) | **MISSING** |
| location | (MISSING) | **MISSING** |
| memberStatus | In form but NOT in schema | **ORPHAN** — not in schema, not written to Notion |

### SubmitPostForm Gap Analysis

| Schema Field | In Form? | Gap? |
|---|---|---|
| postTitle | Yes | OK |
| category | Yes (select, matches schema z.string) | OK — but should be dropdown with predefined options per locked decision |
| yourName | Yes | OK |
| yourEmail | Yes | OK |
| content | Yes | OK |
| url | Yes | OK (optional) |

Note: API route only writes `Title`, `Category`, `Author`, `Excerpt`, `Status`, `Author Type` to Notion. `yourEmail` and `url` are not written to Notion — this is a gap to flag for manual review.

### SuggestEventForm Gap Analysis

| Schema Field | In Form? | Form-Only Fields | Gap? |
|---|---|---|---|
| eventName | Yes | — | OK |
| suggestedBy | No — form uses `yourName` instead | — | **MISMATCH** — form sends `yourName`, schema field is `suggestedBy` |
| description | Yes | — | OK |
| — | — | `eventType`, `proposedDate`, `yourEmail` | **ORPHANS** — not in EventSuggestionSchema, not written to Notion |

### SubmitResourceForm Gap Analysis

| Field | In Form? | Schema Field | Gap? |
|---|---|---|---|
| name | Yes | `name` | OK |
| url | Yes | `url` | OK |

Note: ResourceSchema is defined inline in route.ts, not in schemas.ts — this form is the simplest. The structural difference (horizontal inline layout, no FormField component) means it needs a targeted migration.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Blur-triggered validation | Custom onBlur handlers with useState | react-hook-form `mode: 'onBlur'` | RHF handles the event wiring, error object updates, and re-render optimization automatically |
| Field-level error association | Manual `errors[fieldName]` display | `errors.fieldName?.message` from RHF `formState` | RHF error paths match field names exactly; array field paths work correctly |
| Schema → form type inference | Manual TypeScript interfaces | `z.infer<typeof MySchema>` | Ensures form data type stays in sync with schema automatically |
| Auto-focus first invalid on submit | Manual `querySelector` + `focus()` | `shouldFocusError: true` in `useForm` config | Built into react-hook-form |
| Checkbox array collection | Manual array push/splice in useState | `register('category')` on multiple checkboxes with same name | RHF collects checked values into an array automatically |

**Key insight:** The existing manual `validate()` functions in each form duplicate what zodResolver does. Removing them eliminates ~15–20 lines per form and centralizes validation in the schema.

---

## Common Pitfalls

### Pitfall 1: Sending `_trap` and `_t` without schema fields
**What goes wrong:** After migration, `handleSubmit(onSubmit)` receives only validated schema data. `_trap` (honeypot) and `_t` (loadTime) are NOT in any Zod schema — they'll be stripped by zodResolver's `safeParse` step.
**Why it happens:** zodResolver strips unknown keys by default (Zod `parse` behavior).
**How to avoid:** Add honeypot/timing values manually to the fetch body: `JSON.stringify({ ...data, _trap: trapRef.current, _t: loadTime.current })`. This is already the pattern in existing forms.
**Warning signs:** Bot protection stops working silently — submissions from bots start reaching Notion.

### Pitfall 2: Field name mismatches between form and schema
**What goes wrong:** VenturesForm currently sends `fullName` but the API route reads `body.founderName`. After migration with RHF+zodResolver, the field will be named `founderName` in the form (matching the schema), and the data will reach Notion. BUT — if the form input still uses `name="fullName"`, the Playwright E2E test at `[name="fullName"]` will break.
**Why it happens:** E2E tests use `name` attribute selectors based on current (pre-migration) field names.
**How to avoid:** Update form `name` attributes to match schema keys; update Playwright specs accordingly.
**Warning signs:** E2E tests fail after migration with "element not found" errors.

### Pitfall 3: MembershipForm role field: string vs enum
**What goes wrong:** Current schema has `role: z.string().min(1)`, but locked decision requires updating to `z.enum(['Founder', 'Investor', 'Operator', 'Ecosystem Builder', 'Academic', 'Partner'])`. The existing schema test validates that `role` is a required field. After updating to enum, any test using `role: 'SomeInvalidValue'` will fail.
**Why it happens:** Tightening a string to enum is a breaking change for existing test fixtures.
**How to avoid:** Update `schemas.test.ts` to use a valid enum value. The existing ROLE_MAP in the membership route maps some role values (e.g., `Operator` → `Tech Pro` for Notion). After the schema change, `Operator` will be valid in the form but the ROLE_MAP must stay intact.
**Warning signs:** `schemas.test.ts` fails with "Invalid enum value" on the role field test.

### Pitfall 4: SuggestEventForm has orphan fields not in schema
**What goes wrong:** Current form has `eventType`, `proposedDate`, `yourEmail` — none are in `EventSuggestionSchema`. After migration, zodResolver will strip them. These were being sent to the API but not written to Notion anyway (route only uses `eventName`, `description`, `suggestedBy`).
**Why it happens:** Form was built with fields that don't match the schema.
**How to avoid:** Remove orphan fields from form. Add `suggestedBy` to match schema (currently uses `yourName`). Document the removal in the gap audit.
**Warning signs:** If a future requirement needs the removed fields, they'll need a schema update.

### Pitfall 5: SubmitResourceForm is structurally different
**What goes wrong:** SubmitResourceForm doesn't use `FormField` — it's a horizontal inline layout with plain `<input>` elements. Attempting to use the same migration pattern as other forms will break the layout.
**Why it happens:** This form was built differently (sidebar widget style, not full-page form).
**How to avoid:** Migrate SubmitResourceForm separately, applying `register()` directly to the native inputs without going through FormField. Keep the existing layout structure.
**Warning signs:** Layout breaks, inline inputs stack vertically instead of horizontally.

### Pitfall 6: `<button onClick>` vs `<form onSubmit>`
**What goes wrong:** Current forms use `<button onClick={handleSubmit}>` (no `<form>` element wrapping). react-hook-form's `handleSubmit` is designed to be used as `<form onSubmit={handleSubmit(onSubmit)}>` with `<button type="submit">`. Without the `<form>` wrapper, Enter-key submission won't work.
**Why it happens:** Original forms were built without `<form>` elements.
**How to avoid:** Wrap each form's fields in `<form onSubmit={handleSubmit(onSubmit)}>`. Change button to `type="submit"`. This also makes the forms accessible by default.
**Warning signs:** Enter key does nothing in form fields; button click triggers but validation doesn't fire.

### Pitfall 7: Zod v4 API differences from v3
**What goes wrong:** The project uses `zod@^4.3.6`. Some tutorials and react-hook-form examples use Zod v3 API. `@hookform/resolvers@^5.x` supports Zod v4.
**Why it happens:** Zod v4 was released in 2025 with breaking changes from v3. The resolver package version matters.
**How to avoid:** Use `@hookform/resolvers@^5.2.2` (from STATE.md planned versions) which officially supports Zod v4. Don't mix v3 examples with v4 schemas.
**Warning signs:** TypeScript errors on `z.infer`, `zodResolver` type mismatch, or validation not working at runtime.

---

## Code Examples

### react-hook-form with zodResolver (verified pattern)

```typescript
// Standard RHF setup for this project
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

// Form type derived directly from schema — stays in sync automatically
type FormData = z.infer<typeof MembershipSchema>

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(MembershipSchema),
  mode: 'onBlur',          // validate on field blur
  reValidateMode: 'onChange', // clear error as soon as field becomes valid
  shouldFocusError: true,  // auto-focus first invalid field on failed submit
})
```

### Passing `register` to FormField

```typescript
// FormField receives the spread from register()
// register('fullName') returns: { name, ref, onChange, onBlur }
<FormField
  label="Full Name"
  name="fullName"
  required
  registration={register('fullName')}
  error={errors.fullName?.message}
/>

// Inside FormField, spread onto native element:
<input
  id={name}
  type={type}
  placeholder={placeholder}
  {...registration}
  style={inputStyle}
/>
```

### Checkbox group registration (category field)

```typescript
// Each checkbox in the group uses the same name via register spread
// RHF collects all checked values into an array for the 'category' field
{options?.map(opt => (
  <label key={opt}>
    <input
      type="checkbox"
      value={opt}
      {...register('category')}
    />
    <span>{opt}</span>
  </label>
))}
// errors.category?.message works for the whole group
// errors.category?.[index]?.message for per-item (not needed here)
```

### Preserving bot protection with RHF

```typescript
// Honeypot and timing are NOT in the schema — add manually to fetch body
const onSubmit = async (data: FormData) => {
  if (rateLimitUntil !== null && Date.now() < rateLimitUntil) return

  setLoading(true)
  try {
    const res = await fetch('/api/applications/membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // data is from zodResolver — clean schema fields only
      // _trap and _t added manually — not in schema, not validated
      body: JSON.stringify({
        ...data,
        _trap: trapRef.current,
        _t: loadTime.current,
      }),
    })
    // existing 429 handling unchanged
  } finally {
    setLoading(false)
  }
}
```

### Human-friendly error messages via Zod .message override

```typescript
// In schemas.ts — add .message() to Zod validators for conversational tone
export const MembershipSchema = z.object({
  fullName: z.string().min(1, 'What should we call you?').max(100).trim(),
  email: z.string().email('That doesn\'t look like an email address').max(254).trim().toLowerCase(),
  location: z.string().min(1, 'Where are you based?').max(100).trim(),
  // etc.
})
// zodResolver passes these messages through to errors.fieldName.message
```

### Section header pattern for longer forms

```typescript
// Subtle section divider matching existing label style
const SectionHeader = ({ title }: { title: string }) => (
  <div style={{
    borderTop: '0.5px solid var(--border-default)',
    paddingTop: '20px',
    marginTop: '4px',
  }}>
    <span style={{
      fontSize: '9px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-body)',
    }}>
      {title}
    </span>
  </div>
)
```

---

## Notion Property Gap Summary (FORM-03)

Fields that exist in schema + API route but are currently lost because the form doesn't send them:

| Form | Lost Field | Schema Field | Notion Property | Action |
|------|-----------|---|---|---|
| VenturesForm | founderName | founderName | Contact Name | Add to form, rename state key |
| VenturesForm | oneLineDescription | oneLineDescription | One-Line Description | Add field, remove `building` field |
| VenturesForm | linkedIn | linkedIn | LinkedIn URL | Add to form |
| VenturesForm | pitchDeckUrl | pitchDeckUrl | Pitch Deck URL | Add to form |
| VenturesForm | sector | sector | Sector | Add dropdown (8 options) |
| VenturesForm | raiseAmount | raiseAmount | Raise Amount | Add to form |
| VenturesForm | whySAGIE | whySAGIE | Why SAGIE | Fix casing: `whySagie` → `whySAGIE` |
| MembershipForm | company | company | Company | Add optional text field |
| MembershipForm | whatTheyOffer | whatTheyOffer | What They Offer | Add optional textarea |
| MembershipForm | category | category (array) | Category (multi_select) | Add checkbox group |
| ChapterForm | communitySize | communitySize | Existing Community Size | Add optional text field |
| SolutionsForm | providerName | providerName | Provider Name | Rename `fullName` → `providerName` |
| SolutionsForm | linkedIn | linkedIn | LinkedIn URL | Add to form |
| SolutionsForm | portfolioUrl | portfolioUrl | Website | Rename `website` → `portfolioUrl` |
| SolutionsForm | rateRange | rateRange | Rate Range | Add optional text field |
| SolutionsForm | location | location | Location | Add optional text field |
| SuggestEventForm | suggestedBy | suggestedBy | Submitted By | Rename `yourName` → `suggestedBy` |

**Fields to remove (not in schema, not written to Notion):**
- SuggestEventForm: `eventType`, `proposedDate`, `yourEmail` — orphan fields
- SolutionsForm: `memberStatus` — not in SolutionsSchema, not written to Notion

**Fields to flag for manual Notion review (in form + sent to API but not written):**
- SubmitPostForm: `yourEmail`, `url` — API route doesn't write these to Notion blog DB

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useState` fields + manual validate() | react-hook-form + zodResolver | This phase | Eliminates per-form validation logic, enables blur validation, centralizes error messages in schemas |
| Submit-only errors | Per-field blur errors | This phase | Users see errors immediately on leaving a field, not only after submit attempt |
| Free-text for constrained choices | Select / checkbox group | This phase | Prevents invalid data reaching Notion, aligns with what Notion expects |
| @hookform/resolvers v3 for Zod v3 | @hookform/resolvers v5 for Zod v4 | 2025 | Must use v5 resolvers — v3/v4 resolvers don't support Zod v4 API |

**Deprecated/outdated:**
- Hand-rolled `validate()` functions: replaced by zodResolver — don't retain these after migration
- `type="checkbox"` with custom useState array management: replaced by `register()` on multiple checkboxes with same name

---

## Open Questions

1. **SubmitPostForm blog categories**
   - What we know: Current form uses a select with `['Ecosystem', 'Spotlight', 'Thought Leadership', 'Event Recap']`. These are hardcoded. SubmitPostSchema has `category: z.string().min(1)` (no enum constraint).
   - What's unclear: Are these the canonical category values used in the actual blog Notion database? Should the schema be updated to an enum?
   - Recommendation: Keep `z.string()` in schema (no enum) to avoid breaking the API route. Convert form field to select with the 4 existing hardcoded options. This satisfies FORM-02 without requiring a schema change.

2. **SolutionsForm `memberStatus` field removal**
   - What we know: `memberStatus` exists in the current form but is NOT in SolutionsSchema and NOT written to Notion.
   - What's unclear: Was this intentional (collected informally) or a mistake?
   - Recommendation: Remove it — it has no schema backing and no Notion destination. Per locked decision, we align forms to schemas exactly.

3. **VenturesForm stage options discrepancy**
   - What we know: Schema has `['Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Revenue-Stage']`. Current form has `['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+']` — both the casing and option set differ. The Playwright E2E test fills `stage` with `'Pre-seed'` (lowercase s) which wouldn't match the schema enum.
   - What's unclear: Does the Notion `Stage` select property accept both casings?
   - Recommendation: Use schema values exactly (`Pre-Seed` not `Pre-seed`). Update the Playwright test to use `'Pre-Seed'`. Remove `'Idea'` (not in schema) and add `'Revenue-Stage'` (in schema, missing from form).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 (unit) + Playwright 1.58.2 (E2E) |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npm test` (vitest run) |
| Full suite command | `npm test && npx playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORM-01 | onBlur validation fires per-field | E2E | `npx playwright test tests/forms.spec.ts` | ✅ (needs updates) |
| FORM-02 | Fixed-choice fields render as select/checkbox | E2E | `npx playwright test tests/forms.spec.ts` | ✅ (needs updates) |
| FORM-03 | Schema fields match form fields (no silent loss) | Unit | `npm test -- schemas.test.ts` | ✅ (needs updates for role enum, new fields) |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test && npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/forms.spec.ts` — existing but needs updates: field names change (founderName, providerName, etc.), new blur-validation assertions, new fields (sector, rateRange, etc.), stage option fix (`Pre-Seed` not `Pre-seed`)
- [ ] `src/lib/__tests__/schemas.test.ts` — existing but needs update: MembershipSchema role field changes from string to enum; test fixtures using invalid enum values will fail
- No new test files required — existing test infrastructure covers all phase requirements with updates

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — all 7 form components, all API routes, FormField.tsx, schemas.ts, validation.ts, existing tests
- STATE.md decisions — `react-hook-form@^7.72.0` and `@hookform/resolvers@^5.2.2` pinned versions

### Secondary (MEDIUM confidence)
- react-hook-form documentation patterns (standard library usage, well-established patterns for onBlur mode, zodResolver, shouldFocusError)
- @hookform/resolvers v5 Zod v4 compatibility confirmed by version pairing (resolvers v5 = Zod v4 support)

### Tertiary (LOW confidence)
- None — all findings grounded in direct code inspection

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — react-hook-form and @hookform/resolvers were pre-decided in STATE.md; versions confirmed
- Architecture: HIGH — FormField extension pattern, registration prop, checkbox array pattern are all well-established RHF patterns
- Field audit: HIGH — derived entirely from direct codebase inspection (schemas.ts vs form components vs API routes)
- Pitfalls: HIGH — all identified from actual code mismatches found in inspection, not from hypothetical scenarios

**Research date:** 2026-03-28
**Valid until:** 2026-05-28 (react-hook-form v7 API is stable; Zod v4 is current release)
