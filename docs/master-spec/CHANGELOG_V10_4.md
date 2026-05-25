# CHANGELOG_V10_4.md

## DrMuscat V10.4 — Agent-Safe Build Framework

V10.4 adds an implementation-control layer on top of V10.3.1. It does not expand the product surface for launch; it reduces build risk when Codex, Claude Code, or another coding agent builds from zero.

## Added
- `64_AGENT_SAFE_BUILD_FRAMEWORK.md`
- `65_CODEX_REPOSITORY_BOOTSTRAP_RULES.md`
- `66_PHASE_LOCKS_AND_ALLOWED_FILE_CHANGES.md`
- `67_DATABASE_MIGRATION_PROTOCOL.md`
- `68_TESTING_AND_VALIDATION_GATE.md`
- `69_ERROR_HANDLING_AND_STOP_RULES.md`
- `70_AGENT_OUTPUT_REPORT_TEMPLATE.md`
- `71_ENVIRONMENT_AND_DEPLOYMENT_CONTRACT.md`
- `72_SECURITY_RLS_AND_SECRET_HANDLING_PROTOCOL.md`
- `73_SEO_BUILD_VALIDATION_PROTOCOL.md`
- `74_UI_COMPONENT_CONTRACT_AND_DESIGN_SYSTEM.md`
- `75_DATA_IMPORT_AND_SEED_EXECUTION_PROTOCOL.md`
- `76_HUMAN_APPROVAL_CHECKPOINTS.md`
- `77_FINAL_BUILD_FROM_ZERO_PROMPT.md`

## Updated
- `README_SEND_ORDER_AND_RULES.md` now identifies V10.4 as the canonical package and includes the agent-safe framework files at the top of the send order.
- `25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md` now references V10.4 execution priority.
- `PACKAGE_MANIFEST.json` updated with all V10.4 files.

## Main Build-Safety Changes
- No full-platform build in one pass.
- Phase-gated execution only.
- Allowed file changes per phase.
- Hard stop rules for migration, RLS, route, SEO, and build errors.
- Required validation gates.
- Repository bootstrap protocol.
- Environment and deployment contract.
- Secret handling protocol.
- SEO route/indexability validation protocol.
- Human approval checkpoints.
- Final build-from-zero Codex prompt.

## Intended Usage
Give the V10.4 package to Codex and start with:

```text
Read V10.4. Use PHASED_BUILD_ONLY. Start with Phase 0 only. Do not implement code until you produce the Phase 0 readiness report and receive approval.
```
