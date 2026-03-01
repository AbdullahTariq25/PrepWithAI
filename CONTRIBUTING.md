# Contributing to PrepWithAI

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your API keys
4. Seed the database: `npx tsx src/scripts/seed-questions.ts`
5. Start the dev server: `npm run dev`

## Branch Naming

Use descriptive branch names:

- `feature/voice-mode-improvements` — New features
- `fix/session-timeout-bug` — Bug fixes
- `docs/api-endpoints` — Documentation
- `refactor/auth-flow` — Code refactoring

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add voice speed control to interview mode
fix: resolve session not saving on disconnect
docs: update environment variable documentation
refactor: extract email templates to separate files
chore: update dependencies
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, focused commits
3. Run `npm run lint` and `npm run build` before submitting
4. Open a PR with a clear description of what changed and why
5. Link any related issues

## Code Style

- **TypeScript** — All code must be typed (no `any` unless absolutely necessary)
- **Server Components** — Default to server components; use `"use client"` only when needed
- **Tailwind CSS v4** — Use Tailwind utilities; avoid inline styles
- **Dark Theme** — All UI must work on the dark theme (`bg-[#080808]`, `text-[#F5F5F5]`)
- **Error Handling** — Always handle errors gracefully with user-friendly messages
- **Imports** — Use `@/` path aliases (e.g., `@/lib/utils`, `@/components/ui/button`)

## Project Structure

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — Reusable React components
- `src/lib/` — Utility functions and configurations
- `src/models/` — Mongoose database models
- `src/hooks/` — Custom React hooks

## Adding New Features

When adding a new feature:

1. Create the API route in `src/app/api/`
2. Create the page in `src/app/(dashboard)/`
3. Add any new models in `src/models/`
4. Update constants in `src/lib/constants.ts` if applicable
5. Add analytics events in `src/components/providers/posthog-provider.tsx`

## Need Help?

Open an issue or start a discussion. We're happy to help!

---

**Thank you for making PrepWithAI better! 💜**
