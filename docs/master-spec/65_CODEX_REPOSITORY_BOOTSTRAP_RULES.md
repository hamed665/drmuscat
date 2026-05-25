# 65_CODEX_REPOSITORY_BOOTSTRAP_RULES.md — Repository Bootstrap Rules

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file defines how to create or validate the DrMuscat repository before business features are implemented.

## 2. Preferred Stack
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Supabase
- Server Components for public SEO pages where possible
- Client Components only where interactivity requires them
- English/Arabic i18n from day one
- RTL support from day one
- Vercel deployment target unless explicitly changed

## 3. Repository Shape
Preferred simple structure for MVP:
```txt
/drmuscat
  /docs
    /master-spec
  /src
    /app
    /components
    /lib
    /server
    /styles
  /supabase
    /migrations
    /seed
  /scripts
  /tests
    /unit
    /e2e
  .env.example
  package.json
  README.md
```

A monorepo is allowed only if explicitly approved. Do not create unnecessary packages just to look enterprise. Software architecture is not interior decoration.

## 4. Required Baseline Files
The agent must create or validate:
- `package.json`
- `next.config.ts` or `next.config.mjs`
- `tsconfig.json` with strict mode
- `eslint.config.*` or standard Next ESLint config
- `tailwind.config.ts`
- `postcss.config.*`
- `.env.example`
- `.gitignore`
- `README.md`
- `src/middleware.ts` for locale/country routing if needed
- `src/lib/routes/*`
- `src/lib/i18n/*`
- `src/lib/supabase/*`
- `src/lib/seo/*`
- `src/components/ui/*`

## 5. Package Manager Lock
The agent must detect or choose exactly one package manager:
- Prefer `pnpm` if no lockfile exists.
- If `package-lock.json` exists, use npm.
- If `yarn.lock` exists, use yarn.
- Never mix lockfiles.

## 6. Node Version
Create `.nvmrc` or `engines.node` if absent. Recommended:
```txt
20.x
```

## 7. Environment Contract
`.env.example` must include placeholders only:
```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_DEFAULT_COUNTRY=om
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ar
NEXT_PUBLIC_SUPPORTED_COUNTRIES=om
```

No real keys may be committed.

## 8. Bootstrap Validation
After bootstrap, run:
```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
```
If commands do not exist, create real scripts or report missing scripts. Do not fake scripts that always pass.

## 9. Phase 0 Output
Before implementing Phase 1, produce:
- Repository readiness report
- File tree proposal
- Package manager decision
- Node version decision
- Environment variable list
- Risks
- Commands to run

Then stop for approval.
