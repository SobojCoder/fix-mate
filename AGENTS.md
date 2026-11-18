<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FixMate

Handyman/repair-services app: Next.js 16 (App Router, `src/`), React 19, Better Auth, MongoDB. Single package, no tests, no CI.

## Commands

- `npm run dev` / `npm run build` / `npm run start` — standard Next.js.
- `npm run lint` — ESLint 9 flat config (`eslint-config-next`). There is **no** typecheck script; verify types with `npx tsc --noEmit` before finishing.
- Dev and build both run on Turbopack; Tailwind 4 is wired as a Turbopack rule in `next.config.ts` (no `postcss.config`, no `tailwind.config` — styles live in `src/app/globals.css`).

## Experimental Next.js flags (in `next.config.ts`)

`cacheComponents`, `partialPrefetching`, and `reactCompiler` are on:

- With `cacheComponents`, async data access must be cacheable or wrapped for streaming (`use cache` / Suspense) or the build fails.
- React Compiler means no manual memoization (`useMemo`, `useCallback`, `memo`) — write plain hooks that follow the Rules of React.

## Auth (Better Auth)

Three wiring points, keep them in sync:

- Server config: `src/lib/auth.ts` (MongoDB adapter; connects via `BETTER_AUTH_DB_URL` and selects db `FixMate` explicitly — the URI has no db path, so `client.db()` would silently land in `test`)
- Client: `src/lib/auth-client.tsx` (`baseURL` from `BETTER_AUTH_URL`)
- Catch-all route handler: `src/app/api/auth/[...all]/route.ts`

Env vars in `.env`: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_DB_URL` (remote MongoDB with credentials; local mongod on 27017 is NOT running). Email/password only — no social providers configured.

Auth gotchas:

- `<Toaster />` (react-hot-toast) is mounted in the **root layout** — auth pages rely on it for error/success feedback; toasts silently do nothing without it.
- API error shapes: duplicate email → 422 `USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL`; password < 8 chars → 400 `PASSWORD_TOO_SHORT`.

## UI conventions

- shadcn with style `base-nova` (see `components.json`) — components are built on **Base UI** (`@base-ui/react`), not Radix; don't import Radix packages.
- Add components with `npx shadcn@latest add <name>`; they land in `src/components/ui`, utility in `@/lib/utils` (`cn`).
- Path alias: `@/*` → `./src/*`.

## Gotchas

- Root layout (`src/app/layout.tsx`) renders `Footer` globally but only **imports** `Navbar` — it is never rendered there. Pages add it themselves (`src/app/page.tsx` renders it; `src/app/(Home)/layout.tsx` also does but wraps no routes). Result: `/sign-up` and `/sign-in` currently have **no navbar**. Don't assume one exists; check before adding or deduping.
- `src/app/(Home)/layout.tsx` wraps no routes (the route group contains no page) — likely in-progress home-page migration. Check intent before relying on or "cleaning up" it.
