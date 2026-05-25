# 68_TESTING_AND_VALIDATION_GATE.md — Testing and Validation Gate

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file defines the minimum validation required before a phase is considered complete.

## 2. Mandatory Scripts
The repository should expose these scripts as real commands when relevant:
```json
{
  "lint": "next lint or eslint .",
  "typecheck": "tsc --noEmit",
  "build": "next build",
  "test": "vitest or jest",
  "test:e2e": "playwright test",
  "db:reset": "supabase db reset",
  "db:types": "supabase gen types typescript ...",
  "seo:check": "tsx scripts/validate-seo.ts",
  "routes:check": "tsx scripts/validate-routes.ts",
  "env:check": "tsx scripts/validate-env.ts"
}
```
If a script is not yet implemented, the agent must either implement a minimal real version in the correct phase or report it as unavailable. It must not create fake green commands.

## 3. Phase Minimums
### Phase 1
- install
- lint
- typecheck
- build
- route check for `/en/om` and `/ar/om`

### Phase 2
- migration reset/apply
- seed apply
- generated DB types
- no duplicate canonical tables

### Phase 3
- RLS validation script or manual SQL tests
- unauthorized write tests for protected tables

### Phase 4
- build
- route check
- sitemap check
- robots check
- hreflang/canonical check
- structured data smoke check

### Phase 5+
- auth/permission tests
- admin route protection checks
- provider ownership checks

## 4. Smoke Test Routes
Required public routes after Phase 4:
```txt
/en/om
/ar/om
/en/om/centers
/ar/om/centers
/en/om/doctors
/ar/om/doctors
/en/om/centers/dentistry/al-khuwair
/ar/om/centers/dentistry/al-khuwair
```
Invalid routes must not silently render:
```txt
/fa/om
/hi/om
/en/centers
/ar/doctors
/en/dentist/al-khuwair
```

## 5. No Fake Tests
Forbidden:
- tests that only assert `true === true`
- skipped tests for required behavior
- empty test files
- marking tests TODO and claiming phase completion

## 6. Validation Report
Each phase must include:
```md
## Commands run
| Command | Result | Notes |
|---|---|---|

## Failed/Unavailable commands
| Command | Reason | Required fix |
|---|---|---|
```
