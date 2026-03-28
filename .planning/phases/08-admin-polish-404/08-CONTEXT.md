# Phase 8: Admin Polish + 404 - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Improve the admin revalidation page with per-button loading/success/failure feedback, fix the 401 redirect behavior when the secret is wrong or rotated, and replace the 404 page illustration with a branded circuit-board SVG. Delivers POL-01, POL-02, POL-03.

</domain>

<decisions>
## Implementation Decisions

### Revalidation feedback (POL-01)
- Per-button inline status: spinner while loading, green checkmark on success, red X on failure
- Auto-dismiss status indicator after 3 seconds
- Spinner icon replaces button content during loading (no text change)
- Parallel requests allowed — each button operates independently, no global loading lock
- "Refresh All" button also gets per-button spinner/result treatment

### 401 reset behavior (POL-02)
- On 401 response: flash error indicator on the button that triggered it (red X)
- After ~2 seconds, automatically reset the entire page back to the secret prompt
- Secret prompt shows a hint message: "Secret was invalid or has been rotated. Please re-enter."
- All dashboard state (results, loading) cleared on reset

### 404 illustration (POL-03)
- Circuit-board traces that lead to a broken/disconnected node — visually communicates "path doesn't lead anywhere"
- Subtle CSS animation: gentle pulse on the broken node or slow trace-drawing effect
- CSS-only animation, no JavaScript
- Reuse the existing ErrorPage component (GridBackground + illustration + title + message + actions)
- Keep current copy: "This page doesn't exist, but there's plenty to explore."
- Keep existing action buttons: Go Home + Contact Us

### Admin page styling
- Minimal polish: site font, accent colors on buttons, subtle SAGIE branding — not a full redesign
- Use the site's Button component instead of inline Tailwind button styles
- "Refresh All" uses primary/accent button style (filled, stands out); individual tag buttons stay secondary/outline
- Apply same minimal polish to the secret prompt page (site font, branding consistency)
- Keep the gray-950 dark admin aesthetic — just bring in brand typography and component consistency

### Claude's Discretion
- Exact spinner/checkmark/X icon implementation (SVG inline or icon library)
- Circuit-board SVG illustration design details (trace paths, node shapes, colors)
- CSS animation timing and easing for 404 illustration
- Exact accent color choices for admin button states
- Button component variant mapping for admin page buttons
- Whether to add a small SAGIE wordmark/logo to the admin header

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ErrorPage` (src/components/ui/ErrorPage.tsx): Shared error component with GridBackground, illustration slot, title, message, actions — 404 should use this
- `Button` (src/components/ui/Button.tsx): Site button component with `variant` prop (outline, ghost) — admin page should adopt this
- `GridBackground` (src/components/ui/GridBackground.tsx): Background pattern used in error pages and 404
- `not-found.tsx` (src/app/not-found.tsx): Current 404 page with minimal SVG — needs illustration upgrade

### Established Patterns
- ErrorPage component takes `illustration` as React.ReactNode slot — 404 illustration drops in directly
- Admin revalidate page (src/app/admin/revalidate/page.tsx): Currently uses single global `loading` + `result` state — needs refactoring to per-button state (Map or object keyed by tag)
- API route (src/app/api/revalidate/route.ts): Returns 401 for invalid secret — admin page needs to detect and handle this status code specifically

### Integration Points
- `src/app/admin/revalidate/page.tsx`: Main file to refactor (per-button state, 401 handling, Button component adoption)
- `src/app/not-found.tsx`: Replace with ErrorPage-based implementation + new circuit-board illustration
- `src/components/ui/ErrorPage.tsx`: Already exists, no changes needed — 404 consumes it as-is
- `src/components/ui/Button.tsx`: Already exists — admin page imports and uses it

</code_context>

<specifics>
## Specific Ideas

- Circuit-board broken path should feel like SAGIE's tech/network aesthetic — traces, nodes, connection points
- The broken node should draw the eye — it's the visual anchor that communicates "something's missing"
- Admin page should feel like a clean internal tool, not a marketing page — minimal branding, not full site treatment
- 401 reset should feel smooth — flash the error, then gracefully transition back to prompt (not jarring)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-admin-polish-404*
*Context gathered: 2026-03-28*
