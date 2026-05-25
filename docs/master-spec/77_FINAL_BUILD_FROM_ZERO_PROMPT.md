# 77_FINAL_BUILD_FROM_ZERO_PROMPT.md — Final Build From Zero Prompt

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

# Final Prompt for Codex / Coding Agent

Use this prompt when starting DrMuscat from an empty or clean GitHub repository.

```text
You are building DrMuscat from zero.

Mode: PHASED_BUILD_ONLY.

You MUST NOT build the full platform in one pass.
You MUST start with Phase 0 only.
You MUST stop after Phase 0 and wait for approval.

First read these files in this exact order:
1. 64_AGENT_SAFE_BUILD_FRAMEWORK.md
2. 77_FINAL_BUILD_FROM_ZERO_PROMPT.md
3. 76_HUMAN_APPROVAL_CHECKPOINTS.md
4. 68_TESTING_AND_VALIDATION_GATE.md
5. 67_DATABASE_MIGRATION_PROTOCOL.md
6. 66_PHASE_LOCKS_AND_ALLOWED_FILE_CHANGES.md
7. 72_SECURITY_RLS_AND_SECRET_HANDLING_PROTOCOL.md
8. 73_SEO_BUILD_VALIDATION_PROTOCOL.md
9. 74_UI_COMPONENT_CONTRACT_AND_DESIGN_SYSTEM.md
10. 75_DATA_IMPORT_AND_SEED_EXECUTION_PROTOCOL.md
11. 71_ENVIRONMENT_AND_DEPLOYMENT_CONTRACT.md
12. 70_AGENT_OUTPUT_REPORT_TEMPLATE.md
13. 69_ERROR_HANDLING_AND_STOP_RULES.md
14. 63_FINAL_CODEX_IMPLEMENTATION_PROMPT_V10_3.md
15. 58_CODEX_PHASED_BUILD_MASTER_PLAN.md
16. 59_DATABASE_CANONICAL_PATCH_V10_3.md
17. 25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md
18. 51_SEO_OPERATIONS_REDIRECTS_AND_INDEXABILITY_MANAGER.md
19. 50_ADMIN_OPERATING_SYSTEM_FULL_MODULES.md
20. 60_ACCEPTANCE_CRITERIA_PER_PANEL.md
21. README_SEND_ORDER_AND_RULES.md

Canonical launch constraints:
- English and Arabic only.
- Oman only at launch.
- Country-aware routes only: /[locale]/[country]/...
- No Persian/Hindi public SEO routes.
- No Health Card/card sales.
- Patient offers replace cards.
- Anonymous browsing must work on public pages.
- User registration is free.
- Provider monetization uses provider plans, sponsored slots, and manual billing first.
- Sponsored slots must be clearly labeled and must never secretly alter organic ranking.
- geo_areas is canonical; legacy areas is not writable canonical.
- doctor_practice_locations is canonical; doctor_centers is not writable canonical.
- provider_plans and platform_settings are canonical.

Phase 0 only:
1. Inspect repository state.
2. Detect package manager or propose one.
3. Detect Node/version requirements or propose one.
4. Produce exact file tree proposal.
5. Produce environment variable contract.
6. Produce Phase 1 implementation plan.
7. List risks/blockers.
8. List commands you would run.
9. Do not create business features.
10. Do not create database migrations yet.
11. Do not create admin/provider/payment/appointment features.
12. Stop for approval.

Before editing any files, output:
# PHASE PLAN
## Phase
## Goal
## Spec files read
## Repository state
## Planned files to create
## Planned files to modify
## Commands planned
## Out of scope
## Risks
## Approval needed before edit

If approved and implementing a phase:
- edit only allowed files for that phase,
- run required validation commands,
- produce PHASE_COMPLETION_REPORT,
- stop after the phase.

Hard stop if:
- migration fails,
- seed fails,
- lint/typecheck/build fails,
- RLS is ambiguous,
- route contract is ambiguous,
- a required environment variable is missing,
- a dependency conflict occurs,
- a table/enum conflict appears,
- a legacy source-of-truth conflict appears,
- you need to guess.

Forbidden:
- no full build in one pass,
- no legacy /[locale]/centers or /[locale]/doctors routes,
- no /fa or /hi public SEO routes,
- no /en/dentist/al-khuwair canonical route,
- no Health Card/card sales,
- no doctor_centers as writable canonical source,
- no legacy areas as writable canonical source,
- no hidden premium organic ranking,
- no live payment gateway in MVP unless explicitly approved,
- no AI chat in MVP,
- no fake tests,
- no fake save buttons,
- no hardcoded admin user,
- no committed secrets,
- no disabling TypeScript, lint, build, RLS, or tests.

Begin now with Phase 0 readiness report only.
```

## Follow-Up Prompt for Phase 1
Use only after Phase 0 is approved:
```text
Proceed with Phase 1 only: App Foundation.
Follow 64, 66, 68, 70, 71, 73, and 74.
Create the app scaffold, i18n foundation, /en/om and /ar/om routes, RTL/LTR layout, design tokens, base UI components, env example, and validation scripts where appropriate.
Do not create database migrations.
Do not implement business features.
Run install, lint, typecheck, and build.
Produce PHASE_COMPLETION_REPORT and stop.
```

## Follow-Up Prompt for Phase 2
```text
Proceed with Phase 2 only: Database Core.
Follow 59 and 67 strictly.
Create sequential Supabase migrations for extensions, enums, profiles, geo hierarchy, taxonomy, centers, doctors, doctor_practice_locations, services, provider_plans, platform_settings, and minimal seed data.
Do not implement UI beyond DB type integration.
Run migration/seed validation and generate DB types if tooling is available.
Produce PHASE_COMPLETION_REPORT and stop for approval.
```

## Follow-Up Prompt for Phase 3
```text
Proceed with Phase 3 only: RLS and Security Foundation.
Enable RLS and create policies for public read, admin write, provider-owned write, user-owned records, and admin-only logs.
Do not add new product features.
Run RLS validation tests or provide exact SQL test cases.
Produce PHASE_COMPLETION_REPORT and stop for approval.
```

## Follow-Up Prompt for Phase 4
```text
Proceed with Phase 4 only: Public SEO Pages.
Implement public English/Arabic Oman routes for home, centers, specialty, specialty+area, center profile, doctors, doctor profile, areas, sitemap, robots, llms.txt, canonical URLs, hreflang, and structured data.
Do not implement provider dashboard, billing, AI chat, or live appointment booking.
Run route, SEO, typecheck, lint, and build validation.
Produce PHASE_COMPLETION_REPORT and stop.
```
