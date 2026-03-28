# Phase 7: Form Redesign - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Schema audit, react-hook-form adoption, inline validation, and structured input controls across all 7 forms. Every form field matches its Zod schema, every submission lands completely in Notion. Delivers FORM-01, FORM-02, FORM-03.

</domain>

<decisions>
## Implementation Decisions

### Field audit
- All forms must match their Zod schemas exactly — every schema field gets a form input
- VenturesForm: add missing fields (founderName, linkedIn, pitchDeckUrl, sector, raiseAmount, oneLineDescription), rename mismatched fields (building → oneLineDescription, fullName → founderName)
- MembershipForm: add company (optional text), whatTheyOffer (optional textarea), category (checkbox group with all 7 enum values)
- ChapterForm: add communitySize (optional text)
- SolutionsForm, SubmitPostForm, SuggestEventForm, SubmitResourceForm: align all fields to match their respective schemas
- Notion property mismatches flagged for manual review — document gaps, don't auto-create Notion properties

### Validation behavior
- react-hook-form with @hookform/resolvers/zod for all 7 forms
- Validation mode: `onBlur` with `reValidateMode: onChange` — errors appear on blur, clear as soon as input becomes valid while typing
- No success indicators on valid fields — neutral state only (no error = good)
- On submit with invalid fields: show all errors simultaneously + auto-scroll/focus to first invalid field
- Custom human-friendly error messages matching the site's conversational tone (not Zod defaults)
- Preserve existing honeypot + timing bot protection
- Preserve Phase 5 rate limit handling (amber warning, Retry-After parsing, disabled button)

### Fixed-choice controls
- MembershipForm category: checkbox group (all 7 options visible at once)
- VenturesForm sector (8 options): dropdown select
- VenturesForm stage (5 options): dropdown select
- SolutionsForm category (6 options): dropdown select
- MembershipForm role: dropdown select — update Zod schema to enum matching dropdown options (Founder, Investor, Operator, Ecosystem Builder, Academic, Partner)
- SubmitPostForm category: dropdown with predefined blog categories (no free-text)

### Form visual polish
- Longer forms (Membership, Ventures) grouped into visual sections with subtle uppercase section headers (matching existing label style)
- Shorter forms (SuggestEvent, SubmitPost, SubmitResource) can stay flat — Claude's discretion
- Submit button: keep current style (silver, uppercase, display font, left-aligned)
- Checkbox group: custom-styled to match dark theme — custom checkbox with site border/color tokens
- Required field markers: keep current silver asterisk after label

### Claude's Discretion
- Section grouping names and which fields go in which section
- Whether shorter forms need section headers
- Custom error message copy (tone should be conversational, not technical)
- FormField component extensions needed for checkbox group type
- Blog category list for SubmitPostForm dropdown (derive from existing blog data)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `FormField` (src/components/ui/FormField.tsx): Supports text, email, url, textarea, select — needs checkbox group type added
- `FormSuccess` (src/components/ui/FormSuccess.tsx): Success state component — reuse as-is
- Zod schemas (src/lib/schemas.ts): All 7 schemas defined — source of truth for field requirements
- `withValidation` (src/lib/validation.ts): Server-side Zod validation middleware — already handles field errors

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
- Section headers should be very subtle — same style as field labels but slightly larger or with a divider line

</specifics>

<deferred>
## Deferred Ideas

- Multi-step form wizard for membership/ventures applications — tracked as FORM-04 in future requirements

</deferred>

---

*Phase: 07-form-redesign*
*Context gathered: 2026-03-28*
