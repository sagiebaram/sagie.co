---
status: diagnosed
trigger: "Form at /apply won't submit. User fills all required fields and clicks Submit - nothing visible happens."
created: 2026-03-28T00:00:00Z
updated: 2026-03-28T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED - linkedIn empty string fails Zod .url() validation on server
test: safeParse with linkedIn: '' returns validation error
expecting: parse fails on linkedIn
next_action: report diagnosis

## Symptoms

expected: Form shows success message or an error message after clicking Submit
actual: Nothing visible happens (user perception). In reality, a tiny 11px generic error appears.
errors: No console errors reported. Server returns 422 silently.
reproduction: Fill all required fields, leave LinkedIn blank, click Submit
started: Since form was created with Zod server-side validation

## Eliminated

- hypothesis: Zod schema has TypeScript compile error that causes runtime crash
  evidence: npx tsc --noEmit produces zero errors. Schema.safeParse() works at runtime.
  timestamp: 2026-03-28

- hypothesis: Honeypot timing check silently swallows submissions
  evidence: Timing check only triggers if elapsed < 3000ms. Real users filling all required fields take much longer.
  timestamp: 2026-03-28

## Evidence

- timestamp: 2026-03-28
  checked: Zod version
  found: Zod 4.3.6, z.enum error option is valid in this version
  implication: Schema compiles and loads fine

- timestamp: 2026-03-28
  checked: MembershipSchema.safeParse with linkedIn='' (what client sends)
  found: Parse FAILS with error "Please enter a valid LinkedIn URL" on linkedIn path
  implication: Server returns 422 when user leaves LinkedIn blank

- timestamp: 2026-03-28
  checked: Client handleSubmit response handling for non-ok status
  found: Sets errors.submit = "Something went wrong. Please try again." (generic message)
  implication: User sees generic error, not field-specific LinkedIn error

- timestamp: 2026-03-28
  checked: Error display in form template
  found: Error text is 11px, color #c0392b, placed between submitWarning and button
  implication: Error IS rendered but is very small and easy to miss

- timestamp: 2026-03-28
  checked: Client-side validate() function
  found: Does NOT check linkedIn as required, only validates format if non-empty
  implication: Client validation passes, server validation fails - mismatch

## Resolution

root_cause: |
  TWO compounding issues cause the "nothing happens" experience:

  1. PRIMARY: Schema/client mismatch on linkedIn field.
     - Client sends linkedIn: '' (empty string) when user leaves the field blank
     - Server Zod schema has: z.string().url().optional()
     - .optional() only accepts undefined, NOT empty string
     - Empty string fails the .url() format check
     - Server returns 422 with field-specific error { fieldErrors: { linkedIn: [...] } }

  2. SECONDARY: Client does not surface field-specific server errors.
     - handleSubmit catches !res.ok and shows generic "Something went wrong"
     - The 422 response body contains fieldErrors but client never reads them
     - The generic error text is 11px (tiny), easy to miss
     - User perceives "nothing happens" because the error is too subtle

fix: |
  Two changes needed:
  A) In schemas.ts: Change linkedIn to handle empty strings, e.g.:
     linkedIn: z.string().url('...').optional().or(z.literal(''))
     OR transform empty string to undefined before schema validation
  B) In MembershipForm.tsx handleSubmit: Parse the 422 response body and
     display fieldErrors per-field, not just a generic message

verification:
files_changed: []
