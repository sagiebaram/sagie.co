---
phase: 07-form-redesign
verified: 2026-03-28T00:00:00Z
status: human_needed
score: 23/23 must-haves verified
human_verification:
  - test: "Submit the membership form with role set to 'Other', type a custom value, and submit — confirm custom text lands in Notion Role property"
    expected: "Notion record shows the typed free-text value in the Role field (not 'Other')"
    why_human: "The onValueChange flow passes the typed text to setValue, but runtime Notion write can only be confirmed by live submission or Notion API inspection"
  - test: "On the membership form, click into fullName and tab away without typing — confirm 'What should we call you?' appears below the field with no red border on the input itself"
    expected: "Error text appears, input border remains the default var(--border-default) colour (not red)"
    why_human: "Visual border-colour inspection cannot be automated with grep; requires rendering in a browser"
  - test: "On the membership form role custom dropdown, press Tab to focus the trigger, press Enter to open, press ArrowDown, press Enter to select — confirm the second option is selected"
    expected: "Keyboard navigation selects the highlighted option and closes the panel"
    why_human: "Keyboard event flow through React state is not inspectable statically; requires runtime test"
  - test: "Open the membership form role dropdown, click outside the panel — confirm the panel closes"
    expected: "Panel disappears, no option is selected"
    why_human: "mousedown/document event behaviour requires a browser"
  - test: "Verify that the submit-post Notion record stores the submitter email and URL (open question flagged in RESEARCH.md)"
    expected: "yourEmail and url appear as Notion properties on the blog post record"
    why_human: "API route currently only writes Title, Category, Author, Excerpt, Status, Author Type to Notion. RESEARCH.md flagged yourEmail and url as gaps for manual review. CONTEXT.md decision was 'document gaps only'. Needs product owner decision on whether the Notion blog DB has these properties."
---

# Phase 7: Form Redesign — Verification Report

**Phase Goal:** Users filling out any form receive immediate inline validation feedback and interact with structured input controls for fixed-choice fields, and every submission lands completely in Notion

**Verified:** 2026-03-28
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| 1   | react-hook-form and @hookform/resolvers are installed and importable | VERIFIED | package.json: react-hook-form@^7.72.0, @hookform/resolvers@^5.2.2 |
| 2   | FormField accepts a registration prop from react-hook-form register() | VERIFIED | UseFormRegisterReturn imported, registration prop in FormFieldProps interface |
| 3   | FormField renders a checkbox-group input type with custom dark-theme styling | VERIFIED | type === 'checkbox-group' branch at line 244, rhf-checkbox CSS class, appearance:none, var(--border-default) |
| 4   | MembershipSchema role field is a non-empty string (was enum, relaxed to z.string().min(1) in Plan 03 for "Other" free-text) | VERIFIED | schemas.ts line 10: z.string().min(1, 'Please select your role') |
| 5   | All 6 schemas have human-friendly error messages on required fields | VERIFIED | All schemas use conversational messages: "What should we call you?", "That doesn't look like an email address", "Where are you based?", etc. |
| 6   | MembershipForm validates every field on blur with per-field error messages | VERIFIED | useForm mode:'onBlur', reValidateMode:'onChange', zodResolver(MembershipSchema), error={errors.fieldName?.message} on every FormField |
| 7   | MembershipForm renders category as checkbox group with all 7 options | VERIFIED | FormField type="checkbox-group" options=['Founder','Investor','Tech Pro','Ecosystem Builder','Sponsor','Partner','Advisor'] |
| 8   | MembershipForm renders role as custom dropdown with 6 enum options + allowOther | VERIFIED | FormField type="select" options=['Founder','Investor','Operator','Ecosystem Builder','Academic','Partner'] allowOther, onValueChange via setValue |
| 9   | MembershipForm sends company, whatTheyOffer, and category (previously missing) | VERIFIED | All 3 fields present in form; API route writes company, What They Offer, Category to Notion |
| 10  | MembershipForm has visual section grouping | VERIFIED | SectionHeader components: "About You", "Your Interests", "Connection" |
| 11  | VenturesForm validates every field on blur with per-field error messages | VERIFIED | useForm mode:'onBlur', reValidateMode:'onChange', zodResolver(VenturesSchema) |
| 12  | VenturesForm sends founderName, linkedIn, pitchDeckUrl, sector, raiseAmount, oneLineDescription (previously missing/mismatched) | VERIFIED | All fields present in form; API route writes Contact Name, LinkedIn URL, Pitch Deck URL, Sector, Raise Amount, One-Line Description to Notion |
| 13  | VenturesForm renders sector and stage as custom dropdowns with schema-matching options | VERIFIED | Sector: 8 options matching VenturesSchema enum; Stage: 5 options ('Pre-Seed','Seed','Series A','Series B+','Revenue-Stage') matching schema |
| 14  | VenturesForm has visual section grouping | VERIFIED | SectionHeader components: "Company", "Details", "About SAGIE" |
| 15  | Both MembershipForm and VenturesForm preserve honeypot, timing, and rate limit handling | VERIFIED | trapRef, loadTime.current in JSON body; rateLimitUntil state; submitWarning state; Retry-After parsing present in both |
| 16  | All dropdown selects render as custom-styled components (no native HTML select) | VERIFIED | grep for `<select` in src/components/forms/*.tsx returns zero matches; FormField type='select' renders button+listbox |
| 17  | Custom dropdown supports keyboard navigation | VERIFIED | handleTriggerKeyDown: ArrowUp/ArrowDown move highlight, Enter selects highlighted, Escape closes panel |
| 18  | Custom dropdown closes when clicking outside | VERIFIED | useEffect mousedown listener on document, dropdownRef.current.contains check, cleanup on unmount |
| 19  | Error text appears below fields without red borders on inputs | VERIFIED | inputStyle has no error-conditional border; border is always '0.5px solid var(--border-default)'; error span rendered separately |
| 20  | MembershipForm role dropdown includes "Other" with free-text input | VERIFIED | allowOther prop, allOptions appends 'Other', isOtherSelected shows text input, onValueChange passes typed text |
| 21  | SolutionsForm category and SubmitPostForm category use custom dropdowns wired via setValue/watch | VERIFIED | Both use value={watch('category')} onValueChange={(v) => setValue('category', v, ...)} |
| 22  | E2E tests updated for custom dropdown interaction | VERIFIED | selectDropdownOption helper in tests/forms.spec.ts; membership, ventures (sector+stage), solutions tests use it; no page.selectOption() remains |
| 23  | All API routes write schema fields to Notion | VERIFIED (with caveat) | membership: all 13 properties written; ventures: all 12 properties written; solutions: all 8 properties written; chapter: all 7 properties written; suggest-event: all 4 properties written. submit-post: 6/8 properties written — yourEmail and url NOT written to Notion (known gap, flagged in RESEARCH.md line 380, deferred per CONTEXT.md line 24) |

**Score:** 23/23 truths verified (one truth has a known deferred sub-gap in submit-post Notion coverage)

---

## Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/components/ui/FormField.tsx` | Custom dropdown, checkbox-group, registration prop, no red border | VERIFIED | 295 lines; all four branches implemented; UseFormRegisterReturn typed import |
| `src/lib/schemas.ts` | 6 schemas with friendly error messages, role as z.string().min(1) | VERIFIED | All schemas use conversational errors; optionalUrl helper for URL fields; role is z.string() not z.enum |
| `src/lib/__tests__/schemas.test.ts` | Tests updated for role string validation | VERIFIED | role: 'Founder' in fixtures (valid string); test structure intact |
| `src/components/forms/MembershipForm.tsx` | RHF, zodResolver, onBlur, all schema fields, checkbox-group, custom dropdown, sections | VERIFIED | 266 lines; all 11 schema fields rendered; 3 section headers; honeypot+timing preserved |
| `src/components/forms/VenturesForm.tsx` | RHF, zodResolver, onBlur, all schema fields, custom dropdowns, sections | VERIFIED | 267 lines; all 12 schema fields rendered; 3 section headers; field names match schema exactly |
| `src/components/forms/SolutionsForm.tsx` | Custom dropdown for category wired via setValue/watch | VERIFIED | onValueChange pattern, setValue('category', v as enum-type) with type cast |
| `src/components/forms/SubmitPostForm.tsx` | Custom dropdown for category wired via setValue/watch | VERIFIED | onValueChange pattern, setValue('category', v) |
| `tests/forms.spec.ts` | E2E tests using selectDropdownOption helper, blur validation tests | VERIFIED | selectDropdownOption helper at top; 5 form submission tests; 5 blur validation tests; 10 total |

---

## Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| FormField.tsx | react-hook-form | UseFormRegisterReturn import, registration prop spread | WIRED | Line 4 import, line 16 prop, lines 129/263/284 spread |
| MembershipForm.tsx | schemas.ts | zodResolver(MembershipSchema) | WIRED | Lines 7+56: import and resolver |
| MembershipForm.tsx | FormField.tsx | registration={register('fieldName')} | WIRED | All text/email/textarea fields use registration prop |
| MembershipForm.tsx | FormField.tsx | value={watch('role')} onValueChange={(v)=>setValue('role',v)} | WIRED | Lines 146-148 for role select field |
| VenturesForm.tsx | schemas.ts | zodResolver(VenturesSchema) | WIRED | Lines 7+56: import and resolver |
| VenturesForm.tsx | FormField.tsx | onValueChange via setValue for sector+stage | WIRED | Lines 176+185: setValue with enum type casts |
| SolutionsForm.tsx | schemas.ts | zodResolver(SolutionsSchema) | WIRED | Lines 9+27: import and resolver |
| SolutionsForm.tsx | FormField.tsx | onValueChange via setValue for category | WIRED | Line 112: setValue with enum type cast |
| SubmitPostForm.tsx | schemas.ts | zodResolver(SubmitPostSchema) | WIRED | Lines 9+27: import and resolver |
| tests/forms.spec.ts | FormField.tsx | data-dropdown attribute selector | WIRED | selectDropdownOption uses [data-dropdown="${fieldName}"] which matches data-dropdown={name} on trigger button |
| membership/route.ts | schemas.ts | withValidation(MembershipSchema) | WIRED | Server-side validation gates all field writes |
| ventures/route.ts | schemas.ts | withValidation(VenturesSchema) | WIRED | Server-side validation gates all field writes |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| FORM-01 | 07-01, 07-02, 07-03 | All form fields validated inline on blur with per-field error messages via react-hook-form | SATISFIED | All 5 forms (Membership, Ventures, Chapter, Solutions, SuggestEvent) use useForm mode:'onBlur' + zodResolver. SubmitPostForm also migrated. E2E blur tests for all 5 forms pass. |
| FORM-02 | 07-01, 07-02, 07-03 | Fixed-choice fields use dropdown selects and checkbox groups instead of free-text inputs | SATISFIED | 5 dropdown instances (role, sector, stage, solutions category, post category) use custom-styled dropdown. MembershipForm category uses checkbox-group. Zero native <select> elements remain. |
| FORM-03 | 07-02, 07-03 | All form submissions verified to land every field in Notion (schema/field audit) | SATISFIED (with deferred gap) | VenturesForm field-name data-loss bugs fixed (founderName, oneLineDescription, whySAGIE). MembershipForm now sends company, whatTheyOffer, category. All 5 API routes write validated fields to Notion. Known gap: submit-post route does not write yourEmail or url to Notion — flagged in RESEARCH.md, deferred per CONTEXT.md decision "document gaps only, don't auto-create Notion properties". |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `src/app/api/submit-post/route.ts` | 16-22 | `yourEmail` and `url` not written to Notion properties | Info | Schema collects these fields, sendEmails uses yourEmail, but Notion blog DB record has no submitter email or URL property. Acknowledged deferred gap, not a blocker. |
| `src/components/forms/VenturesForm.tsx` | 11 | `z.infer<typeof VenturesSchema>` (summary claimed z.input was used) | Info | VenturesSchema has no `.default()` fields so z.infer is correct here. Not a bug — summary was imprecise. |

No placeholder implementations, empty handlers, or stub components found.

---

## Human Verification Required

### 1. Role "Other" free-text round-trip to Notion

**Test:** On the membership form (/apply), open the "I am a..." dropdown, select "Other", type "Venture Studio Operator" in the text field that appears, fill remaining required fields, and submit.
**Expected:** The submitted Notion record shows "Venture Studio Operator" in the Role text property (not the word "Other").
**Why human:** The onValueChange -> setValue -> JSON.stringify chain can be traced statically, but whether the Notion database's Role property stores free-text values from custom "Other" inputs requires live submission or Notion API inspection.

### 2. Error text-only styling (no red border)

**Test:** On any form, click into a required text field, immediately tab away without typing, observe the field and error text.
**Expected:** Error text ("What should we call you?" etc.) appears below the field. The input border remains the default muted colour — no red highlight on the input box itself.
**Why human:** The code clearly shows border is always 'var(--border-default)' regardless of error state, but visual confirmation of rendering across different browsers requires a browser.

### 3. Custom dropdown keyboard navigation

**Test:** On the ventures form (/apply/ventures), press Tab until the "Sector" dropdown trigger is focused. Press Enter to open, press ArrowDown twice, press Enter to select.
**Expected:** The third option ("SaaS") is highlighted and selected. The panel closes.
**Why human:** React state transitions from keyboard events require runtime to observe.

### 4. Click-outside behaviour

**Test:** On any form with a dropdown, open the dropdown panel, then click anywhere outside the dropdown container.
**Expected:** The panel closes immediately. If a value was not selected, the trigger continues showing the placeholder.
**Why human:** document mousedown listener behaviour requires a rendered DOM.

### 5. Submit-post Notion coverage decision

**Test:** Submit the "Submit Post" form (/blog/submit or equivalent) and open the resulting Notion record.
**Expected (to confirm or decide):** Determine whether yourEmail and url should become Notion properties on the blog DB record, or whether email-only notification (current behaviour) is acceptable.
**Why human:** This is a product decision. RESEARCH.md flagged it; CONTEXT.md deferred it. Phase 7 did not add these Notion properties. A product owner needs to decide whether this is acceptable or requires a follow-up plan.

---

## Gaps Summary

No automated gaps found. All 23 must-haves are verified in the codebase.

The only open item is the submit-post `yourEmail`/`url` Notion coverage, which is a pre-existing, intentionally deferred gap documented in RESEARCH.md and explicitly exempted from Phase 7 scope by CONTEXT.md line 24. It requires a human product decision, not an additional fix in this phase.

---

_Verified: 2026-03-28_
_Verifier: Claude (gsd-verifier)_
