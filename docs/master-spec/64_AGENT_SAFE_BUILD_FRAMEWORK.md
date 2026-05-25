# 64_AGENT_SAFE_BUILD_FRAMEWORK.md — Agent-Safe Build Framework

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
V10.4 exists to reduce implementation failure when DrMuscat is built from zero by an AI coding agent. The agent must not treat the 70+ document package as an invitation to implement everything at once. The package is a canonical specification; implementation must be phase-gated, auditable, and test-driven.

## 2. Highest-Priority Rule
If this file conflicts with any older file, this file wins for build execution process. Product decisions still come from the canonical product/database/SEO files, but build behavior, stop conditions, and approval checkpoints come from V10.4.

Priority for execution:
1. `64_AGENT_SAFE_BUILD_FRAMEWORK.md`
2. `77_FINAL_BUILD_FROM_ZERO_PROMPT.md`
3. `76_HUMAN_APPROVAL_CHECKPOINTS.md`
4. `68_TESTING_AND_VALIDATION_GATE.md`
5. `67_DATABASE_MIGRATION_PROTOCOL.md`
6. `66_PHASE_LOCKS_AND_ALLOWED_FILE_CHANGES.md`
7. `72_SECURITY_RLS_AND_SECRET_HANDLING_PROTOCOL.md`
8. `73_SEO_BUILD_VALIDATION_PROTOCOL.md`
9. `58_CODEX_PHASED_BUILD_MASTER_PLAN.md`
10. `59_DATABASE_CANONICAL_PATCH_V10_3.md`
11. `25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md`

## 3. Non-Negotiable Agent Behavior
The agent must:
- Work in one phase at a time.
- List planned file changes before editing.
- Run validation commands after every phase.
- Produce a phase completion report.
- Stop at human approval checkpoints.
- Never silently resolve conflicts affecting schema, routing, RLS, SEO, billing, payments, appointments, insurance, provider ownership, or sponsored ranking.
- Never invent unapproved routes, tables, roles, enums, payment flows, AI features, or public SEO languages.

The agent must not:
- Build the whole platform in one pass.
- Continue after failed migrations, typechecks, lints, tests, or builds.
- Disable TypeScript, ESLint, RLS, middleware, validation, or tests to force green output.
- Use `any`, `// @ts-ignore`, broad try/catch swallowing, fake tests, fake buttons, hardcoded admin users, or mock-only saves unless explicitly marked demo-only and outside required MVP behavior.
- Commit secrets or paste secrets into code.

## 4. Build Modes
Allowed modes:

### SAFE_REVIEW_ONLY
Read and report only. No code edits. Used before any implementation.

### PHASED_BUILD_ONLY
Implement exactly one approved phase. Stop after the phase report.

### PATCH_ONLY
Fix a named blocker. Do not expand scope.

### REVIEW_DIFF_ONLY
Review existing changes. Do not modify files.

Forbidden modes:
- `BUILD_ALL`
- `BEST_EFFORT_FULL_PLATFORM`
- `SKIP_TESTS`
- `IGNORE_SCHEMA_CONFLICTS`

## 5. Stop Immediately If
The agent must stop if any of the following occurs:
- Database migration fails.
- Seed script fails.
- `npm/pnpm install` fails.
- Typecheck fails.
- Lint fails.
- Build fails.
- RLS requirement is unclear.
- A legacy table conflicts with a canonical table.
- Route structure conflicts with `/[locale]/[country]`.
- A feature needs environment variables not defined in `.env.example`.
- A dependency creates a version conflict.
- A required file from the spec is missing.
- A requirement is ambiguous enough that two implementations are plausible.

Stop report format:
```md
# BLOCKER REPORT
## Phase
## What failed
## Command/output
## Impact
## Smallest safe fix
## Files likely affected
## Do not continue because
```

## 6. Canonical Product Guardrails
The build must preserve these decisions:
- Launch public SEO only in English and Arabic.
- Do not create Persian or Hindi public SEO routes.
- Country-aware routes are mandatory: `/[locale]/[country]/...`.
- Oman (`om`) is the only launch country.
- No Health Card/card sales model.
- Patient offers replace cards.
- Anonymous browsing is allowed for public pages.
- User registration is free.
- Provider monetization is through plans, sponsored slots, and later optional paid features.
- Sponsored placement must never secretly alter organic ranking.
- `geo_areas` is canonical; legacy `areas` is not a writable source of truth.
- `doctor_practice_locations` is canonical; legacy `doctor_centers` is not a writable source of truth.
- `provider_plans` and `platform_settings` are the V10.3+ canonical tables.

## 7. Phase-Gated Sequence
The default build sequence is:
1. Phase 0 — Repository readiness and scaffold plan
2. Phase 1 — App foundation
3. Phase 2 — Database core migrations and seed
4. Phase 3 — RLS and security foundation
5. Phase 4 — Public SEO pages
6. Phase 5 — Admin basic
7. Phase 6 — Claim and provider ownership
8. Phase 7 — Provider dashboard
9. Phase 8 — Offers, click tracking, sponsored foundation
10. Phase 9 — Provider plans and manual billing
11. Phase 10 — SEO operations, redirects, import, duplicate tools
12. Phase 11 — QA and production hardening

No phase may begin until the previous phase has a passing phase report and human approval when required by `76_HUMAN_APPROVAL_CHECKPOINTS.md`.

## 8. Definition of Real Completion
A phase is not complete because files were edited. It is complete only when:
- Scope matches the phase lock.
- Required commands pass.
- Required routes or migrations work.
- No forbidden features were added.
- Completion report is produced.
- Known risks are listed.

## 9. No Hidden Scope Expansion
If the agent notices a useful future feature, it may list it under “Future Recommendation”. It must not implement it in the current phase unless explicitly included in the phase scope.

## 10. Required Final Report Per Phase
Every phase must end with:
```md
# PHASE COMPLETION REPORT
## Phase
## Goal
## Files created
## Files modified
## Database changes
## Routes added/changed
## Commands run
## Results
## Screens/pages to manually inspect
## Risks and known limitations
## Next recommended phase
## Approval required before continuing: yes/no
```
