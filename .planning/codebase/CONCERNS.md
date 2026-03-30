# Concerns

## Tech Debt

### Missing Notion Property Handling
- **Location**: `src/lib/notion.ts`, `src/lib/schema.ts`
- **Issue**: Some Notion page properties may be missing or renamed, causing silent data loss during transformation
- **Impact**: Medium — events or member data could render with missing fields
- **Fix**: Add explicit property existence checks with logging for missing expected properties

### In-Memory Rate Limiter
- **Location**: `src/lib/rate-limit.ts`
- **Issue**: Rate limiting uses in-memory Map, resets on every serverless cold start
- **Impact**: Low — rate limiting is inconsistent in serverless environment
- **Fix**: Move to Redis-based rate limiting or accept limitation for current scale

### Globe Memory Leak Potential
- **Location**: `src/components/Globe.tsx`
- **Issue**: Three.js renderer and scene not fully cleaned up on component unmount
- **Impact**: Medium — memory grows on repeated navigation to/from globe page
- **Fix**: Ensure `renderer.dispose()`, geometry/material disposal in cleanup effect

## Form UX Issues (from Phase 5 UAT)

### Multi-Select Role Field
- **Issue**: Role selection should allow multiple selections but uses single select
- **Impact**: Medium — users can't accurately represent multiple roles
- **Fix**: Switch to multi-select checkbox group component

### Referral Source Dropdown
- **Issue**: "How did you hear about us?" should be a dropdown, not free text
- **Impact**: Low — data quality issue for analytics
- **Fix**: Replace text input with predefined dropdown options

### Generic Error Messages
- **Issue**: Form validation errors are generic ("Required") instead of contextual
- **Impact**: Medium — poor user experience on validation failures
- **Fix**: Add field-specific error messages to Zod schemas

## Security

### Honeypot Timing Check
- **Location**: `src/app/api/membership/route.ts`
- **Issue**: Honeypot timing threshold may be too strict, rejecting legitimate fast submissions
- **Impact**: Low — potential false positives blocking real users
- **Fix**: Tune threshold based on real submission timing data

### Missing Input Sanitization
- **Location**: API routes handling form submissions
- **Issue**: User-provided strings passed to email templates without HTML sanitization
- **Impact**: Medium — potential HTML injection in emails
- **Fix**: Sanitize all user inputs before embedding in HTML email templates

### Hardcoded Admin Email
- **Location**: `src/app/api/membership/route.ts`
- **Issue**: Admin notification email address hardcoded rather than environment variable
- **Impact**: Low — requires code change to update recipient
- **Fix**: Move to environment variable

## Performance

### CircuitBackground Scaling
- **Location**: `src/components/CircuitBackground.tsx`
- **Issue**: Canvas-based animation may not scale well on high-DPI displays or large viewports
- **Impact**: Low-Medium — potential frame drops on lower-end devices
- **Fix**: Add resolution scaling factor, reduce particle count on mobile

### Globe Type Safety
- **Location**: `src/components/Globe.tsx`
- **Issue**: Globe data types use `any` in several places, bypassing TypeScript checks
- **Impact**: Low — runtime errors possible from unexpected data shapes
- **Fix**: Add proper typing for globe arc/point data

## Fragile Areas

### EventsPageClient Error Handling
- **Location**: `src/components/EventsPageClient.tsx`
- **Issue**: Error state shows generic message, no retry mechanism
- **Impact**: Medium — users stuck on error with no recovery path
- **Fix**: Add retry button, more specific error messaging

### Checkbox Accessibility
- **Location**: Custom checkbox/radio group components
- **Issue**: Custom styled checkboxes may not properly convey state to screen readers
- **Impact**: Medium — accessibility compliance issue
- **Fix**: Audit with screen reader, ensure proper ARIA attributes

### HTML Injection in Dynamic Content
- **Location**: Components rendering Notion-sourced content
- **Issue**: Rich text from Notion rendered with `dangerouslySetInnerHTML` equivalent patterns
- **Impact**: Medium — if Notion content is compromised, XSS possible
- **Fix**: Sanitize Notion rich text output before rendering

## Missing Features

### No Notion Sync Monitoring
- **Issue**: No way to detect when Notion API sync fails or returns stale data
- **Impact**: Medium — site could show outdated content without anyone knowing
- **Fix**: Add health check endpoint, stale data detection with alerting

### No Analytics Tracking
- **Issue**: No page view or interaction analytics beyond Sentry error tracking
- **Impact**: Low — no visibility into user behavior or feature usage
- **Fix**: Add lightweight analytics (Plausible, PostHog, or similar)

## Test Gaps

### API Error Paths Untested
- **Issue**: API route error handling (rate limit, validation, Notion failures) not covered by tests
- **Impact**: Medium — error paths could silently break
- **Fix**: Add test cases for error responses in API routes

### No E2E Tests
- **Issue**: No Playwright or Cypress tests for critical user flows
- **Impact**: Medium — regressions in form submission, navigation, etc. caught late
- **Fix**: Add E2E tests for membership form, events page, navigation

### Validation Edge Cases
- **Issue**: Zod schema validation tested with happy paths but edge cases (empty strings, Unicode, max length) not covered
- **Impact**: Low — potential unexpected validation behavior
- **Fix**: Add property-based or edge-case test data
