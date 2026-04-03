# Conventions

## Naming

### Files
- **Components**: PascalCase (`Hero.tsx`, `MembershipForm.tsx`)
- **Utilities**: camelCase (`notion.ts`, `schema.ts`)
- **Routes**: kebab-case directory segments (`src/app/become-a-member/`)
- **Test files**: `*.test.ts` in `__tests__/` directories

### Functions & Variables
- camelCase for functions and variables
- UPPER_CASE for constants
- Boolean prefixes: `is*`, `has*`

### Types
- PascalCase for interfaces and type aliases
- `readonly` modifiers on data types
- Zod schemas for runtime validation with inferred TypeScript types

## Import Organization

Standard ordering:
1. Third-party packages
2. Type imports (`import type`)
3. Internal modules via `@/` path alias (configured in `tsconfig.json`)

## Code Style

### Components
- Functional components with arrow functions
- Props destructured in function signature
- Default exports for page components, named exports for reusable components
- Client components marked with `"use client"` directive

### Styling
- Tailwind CSS utility classes
- `cn()` helper (clsx + tailwind-merge) for conditional class composition
- CSS modules for complex animations (`*.module.css`)
- Design tokens via CSS custom properties

### State Management
- React hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- No external state management library
- Server components as default, client components only when needed

## Error Handling

### API Routes
- try/catch with `console.error` for logging
- Standard HTTP status codes: 400 (bad request), 422 (validation), 500 (server error)
- Structured JSON error responses

### Client-Side
- Error boundaries for component-level failures
- Sentry integration for production error tracking (`@sentry/nextjs`)

## Logging

- Console-based logging (`console.error`, `console.log`)
- Sentry for production error monitoring
- No structured logging library

## Async Patterns

- `async/await` with typed `Promise` returns
- `void` prefix for fire-and-forget operations
- Server Actions for form submissions

## Comments

- JSDoc for public API functions
- RFC references where applicable
- Section separator comments (`// ─── Section ───`) for long files
- Minimal inline comments; code should be self-documenting
