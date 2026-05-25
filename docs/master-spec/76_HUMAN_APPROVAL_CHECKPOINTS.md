# 76_HUMAN_APPROVAL_CHECKPOINTS.md — Human Approval Checkpoints

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file defines where the agent must stop for human review.

## 2. Required Approval Points
The agent must stop after:
1. Phase 0 — repository readiness and scaffold plan
2. Phase 2 — database migrations and seed
3. Phase 3 — RLS/security foundation
4. Phase 4 — public SEO pages
5. Phase 5 — admin basic
6. Phase 7 — provider dashboard
7. Phase 9 — plans/manual billing
8. Phase 10 — SEO ops/import/redirect tools
9. Before production deploy

## 3. Approval Report Required
At each checkpoint:
```md
# HUMAN APPROVAL CHECKPOINT
## Phase completed
## What was implemented
## What was intentionally deferred
## Commands passed
## Manual pages to inspect
## Security/RLS notes
## SEO notes
## Database notes
## Risks
## Exact approval requested
```

## 4. Approval Cannot Be Assumed
The agent must not continue just because the next phase is obvious. It must wait for explicit approval.

## 5. Emergency Patch Exception
If a phase has a blocker, the agent may propose a PATCH_ONLY plan. It still must not continue to the next phase until the patch passes and approval is given.

## 6. Human Review Checklist
At minimum, human should verify:
- routes are correct,
- Arabic layout is acceptable,
- database canonical tables match spec,
- admin access is protected,
- no hidden sponsored ranking,
- no forbidden languages/routes,
- no fake actions/buttons,
- no secrets committed.
