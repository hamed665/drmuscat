# 70_AGENT_OUTPUT_REPORT_TEMPLATE.md — Agent Output Report Template

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
Every agent response must be reviewable. This template standardizes outputs.

## 2. Pre-Implementation Plan Template
```md
# PHASE PLAN
## Phase
## Goal
## Spec files read
## Assumptions
## Files planned for creation
## Files planned for modification
## Database changes planned
## Routes planned
## Commands planned
## Out of scope
## Risks
## Approval needed before edit: yes/no
```

## 3. Phase Completion Report Template
```md
# PHASE COMPLETION REPORT
## Phase
## Goal completed
## Files created
## Files modified
## Database changes
## Routes added/changed
## Commands run
| Command | Result | Notes |
|---|---|---|
## Manual QA checklist
## Screenshots or local URLs to inspect
## Known limitations
## Risks
## Next phase recommendation
## Approval required before continuing
```

## 4. Patch Report Template
```md
# PATCH REPORT
## Blocker fixed
## Root cause
## Files changed
## Tests run
## Regression risks
## Remaining issues
```

## 5. Diff Review Template
```md
# DIFF REVIEW
## Summary
## Correctness issues
## Security issues
## SEO issues
## Database/RLS issues
## UX/accessibility issues
## Required fixes before merge
## Optional improvements
```

## 6. Language and Detail Rules
- Reports must be concise but complete.
- Do not hide failed commands.
- Do not summarize away schema changes.
- Do not say “all good” without evidence.
- Include exact filenames.
- Include exact route paths.
- Include exact SQL migration filenames.
