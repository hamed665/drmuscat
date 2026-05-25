# 69_ERROR_HANDLING_AND_STOP_RULES.md — Error Handling and Stop Rules

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file tells the coding agent when to stop. Stopping early is success when continuing would create damage.

## 2. Hard Stop Conditions
Stop immediately if:
- A migration fails.
- A seed fails.
- A protected table lacks RLS.
- A public route conflicts with the canonical route contract.
- A dependency install fails.
- Build/lint/typecheck fails.
- A required environment variable is missing from `.env.example`.
- A feature requires a provider/API not configured.
- A legacy table appears as a writable source of truth.
- A payment feature risks storing card data or secrets.
- A medical claim could be displayed without disclaimer/guardrails.
- A sponsored result can appear without clear label.

## 3. Soft Stop Conditions
Stop and ask for approval if:
- A new dependency is required.
- A folder structure change affects multiple phases.
- A table needs destructive migration.
- A route name could be interpreted more than one way.
- A UI component contract does not cover a required component.
- Implementation requires choosing between performance and feature scope.

## 4. Error Handling Rules in Code
- Never use empty `catch` blocks.
- Server actions must return structured errors.
- API routes must validate input.
- UI must show meaningful error states.
- Admin destructive actions must confirm and audit.
- Provider edits must fail closed if ownership is uncertain.
- Public pages must not leak private error details.

## 5. Required Blocker Report
When stopping:
```md
# BLOCKER REPORT
## Phase
## Blocker type
## Exact failure
## Evidence/output
## Why continuing is unsafe
## Smallest safe fix
## Suggested next prompt
```

## 6. No Guessing Clause
If the agent would need to guess, the correct action is to stop. Guessing in schema, permissions, billing, routing, and SEO is not initiative; it is vandalism with autocomplete.
