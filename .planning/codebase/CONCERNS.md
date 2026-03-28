# Technical Concerns

## Critical

### Hardcoded Notion Database IDs
- 6 API routes contain hardcoded Notion database IDs directly in source code
- Files: `src/app/api/applications/membership/route.ts`, `chapter/route.ts`, `solutions/route.ts`, `ventures/route.ts`, `src/app/api/submit-post/route.ts`, `src/app/api/submit-resource/route.ts`, `src/app/api/suggest-event/route.ts`
- Should be environment variables for portability and security

### No Server-Side Validation
- All API routes (`src/app/api/`) accept `request.json()` and pass data directly to Notion
- No input sanitization, type checking, or field validation on the server
- Client-side validation in forms can be bypassed
- Missing email format validation

### No Rate Limiting
- All 6+ public POST endpoints have zero rate limiting
- Vulnerable to spam submissions filling Notion databases
- No CAPTCHA or bot protection on any form

## Security

### Input Sanitization
- User input flows directly from `request.json()` to Notion API without sanitization
- No origin/CORS validation on API routes
- No CSRF protection on form submissions

### Unsafe Type Casting
- `src/lib/notion.ts`: `process.env.NOTION_TOKEN as string` — unsafe cast with empty string fallback
- API routes use untyped destructuring from `request.json()` — no runtime validation
- Various `as any` casts in Notion property access patterns

## Performance

### Heavy Client-Side Rendering
- `src/components/GlobeNetwork.tsx`: Three.js 3D globe renders on page load — heavy for mobile
- `src/components/ui/CircuitBackground.tsx`: Generates 60+ canvas paths for decorative background
- No lazy loading for heavy visual components
- No Notion response caching — every page load hits the API

### Missing Optimizations
- No ISR (Incremental Static Regeneration) on content pages
- Blog, events, solutions, resources all fetch fresh from Notion on every request
- No `loading.tsx` skeletons for streaming

## Fragile Areas

### Notion Schema Dependency
- API routes depend on exact Notion database field names (e.g., `'Full Name'`, `'Email'`, `'Category'`)
- If any Notion database schema changes, writes silently produce incorrect data or fail
- No schema validation or error reporting for field mismatches

### Hardcoded Location Mapping
- `src/app/api/applications/membership/route.ts`: `mapLocation()` function has hardcoded city→region mapping
- Only recognizes specific US cities and "Miami", "Tel Aviv", "Israel"
- All other locations fall to "International" — lossy categorization

### Legacy Typeform References
- `src/constants/forms.ts`: Still exports `FORM_IDS` for Typeform
- `src/components/ui/TypeformEmbed.tsx`: Component exists but forms have been replaced with custom forms
- Dead code that should be cleaned up

## Technical Debt

### No Test Coverage
- Zero tests in the project (see TESTING.md)
- High-risk API routes are completely untested

### No Error Monitoring
- Only `console.error` for error reporting
- No Sentry, LogRocket, or similar error tracking
- Production errors would be invisible

### No Environment Configuration Docs
- Multiple env vars needed (`NOTION_TOKEN`, Typeform IDs) but no `.env.example`
- `debug-notion.ts` in project root — appears to be a debug/test file that shouldn't be committed
