# 29_ONE_COMMAND_BUILD_PROMPTS_AND_EXECUTION_MODES.md

# Claude Code One-Command Handoff Prompts and Execution Modes

## 1. Safe Review Prompt
Use this first when uploading the package:

```text
Read all DrMuscat Master Spec V10 files in the exact order defined in README_SEND_ORDER_AND_RULES.md.
Use SAFE_REVIEW_ONLY mode.
Do not write code yet.
Produce the DRMUSCAT PRE-IMPLEMENTATION REVIEW required in 00_MASTER_PROMPT_FOR_CLAUDE_CODE_V10_FINAL.md.
Explicitly report any contradiction, missing detail, route mismatch, schema mismatch, RLS gap, admin settings gap, image optimization gap, SEO/performance risk, or implementation blocker.
Stop after the review and wait for my approval.
```

## 2. Phase 0 Build Prompt
Use this only after the review is clean:

```text
Use PHASED_BUILD_AFTER_REVIEW mode.
Start Phase 0 only.
Create the project foundation, canonical folder structure, design tokens, shared UI shell, i18n skeleton, Supabase client boundaries, environment validation, API response helpers, audit helper skeleton, and basic public/admin layout shells.
Do not implement billing, approvals, media processing, or dashboards beyond safe skeletons unless Phase 0 explicitly requires it.
After Phase 0, stop and report files changed, build/typecheck/lint results, risks, and next phase.
```

## 3. Database Phase Prompt

```text
Implement the database phase using 05b_DATABASE_FULL_DDL_V10.sql.md, 05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md, and 05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md.
Before creating a migration, validate table order, enum usage, indexes, triggers, helper functions, RLS enablement, public policies, billing RPC placeholder rules, storage fields, and subscription lifecycle.
Create one clean initial migration only if validation passes.
Stop after migration and report validation results.
```

## 4. UI Quality Instruction
Claude Code must treat design quality as implementation scope, not decoration. Public pages should look premium and distinctive while staying fast.

## 5. Stop Conditions
Claude Code must stop if:
- schema conflicts exist
- role names conflict
- subscription statuses conflict
- RLS helper functions are missing
- route and folder structure mismatch
- signed upload route lacks storage path persistence
- public pages would be client-only
- admin settings cannot be safely permissioned
- image optimization cannot be implemented safely
- billing RPCs are still placeholders during billing phase
