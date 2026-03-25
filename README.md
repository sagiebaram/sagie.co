# sagie.co

Marketing site for **S.A.G.I.E** — built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 6
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP + Motion (Framer Motion)
- **3D:** Three.js / react-globe.gl
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Project Structure

```text
src/
├── app/              # Next.js App Router pages & layout
├── components/
│   ├── layout/       # Navbar, Footer
│   ├── sections/     # Hero, Pillars, Tiers, FAQ, etc.
│   └── ui/           # Reusable UI components
├── constants/        # Copy & persona data
└── types/            # TypeScript type definitions
```
