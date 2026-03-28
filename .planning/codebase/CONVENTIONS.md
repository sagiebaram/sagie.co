# Code Conventions

## Language & Style

- **TypeScript** throughout, with strict typing for data models in `src/types/index.ts`
- `readonly` fields on all interface properties
- `as const` assertions on constant objects (e.g., `FORM_IDS`)
- Functional components only (no class components)
- Arrow functions for inline handlers, named `function` declarations for components

## Component Patterns

### Client vs Server Components
- Pages in `src/app/(marketing)/` are server components by default
- Interactive components use `'use client'` directive at top of file
- Forms, animations, and filter components are all client-side
- Data fetching happens in server components (page-level)

### Form Pattern
- Forms use `useState` for field state as a flat object
- `set` helper: `const set = (key: string) => (value: string) => setFields(prev => ({ ...prev, [key]: value }))`
- Client-side validation with `validate()` returning error object
- `handleSubmit` async function with try/catch
- Success state renders `<FormSuccess />` component
- No form libraries (no React Hook Form, no Formik)

### Animation Pattern
- GSAP for all animations (no CSS transitions for scroll-triggered effects)
- `useScrollReveal` hook for simple fade-in-up reveals
- `gsap.context()` for complex animations with proper cleanup via `ctx.revert()`
- `prefers-reduced-motion` check before applying animations
- `ScrollTrigger` for scroll-based triggers

### Section Components
- Each homepage section is a standalone component in `src/components/sections/`
- Sections import their copy from `src/constants/copy.ts`
- Standard pattern: section wrapper → content layout → child components

## Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Constants: `camelCase.ts` files, `UPPER_CASE` or `camelCase` exports
- API routes: RESTful `route.ts` with `POST` exports
- CSS classes: Tailwind utility classes, custom classes via `globals.css`

## Error Handling

- API routes: try/catch with `console.error` + generic error JSON response
- Forms: client-side validation errors displayed per-field, generic catch-all for network errors
- No global error boundary configured
- No structured error logging (just `console.error`)

## Imports

- Path alias `@/` maps to `src/`
- Named exports preferred (no default exports except Next.js pages)
- Grouped: external packages → internal components → constants/types

## Tailwind Usage

- Utility-first approach
- Custom theme tokens: `font-display`, `font-body`, `text-hero`, `text-body-lg`
- Color tokens: `foreground-muted`, custom brand colors
- Responsive: mobile-first with `md:` breakpoint for desktop layouts
- Custom backgrounds: `GridBackground`, `CircuitBackground` as overlay components
