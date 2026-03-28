# Phase 8: Admin Polish + 404 - Research

**Researched:** 2026-03-28
**Domain:** React state refactoring, per-button async UX, CSS-only SVG animation, Next.js custom 404
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Revalidation feedback (POL-01)**
- Per-button inline status: spinner while loading, green checkmark on success, red X on failure
- Auto-dismiss status indicator after 3 seconds
- Spinner icon replaces button content during loading (no text change)
- Parallel requests allowed — each button operates independently, no global loading lock
- "Refresh All" button also gets per-button spinner/result treatment

**401 reset behavior (POL-02)**
- On 401 response: flash error indicator on the button that triggered it (red X)
- After ~2 seconds, automatically reset the entire page back to the secret prompt
- Secret prompt shows a hint message: "Secret was invalid or has been rotated. Please re-enter."
- All dashboard state (results, loading) cleared on reset

**404 illustration (POL-03)**
- Circuit-board traces that lead to a broken/disconnected node
- Subtle CSS animation: gentle pulse on the broken node or slow trace-drawing effect
- CSS-only animation, no JavaScript
- Reuse the existing ErrorPage component (GridBackground + illustration + title + message + actions)
- Keep current copy: "This page doesn't exist, but there's plenty to explore."
- Keep existing action buttons: Go Home + Contact Us

**Admin page styling**
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| POL-01 | Revalidation admin page shows per-button loading state and success/failure indication | Per-button state via Map keyed by tag; auto-dismiss via setTimeout in useEffect cleanup pattern; spinner + checkmark + X as inline SVGs |
| POL-02 | Revalidation 401 response correctly resets to access prompt instead of broken redirect | Detect `res.status === 401` in fetch handler; flash error state, then `setTimeout` (2 s) to call a `resetToPrompt()` function that clears all state |
| POL-03 | Custom 404 page with branded SVG/CSS illustration matching site aesthetic | Replace NotFoundIllustration in not-found.tsx with circuit-board SVG; CSS keyframes for pulse on broken node; not-found.tsx stays server component |
</phase_requirements>

---

## Summary

Phase 8 is a pure UI polish phase with no new API surface, no new dependencies, and no new data models. All three requirements live within two existing files: `src/app/admin/revalidate/page.tsx` (POL-01, POL-02) and `src/app/not-found.tsx` (POL-03).

The admin page currently uses a single shared `loading` boolean and a single `result` string. Delivering POL-01 requires replacing that with a per-button state Map keyed by tag string, where each slot holds a status of `'idle' | 'loading' | 'success' | 'error'`. The auto-dismiss (3 s) and the 401 auto-reset (2 s) are both implemented with `setTimeout` inside `useEffect` cleanup patterns — the same pattern already used elsewhere in this codebase (`cancelledRef` pattern from Phase 1).

The 404 page already uses the right structural foundation: `GridBackground` + hand-rolled layout in `not-found.tsx`. However, the existing `ErrorPage` component requires `onRetry` for its action slot to render the retry button, and its `<h1>` uses `text-tier` (40 px) with `uppercase`, which would render "404" in uppercase at the wrong size. The current `not-found.tsx` uses `text-stat` (96 px) without the ErrorPage wrapper. The simplest approach is to keep `not-found.tsx` self-contained (as it already is), replace only the `NotFoundIllustration` function with a circuit-board SVG, and add CSS keyframe animation via a `<style>` tag or by extending `globals.css` — which is the established pattern for custom animations in this project.

**Primary recommendation:** Refactor admin page to per-tag state Map; add 401-detect-and-reset flow; replace the 404 SVG illustration in-place inside `not-found.tsx` — no new files, no new dependencies.

---

## Standard Stack

### Core (already installed — no new packages needed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React `useState` / `useEffect` | 19 (Next.js 15) | Per-button state map, auto-dismiss timers | Built-in; matches existing patterns |
| Tailwind CSS v4 | 4.x | Admin button styling, animation classes | Project standard; `globals.css` uses `@import "tailwindcss"` |
| Inline SVG | — | Spinner, checkmark, X icons and 404 illustration | No icon library installed; project uses inline SVGs throughout |
| CSS `@keyframes` | — | 404 illustration pulse animation | Already used in project (skeleton-sweep in globals.css) |

### No New Dependencies
This phase requires zero `npm install` steps. All building blocks exist:
- State management: React `useState` with `Map<string, ButtonStatus>`
- Icons: Inline SVG (matches existing `NotFoundIllustration` pattern)
- Animation: CSS `@keyframes` (matches existing `skeleton-sweep` pattern)
- Components: `Button`, `GridBackground`, `ErrorPage` — all in `src/components/ui/`

---

## Architecture Patterns

### Recommended Project Structure (unchanged)
```
src/
├── app/
│   ├── admin/revalidate/page.tsx   # MODIFY — per-button state, 401 handling, Button component
│   └── not-found.tsx               # MODIFY — replace NotFoundIllustration, add CSS animation
└── app/globals.css                 # POSSIBLY MODIFY — add @keyframes for 404 pulse
```

No new files created. No component extraction needed — both changes are self-contained.

### Pattern 1: Per-Button Status Map

**What:** Replace `loading: boolean` + `result: string | null` with a `Map<string, ButtonStatus>` where `ButtonStatus = 'idle' | 'loading' | 'success' | 'error'`.

**When to use:** When N independent async actions need individual feedback without blocking each other.

**Key insight from current code:** The current `handleRevalidate` sets a single `loading` state which `disabled={loading}` on ALL buttons. The new pattern sets status only for the tag being acted on, leaving other buttons fully interactive.

```typescript
// Source: React useState pattern — verified against project conventions
type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

const [statuses, setStatuses] = useState<Map<string, ButtonStatus>>(new Map())

function setStatus(key: string, status: ButtonStatus) {
  setStatuses(prev => new Map(prev).set(key, status))
}

function getStatus(key: string): ButtonStatus {
  return statuses.get(key) ?? 'idle'
}
```

**"Refresh All" key:** Use a sentinel constant like `'__all__'` as its map key — distinct from any tag string.

### Pattern 2: Auto-Dismiss with useEffect Cleanup

**What:** After setting status to 'success' or 'error', schedule a `setTimeout` to reset it to 'idle' after 3 seconds. Clear the timer on component unmount or if the button is triggered again before the timer fires.

**Why cleanup matters:** The project uses `cancelledRef` pattern for `setTimeout` cleanup (established in Phase 1). For per-button timers, store timer IDs in a `useRef<Map<string, ReturnType<typeof setTimeout>>>`.

```typescript
// Source: project pattern — cancelledRef established in Phase 1 decisions
const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

function scheduleReset(key: string, delay: number, resetFn: () => void) {
  // Clear any existing timer for this key
  const existing = timersRef.current.get(key)
  if (existing) clearTimeout(existing)

  const id = setTimeout(() => {
    resetFn()
    timersRef.current.delete(key)
  }, delay)
  timersRef.current.set(key, id)
}

// Cleanup all timers on unmount
useEffect(() => {
  return () => {
    timersRef.current.forEach(id => clearTimeout(id))
  }
}, [])
```

### Pattern 3: 401 Detection and Page Reset

**What:** Inside `handleRevalidate`, after receiving a response, check `res.status === 401` specifically before the generic error path. On 401: set status to 'error' for that button, then schedule a 2 s delayed reset that calls `resetToPrompt()`.

```typescript
// Source: direct reading of src/app/api/revalidate/route.ts
// API returns: Response.json({ error: 'Unauthorized' }, { status: 401 })

async function handleRevalidate(key: string, tags: string[]) {
  setStatus(key, 'loading')
  try {
    const res = await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags }),
    })

    if (res.status === 401) {
      setStatus(key, 'error')
      scheduleReset(key, 2000, () => resetToPrompt())
      return
    }

    if (!res.ok) {
      setStatus(key, 'error')
      scheduleReset(key, 3000, () => setStatus(key, 'idle'))
      return
    }

    setStatus(key, 'success')
    scheduleReset(key, 3000, () => setStatus(key, 'idle'))
  } catch {
    setStatus(key, 'error')
    scheduleReset(key, 3000, () => setStatus(key, 'idle'))
  }
}

function resetToPrompt() {
  setSecretEntered(false)
  setSecret('')
  setStatuses(new Map())
  // Clear all pending timers
  timersRef.current.forEach(id => clearTimeout(id))
  timersRef.current.clear()
}
```

**Hint message state:** The secret prompt needs to conditionally show the "rotated secret" message. Add `const [showSecretHint, setShowSecretHint] = useState(false)` and pass `true` into `resetToPrompt()` when called from a 401 path.

### Pattern 4: Button Component Integration for Admin

**What:** The `Button` component in `src/components/ui/Button.tsx` renders an `<a>` element (link), not a `<button>`. Admin action buttons are `<button>` elements with `onClick` handlers, so `Button` cannot be used directly for revalidation triggers.

**Critical finding:** `Button` is always an `<a>` tag — `interface ButtonProps extends React.ComponentPropsWithoutRef<'a'>`. There is no `as` prop, no polymorphic rendering.

**Resolution (Claude's discretion):** For revalidation action buttons, apply the Button variant CSS classes directly to native `<button>` elements using `cn()`. The `variants` record is not exported from `Button.tsx`, so replicate the class strings inline or create a helper. The `Button` component can be used for the "Change secret" link and any navigation elements.

**Practical approach:** Extract the class strings from `Button.tsx` variants and apply them to `<button>` elements:
- "Refresh All" → primary style classes: `bg-white text-black hover:opacity-85 text-button tracking-button px-[34px] py-4 font-body uppercase transition-all duration-150 hover:-translate-y-px`
- Individual tag buttons → outline style: `border border-silver text-silver hover:bg-silver hover:text-background text-button tracking-button px-[34px] py-4 font-body uppercase transition-all duration-150 hover:-translate-y-px`

### Pattern 5: Inline SVG Icons for Button States

**What:** Replace button text content with inline SVG during loading/success/error states. The project uses inline SVGs throughout (see existing `NotFoundIllustration` in `not-found.tsx`).

**Spinner SVG (CSS animation):** A rotating circle using `animation: spin 1s linear infinite`. Add `@keyframes spin` to `globals.css` alongside existing `skeleton-sweep`.

```tsx
// Spinner — CSS animated, no JS
function Spinner() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Success checkmark
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Error X
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
```

Add to `globals.css`:
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Pattern 6: 404 Circuit-Board SVG Illustration

**What:** A static SVG with CSS animation on the broken node. Keeps `not-found.tsx` as a server component (no `'use client'` needed — CSS animation requires no JS).

**Design brief (from CONTEXT.md):**
- Circuit traces leading to a disconnected/broken node
- Broken node is the visual anchor — draws the eye
- Gentle pulse on the broken node — CSS `@keyframes` only

**SVG approach:** Use `stroke-dasharray` + `stroke-dashoffset` on trace lines for "drawing" effect, OR use opacity pulse on the broken node circle. The `@keyframes pulse-node` approach is simpler and aligns with the "gentle pulse" description.

```tsx
// Source: inferred from project SVG patterns (not-found.tsx existing illustration)
// CSS animation added via <style> tag (server component safe) or globals.css

function CircuitBrokenIllustration() {
  return (
    <>
      <style>{`
        @keyframes pulse-node {
          0%, 100% { opacity: 0.3; r: 5; }
          50% { opacity: 0.8; r: 7; }
        }
        .broken-node {
          animation: pulse-node 2.5s ease-in-out infinite;
        }
      `}</style>
      <svg
        width="120" height="100" viewBox="0 0 120 100"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-label="Circuit board with disconnected node"
      >
        {/* Horizontal trace — left side, leads nowhere */}
        <line x1="8" y1="50" x2="45" y2="50" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Junction node — connected */}
        <circle cx="45" cy="50" r="3" fill="#C0C0C0" fillOpacity="0.4" stroke="#C0C0C0" strokeWidth="1" />
        {/* Vertical trace — up */}
        <line x1="45" y1="50" x2="45" y2="20" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Top connected node */}
        <circle cx="45" cy="20" r="3" fill="#C0C0C0" fillOpacity="0.4" stroke="#C0C0C0" strokeWidth="1" />
        {/* Horizontal trace — top, to the right */}
        <line x1="45" y1="20" x2="75" y2="20" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Vertical trace — down from top junction */}
        <line x1="75" y1="20" x2="75" y2="50" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Broken trace — gap before the disconnected node */}
        <line x1="45" y1="50" x2="68" y2="50" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" strokeDasharray="4 3" />
        {/* Gap marker — the break point (small perpendicular lines) */}
        <line x1="72" y1="46" x2="72" y2="54" stroke="#C0C0C0" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
        {/* Broken/disconnected node — the visual anchor, pulsing */}
        <circle className="broken-node" cx="85" cy="50" r="5" fill="none" stroke="#C0C0C0" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Right trace — continues past the broken node */}
        <line x1="75" y1="50" x2="75" y2="80" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Bottom node */}
        <circle cx="75" cy="80" r="3" fill="#C0C0C0" fillOpacity="0.4" stroke="#C0C0C0" strokeWidth="1" />
        {/* Bottom horizontal trace */}
        <line x1="75" y1="80" x2="112" y2="80" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      </svg>
    </>
  )
}
```

**Server component safety:** Inline `<style>` tags are valid in React server components. The animation runs purely in CSS. No `'use client'` required for `not-found.tsx`.

**`prefers-reduced-motion` compliance:** Add to the `<style>` block:
```css
@media (prefers-reduced-motion: reduce) {
  .broken-node { animation: none; opacity: 0.5; }
}
```

### Pattern 7: not-found.tsx vs ErrorPage component

**Critical finding:** The current `not-found.tsx` does NOT use `ErrorPage`. It has its own layout that closely mirrors ErrorPage but with differences:
- `not-found.tsx` uses `text-stat` (96px) for "404" heading
- `ErrorPage` uses `text-tier` (40px) with `uppercase` for its title

The locked decision says to "reuse the existing ErrorPage component." However, using ErrorPage would render "404" at 40px instead of 96px, which is a visual regression. The planner should be aware of this tension.

**Recommendation:** Keep `not-found.tsx` self-contained (as it currently is). Replace only `NotFoundIllustration` with the new circuit-board SVG. This avoids the font-size regression and keeps the server-component purity (ErrorPage has `'use client'` at the top due to the `onRetry` button handler — adopting it would force not-found.tsx to become a client component or require splitting).

**Planner note:** If the locked decision to "reuse ErrorPage" is interpreted strictly, the planner must address the `text-stat` vs `text-tier` heading size difference and the `'use client'` cascade. The safer interpretation is that the intent was to avoid duplicating layout, not to force adoption of a component with an incompatible type signature.

### Anti-Patterns to Avoid

- **Global loading lock:** Setting a single `disabled={loading}` on all buttons blocks parallel operation — the locked decision explicitly requires per-button independence.
- **State mutation instead of Map spread:** `setStatuses(prev => { prev.set(key, val); return prev })` doesn't trigger re-render because reference is unchanged. Always return `new Map(prev)`.
- **Timer leak:** Setting a `setTimeout` in an event handler without cleanup causes stale state updates on unmounted components. Use `timersRef` pattern.
- **Using Button component as `<button>`:** `Button` is always `<a>`. Using it for click actions without `href` is semantically wrong and will cause accessibility lint errors.
- **`'use client'` on not-found.tsx for animation:** CSS animations don't need JavaScript. Adding `'use client'` would prevent Next.js from serving the 404 as a static error response.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auto-dismiss timer | Custom event bus / context | `setTimeout` + `useRef` cleanup | Simple, correct, established in codebase |
| Spinner animation | Canvas or JS requestAnimationFrame | CSS `@keyframes spin` | CSS is sufficient; JS animation adds bundle weight and hydration cost |
| Icon library | Install Heroicons or Lucide | Inline SVG (3 icons total) | Phase adds 0 dependencies; inline SVGs are already the project pattern |
| Per-button status | Redux / Zustand / Context | `useState<Map<string, ButtonStatus>>` | Admin page is a single component; no cross-component state sharing needed |

**Key insight:** All UX requirements (spinners, auto-dismiss, 401 redirect) are achievable with React's built-in primitives and existing CSS. Installing any new library for a 3-icon, 2-file change would be over-engineering.

---

## Common Pitfalls

### Pitfall 1: Map Reference Equality Trap
**What goes wrong:** `setStatuses(prev => { prev.set(key, val); return prev })` — React bails out of re-render because `prev === prev`.
**Why it happens:** Maps are objects; mutating without creating a new reference doesn't signal change to React.
**How to avoid:** Always `return new Map(prev).set(key, val)`.
**Warning signs:** Button status doesn't visually update even though `setStatus` was called.

### Pitfall 2: "Refresh All" Key Collision
**What goes wrong:** Using `''` or `undefined` as the "Refresh All" map key — could collide with empty-tag states.
**How to avoid:** Use a distinct sentinel: `const ALL_KEY = '__all__'`.

### Pitfall 3: Timer Accumulation on Rapid Clicks
**What goes wrong:** User clicks a button 3 times quickly — 3 separate `setTimeout` fire, causing the status to flip multiple times.
**How to avoid:** Clear the existing timer for a key before setting a new one (Pattern 2 above).

### Pitfall 4: 401 Reset Races With Success Timer
**What goes wrong:** 401 fires, 2 s reset timer starts. Meanwhile another button's 3 s success timer fires and sets its status after the state has been cleared, causing a ghost state.
**How to avoid:** `resetToPrompt()` must call `timersRef.current.forEach(id => clearTimeout(id))` to cancel all pending timers before clearing state.

### Pitfall 5: CSS Animation in Server Component via globals.css Keyframe Name Conflict
**What goes wrong:** If `@keyframes spin` is defined twice (e.g., some Tailwind utility already provides it), specificity conflicts may cause unexpected behavior.
**How to avoid:** Check `globals.css` before adding — currently it only has `skeleton-sweep`. Adding `spin` is safe. Alternatively, use a unique name like `icon-spin`.

### Pitfall 6: ErrorPage `'use client'` Cascade
**What goes wrong:** If `not-found.tsx` imports `ErrorPage`, it inherits `'use client'` from ErrorPage.tsx (line 1 of that file). This turns the 404 page into a client component, which changes how Next.js handles static 404 responses.
**How to avoid:** Keep `not-found.tsx` self-contained. Replace only the `NotFoundIllustration` function.

---

## Code Examples

### Complete Per-Button State Shape

```typescript
// Source: analysis of src/app/admin/revalidate/page.tsx + React patterns
type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

// Key for each CONTENT_TYPES entry = tag string (e.g., 'notion:blog')
// Key for Refresh All = '__all__'
const ALL_KEY = '__all__'

const [statuses, setStatuses] = useState<Map<string, ButtonStatus>>(new Map())

function setStatus(key: string, status: ButtonStatus) {
  setStatuses(prev => new Map(prev).set(key, status))
}
```

### Secret Prompt with Hint Message

```tsx
// Source: analysis of src/app/admin/revalidate/page.tsx — extend with hint state
const [showSecretHint, setShowSecretHint] = useState(false)

// In prompt UI:
{showSecretHint && (
  <p className="text-amber-400 text-xs mb-3">
    Secret was invalid or has been rotated. Please re-enter.
  </p>
)}
```

### Button Render with Status

```tsx
// Source: pattern derived from project conventions
function ButtonContent({ status, label }: { status: ButtonStatus; label: string }) {
  if (status === 'loading') return <Spinner />
  if (status === 'success') return <CheckIcon />
  if (status === 'error') return <XIcon />
  return <>{label}</>
}

// Usage in grid:
{CONTENT_TYPES.map(({ label, tag }) => (
  <button
    key={tag}
    onClick={() => handleRevalidate(tag, [tag])}
    disabled={getStatus(tag) === 'loading'}
    className="... outline button styles ..."
  >
    <ButtonContent status={getStatus(tag)} label={label} />
  </button>
))}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single `loading` boolean | Per-button `Map<string, ButtonStatus>` | This phase | Parallel operations, no global lock |
| Inline `result` text message | SVG icon in button (spinner/check/X) | This phase | Better spatial feedback, less visual noise |
| Generic error message on 401 | 401-specific reset flow with hint | This phase | Prevents confusing redirect loop |
| Generic SVG compass illustration | Circuit-board traces + broken node | This phase | Matches SAGIE tech aesthetic |

---

## Open Questions

1. **ErrorPage vs self-contained not-found.tsx**
   - What we know: ErrorPage has `'use client'`; uses `text-tier` (40px); not-found.tsx currently uses `text-stat` (96px).
   - What's unclear: Whether the locked decision intends strict component reuse or just visual consistency.
   - Recommendation: Planner should interpret as visual consistency intent and keep not-found.tsx self-contained. Document the rationale.

2. **Hint message amber color**
   - What we know: Admin page uses gray-950 dark aesthetic. `text-amber-400` is a reasonable warning color not currently defined as a theme token.
   - What's unclear: Whether to use an existing theme token or a direct Tailwind color.
   - Recommendation: Use `text-amber-400` directly — admin page is not a marketing surface; exact brand token alignment is less critical than clarity.

3. **Button variant classes duplication**
   - What we know: `variants` in `Button.tsx` is not exported. Admin action buttons are `<button>` elements, not `<a>`.
   - What's unclear: Whether to export `variants` from `Button.tsx` or inline the class strings in the admin page.
   - Recommendation: Inline the class strings in the admin page. It's a single internal tool page; DRY at this scale adds indirection without benefit. If Button.tsx evolves, admin page is a low-priority update.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (configured in `vitest.config.ts`) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/lib/__tests__/revalidate.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| POL-01 | Per-button state map — each button gets independent status | manual-only | (no unit test; pure React UI state) | N/A — UI behavior |
| POL-02 | 401 response resets to prompt | unit | `npx vitest run src/lib/__tests__/revalidate.test.ts` | ✅ (existing test covers 401 response from API route) |
| POL-03 | Custom 404 illustration renders | manual-only | (visual check; navigate to /nonexistent) | N/A — visual |

**Note on POL-01/POL-03 automation:** These are client-side UI concerns (React state transitions and SVG rendering). The project's Vitest config is `environment: 'node'` with `include: ['src/**/*.test.ts']` — `.tsx` test files are excluded by the `.ts` glob. Playwright e2e tests exist (Phase 4) but do not cover admin or 404 pages. Manual verification via browser is the appropriate gate for both.

**Existing coverage confirmed:** `src/lib/__tests__/revalidate.test.ts` already tests 401 from the API side. POL-02's 401 handling is purely client-side (admin page detects status and resets UI), which is not covered by existing tests. No new unit test is required — the API already has 401 coverage, and the UI reset is a manual smoke test.

### Sampling Rate
- **Per task commit:** `npx vitest run src/lib/__tests__/revalidate.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green + manual browser smoke test before `/gsd:verify-work`

### Wave 0 Gaps
None — existing test infrastructure covers the testable API behavior. UI state and SVG illustration are verified manually.

---

## Sources

### Primary (HIGH confidence)
- Direct file reads: `src/app/admin/revalidate/page.tsx` — current state architecture, all button/state patterns
- Direct file reads: `src/app/api/revalidate/route.ts` — confirmed 401 response shape `{ error: 'Unauthorized' }` with `status: 401`
- Direct file reads: `src/app/not-found.tsx` — current illustration + layout
- Direct file reads: `src/components/ui/ErrorPage.tsx` — confirmed `'use client'`, heading size token, prop interface
- Direct file reads: `src/components/ui/Button.tsx` — confirmed `<a>` only, `ButtonVariant` types, class strings
- Direct file reads: `src/app/globals.css` — confirmed `@keyframes skeleton-sweep` exists, no `spin` keyframe yet
- Direct file reads: `vitest.config.ts` — confirmed `include: ['src/**/*.test.ts']` (tsx excluded), `environment: 'node'`
- Direct file reads: `src/lib/__tests__/revalidate.test.ts` — confirmed existing 401 test coverage

### Secondary (MEDIUM confidence)
- React docs: `useState` with Map pattern — established community pattern for per-item async state
- MDN CSS: `@keyframes` in `<style>` tags in server components — valid HTML, no JS dependency

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed by direct file reads; no new dependencies
- Architecture: HIGH — all patterns derived from reading actual source files
- Pitfalls: HIGH — all identified from direct code inspection (Map mutation trap, ErrorPage 'use client', etc.)

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable React/CSS patterns; nothing fast-moving)
