# Phase 7: Form Redesign - Context

**Gathered:** 2026-03-28
**Updated:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Schema audit, react-hook-form adoption, inline validation, and structured input controls across all 7 forms. Every form field matches its Zod schema, every submission lands completely in Notion. Delivers FORM-01, FORM-02, FORM-03.

</domain>

<decisions>
## Implementation Decisions

### Field audit
- Align all 7 forms to their existing Zod schemas — add form inputs for every schema field that's missing from the UI
- VenturesForm: add missing fields (founderName, linkedIn, pitchDeckUrl, sector, raiseAmount, oneLineDescription), rename mismatched fields (building -> oneLineDescription, fullName -> founderName)
- MembershipForm: add company (optional text), whatTheyOffer (optional textarea), category (checkbox group with all 7 enum values)
- ChapterForm: add communitySize (optional text)
- SolutionsForm, SubmitPostForm, SuggestEventForm, SubmitResourceForm: align all fields to match their respective schemas
- Just rename mismatched fields — no backwards compatibility shims needed
- Notion property mismatches: document gaps only, don't auto-create Notion properties via API

### Validation behavior
- react-hook-form with @hookform/resolvers/zod for all 7 forms
- Validation mode: `onBlur` with `reValidateMode: onChange` — errors appear on blur, clear as soon as input becomes valid while typing
- No success indicators on valid fields — neutral state only (no error = good)
- On submit with invalid fields: show all errors simultaneously + auto-scroll/focus to first invalid field
- Error messages: friendly nudges, not technical ("We'll need your email to get back to you" / "Tell us a bit more" / "Pick at least one category")
- Error text appears directly below the field, shifting content down. No red border — just the error text
- Preserve existing honeypot + timing bot protection as-is (don't integrate into react-hook-form)
- Preserve Phase 5 rate limit handling as-is (amber warning, Retry-After parsing, disabled button)

### Fixed-choice controls
- MembershipForm category: checkbox group in 2-column grid (all 7 options visible at once)
- VenturesForm sector (8 options): custom-styled dropdown select
- VenturesForm stage (5 options): custom-styled dropdown select
- SolutionsForm category (6 options): custom-styled dropdown select
- MembershipForm role: custom-styled dropdown with 6 options (Founder, Investor, Operator, Ecosystem Builder, Academic, Partner) PLUS "Other" with a free-text input that appears when selected
- SubmitPostForm category: custom-styled dropdown with predefined blog categories (no free-text)
- All dropdowns are custom-styled (not native HTML <select>) to match dark theme
- Claude's discretion: whether sector, stage, or other dropdowns also need an "Other" option — add where the field's nature allows for values outside the predefined list

### Form visual polish
- Longer forms (Membership, Ventures) grouped into visual sections with subtle divider line + uppercase label (same pattern as TypeDivider on events page)
- Shorter forms (SuggestEvent, SubmitPost, SubmitResource): Claude's discretion on whether they need section headers
- Keep 2-column grid layout for paired short fields (name/email, city/country) — full-width on mobile
- Submit button: keep current style (silver, uppercase, display font, left-aligned, disabled during submission)
- Checkbox group: custom-styled to match dark theme, laid out in 2-column grid
- Required field markers: keep current silver asterisk after label

### Claude's Discretion
- Section grouping names and which fields go in which section
- Whether shorter forms need section headers
- Error message copy per field (tone: friendly nudges)
- FormField component extensions for checkbox group and custom dropdown
- Blog category list for SubmitPostForm dropdown (derive from existing blog data)
- Which additional dropdowns get "Other + free-text" beyond role (where the field naturally allows unlisted values)
- Custom dropdown implementation approach (click-outside handling, keyboard nav, animation)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `FormField` (src/components/ui/FormField.tsx): Supports text, email, url, textarea, select — needs custom dropdown and checkbox group types
- `FormSuccess` (src/components/ui/FormSuccess.tsx): Success state component — reuse as-is
- Zod schemas (src/lib/schemas.ts): All 7 schemas defined — source of truth for field requirements
- `withValidation` (src/lib/validation.ts): Server-side Zod validation middleware — already handles field errors
- `TypeDivider` pattern (EventsPageClient.tsx): Subtle divider line + uppercase label — reuse for form sections

### Established Patterns
- All 7 forms follow identical pattern: useState fields, manual validate(), handleSubmit with fetch, honeypot + timing refs
- Rate limit handling added in Phase 5: submitWarning state, rateLimitUntil state, Retry-After parsing, amber warning display
- FormField uses inline styles with CSS custom properties (var(--bg-card), var(--border-default), etc.)
- 2-column grid layout with `gridTemplateColumns: '1fr 1fr'` for paired fields

### Integration Points
- react-hook-form + @hookform/resolvers replaces: useState fields, manual validate(), setErrors — but preserves fetch/submit logic
- Each form's API route (src/app/api/applications/*/route.ts) uses withValidation — server schemas must stay in sync
- Notion write functions in route handlers — field names in API body must match Notion property names

</code_context>

<specifics>
## Specific Ideas

- Error messages should feel like a conversation, not a system message ("Tell us a bit more" not "String must contain at least 10 characters")
- Checkbox group should feel native to the dark theme — not an afterthought
- Section headers should use the same subtle divider pattern as the events page TypeDivider
- "Other" dropdown option should reveal the text input inline — smooth, not jarring

</specifics>

<deferred>
## Deferred Ideas

- Multi-step form wizard for membership/ventures applications — tracked as FORM-04 in future requirements

</deferred>

---

*Phase: 07-form-redesign*
*Context gathered: 2026-03-28*
*Context updated: 2026-03-28*
