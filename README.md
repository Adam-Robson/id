# WEBSITE FOR LE FOG

[![Build & Tests](https://img.shields.io/github/actions/workflow/status/Adam-Robson/id/node.js.yml?branch=main&label=build%20%26%20tests&logo=githubactions&logoColor=white)](https://github.com/Adam-Robson/id/actions/workflows/node.js.yml)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Node](https://img.shields.io/badge/node-%3E%3D24-5FA04E?logo=nodedotjs&logoColor=white)](.nvmrc)
[![Next.js](https://img.shields.io/github/package-json/dependency-version/Adam-Robson/id/next?label=next.js&logo=nextdotjs&logoColor=white&color=000000)](https://nextjs.org)
[![React](https://img.shields.io/github/package-json/dependency-version/Adam-Robson/id/react?label=react&logo=react&logoColor=black&color=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/github/package-json/dependency-version/Adam-Robson/id/dev/typescript?label=typescript&logo=typescript&logoColor=white&color=3178C6)](https://www.typescriptlang.org)
[![Tested with Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Linted with Biome](https://img.shields.io/badge/linted%20with-Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev)
[![Last commit](https://img.shields.io/github/last-commit/Adam-Robson/id)](https://github.com/Adam-Robson/id/commits/main)

This is the repository for the website for the band LE FOG. It is a
Next.js App Router site that streams the band's catalog from Cloudflare
R2, gates downloads behind Clerk authentication, and is deployed on
Vercel.

## Getting Started

The Node version is pinned in `.nvmrc` (Node 24). CI reads the same
file, so local and CI installs produce the same lockfile.

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Fill in `.env.local` before running the dev server. Every variable is
documented in `.env.example`. Live values can be pulled with
`vercel link && vercel env pull .env.local`. Local development must use
the Clerk **development** instance keys (`pk_test_` / `sk_test_`).

Open [localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command              | Purpose                              |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Run the development server           |
| `npm run build`      | Create a production build            |
| `npm run start`      | Serve the production build           |
| `npm run typecheck`  | Generate route types, then run `tsc` |
| `npm run lint`       | Biome lint and format check          |
| `npm run lint:ci`    | Biome check as run in CI             |
| `npm run format`     | Apply Biome formatting               |
| `npm run test`       | Run the Vitest suite once            |
| `npm run test:watch` | Run Vitest in watch mode             |

CI (`.github/workflows/node.js.yml`) runs typecheck, `lint:ci`, build
and test on every push and pull request to `main` and `dev`.

## Project Structure

```text
src/
  app/            Routes, route-level CSS, API routes, metadata
    api/          contact, download and stream handlers
    styles/       Global tokens, base, layout and shared styles
  components/     One component per file
    auth/         Sign-in and sign-up form components
    styles/       One stylesheet per component
  context/        React providers (audio, theme, icons, global)
  lib/
    auth/         Access-level rules
    constants/    One constant per file
    db/r2/        Cloudflare R2 access, one action per file
    hooks/        Client hooks
    types/        One type or interface per file
    utils/        One utility per file
  proxy.ts        Request proxy (Clerk)
tests/            Vitest suites grouped by feature, plus helpers
```

The logo is static files in `public/images/logo/`: `wordmark.svg`, the
lettering, used as a CSS mask so it takes the theme's text colour, and one
`orb-<colourway>.webp` per colour in `LOGO_ORBS`. The orb's place inside
the wordmark is in `src/lib/constants/logo-geometry.ts`. Icons and the
share image use Next's file conventions in `src/app/`, apart from the
manifest's PNG icons in `public/favicon/`.

## Source Code Standards

The full standards live in `.claude/CLAUDE.md`. In short:
- Files are capped at **200 lines**.
- Single quotes in all JS/TS files; indentation is **2 spaces**.
- The codebase follows **SOLID** principles. Actions, types, constants,
  utilities and components each live in their own file and are shared
  through imports and exports.
- Related functionality is grouped in nested folders under a common
  parent.
- Fix the root cause of a problem. Do not silence the linter or
  formatter with comments, and do not paper over issues with overrides.
- Tests explain why a behavior exists and why it works.

## Deployment

The site is deployed on the [Vercel Platform](https://vercel.com).
Environment variables are managed in Vercel and pulled locally with
`vercel env pull`.
