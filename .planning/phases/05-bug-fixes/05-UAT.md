---
status: complete
phase: 05-bug-fixes
source: 05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md
started: 2026-03-28T22:00:00Z
updated: 2026-03-28T22:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Blog filter URL params
expected: Go to /blog. Click a category filter. URL updates to /blog?category={value}. Click "All" — URL returns to clean /blog with no params.
result: issue
reported: "URL updates to /blog?category=Personal but it's the same behaviour (filter bug still present). Also node deprecation warning about url.parse()."
severity: major

### 2. Blog two-dimension filter
expected: On /blog, select a category AND an author filter. URL shows both params (e.g. /blog?category=Tech&author=Sagie+Baram). Changing one filter does NOT reset the other.
result: issue
reported: "It shows both params, but the behavior is still the same."
severity: major

### 3. Solutions filter URL params
expected: Go to /solutions. Click a category filter. URL updates to /solutions?category={value}. Click "All" — URL returns to clean /solutions.
result: skipped
reason: Same underlying filter rendering bug as tests 1-2; URL params likely work but rendering broken

### 4. Resources filter URL params
expected: Go to /resources. Click a category filter. URL updates to /resources?category={value}. Click "All" — URL returns to clean /resources.
result: skipped
reason: Same underlying filter rendering bug as tests 1-2

### 5. Events filter URL params
expected: Go to /events. Click a location filter (e.g. "Miami"). URL updates to /events?location=Miami. Click "All" — URL returns to clean /events.
result: skipped
reason: Same underlying filter rendering bug as tests 1-2

### 6. Shareable filter URL
expected: Copy a filtered URL (e.g. /blog?category=Tech), open it in a new tab or paste into browser. The page loads with that filter already active and the correct filter button highlighted.
result: skipped
reason: Depends on filter rendering working correctly

### 7. Filter content renders without blank page
expected: On any filtered page (Blog, Solutions, Resources), click a second filter. The filtered content renders immediately — no blank/white page flash. Items fade in smoothly.
result: skipped
reason: Same underlying filter rendering bug as tests 1-2

### 8. Filter fade animation (visual)
expected: On /blog or /solutions, watch the animation when you first load the page (items should slide up with stagger). Then click a filter — new items should fade in quickly (~200ms) WITHOUT the stagger/slide animation replaying.
result: skipped
reason: Depends on filter rendering working correctly

### 9. Browser back/forward renders correctly
expected: Navigate from /blog to /solutions (or any other page). Hit browser Back. The previous page renders correctly without a blank screen or needing a manual refresh.
result: pass

### 10. Back/forward does NOT replay animations
expected: Visit /blog (animations play). Navigate to another page. Hit Back to return to /blog. Content should appear instantly — no scroll-reveal animations replaying.
result: pass

### 11. Rate limit warning on form
expected: Submit a form (e.g. /apply) more than 5 times quickly to trigger the rate limit. Instead of a silent success or generic red error, you should see an amber/yellow warning message: "You've submitted several times recently. Please wait a few minutes before trying again."
result: issue
reported: "Form at /apply won't submit at all — no indication of what's wrong. No console errors. Can't reach rate limit to test. Pre-existing Zod type error in schemas.ts may be causing API route to fail silently."
severity: blocker

### 12. Submit button disabled after rate limit
expected: After triggering a 429 rate limit on any form, the submit button should be disabled (greyed out / unclickable) for a period of time, then re-enable automatically.
result: skipped
reason: Blocked by test 11 — form submission not working

### 13. Rate limit warning persists during edits
expected: After seeing the rate limit warning, edit a form field. The amber warning message should stay visible — it should NOT disappear when you interact with the form fields.
result: skipped
reason: Blocked by test 11 — form submission not working

## Summary

total: 13
passed: 2
issues: 3
pending: 0
skipped: 8

## Gaps

- truth: "Click a category filter on /blog. URL updates and filtered posts appear correctly."
  status: failed
  reason: "User reported: URL updates to /blog?category=Personal but it's the same behaviour (filter bug still present). Also node deprecation warning about url.parse()."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Select category AND author on /blog. Both URL params appear. Changing one does not reset the other."
  status: failed
  reason: "User reported: It shows both params, but the behavior is still the same."
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Form at /apply submits successfully and shows success or error feedback."
  status: failed
  reason: "User reported: Form won't submit at all — no indication of what's wrong. No console errors. Pre-existing Zod type error in schemas.ts may be causing API route to fail silently."
  severity: blocker
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
