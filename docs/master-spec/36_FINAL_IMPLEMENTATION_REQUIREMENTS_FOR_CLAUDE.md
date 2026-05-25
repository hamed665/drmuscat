# 36_FINAL_IMPLEMENTATION_REQUIREMENTS_FOR_CLAUDE.md

# Final Implementation Requirements for Claude Code

This file is the final guardrail layer. If any earlier file is ambiguous, use this file plus `25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md` as the tie-breaker.

## Product Identity
DrMuscat is:
```text
Oman healthcare discovery + SEO + AI-search-ready database + WhatsApp lead machine + reputation + center growth platform.
```

DrMuscat is not:
- a generic directory
- a coupon-only website
- an emergency healthcare platform
- a medical advice/diagnosis platform
- a pay-to-delete reputation platform
- a hospital management system

## Must-Have Systems
Claude Code must account for these systems in architecture, routes, database, admin, and phased tasks:
1. free unclaimed listings
2. claim profile flow
3. center verification levels
4. center onboarding wizard
5. profile completeness score
6. center visibility scorecard
7. public SEO pages
8. AI-search-ready structured content
9. WhatsApp/call/direction tracking
10. offer claim and redemption tracking
11. reviews/ratings with moderation
12. AI discovery chat, not medical diagnosis
13. center analytics dashboard
14. monthly visibility reports
15. sales CRM
16. proposal/contract tracking
17. local SEO matrix pages with noindex rules
18. backlink partner kit
19. QR kit routes/plan
20. trust/compliance pages

## Implementation Modes
Default mode remains SAFE_REVIEW_ONLY.

In PHASED_BUILD_AFTER_REVIEW mode, Claude Code must implement only the approved phase and stop.

Claude Code must not build all phases in one uncontrolled pass.

## MVP Priority
MVP must prioritize:
- public listings and SEO base
- claim profile path
- admin control
- safe center profiles
- media optimization
- tracked WhatsApp/call/direction actions
- analytics foundation
- review moderation foundation
- AI chat safety skeleton

MVP may defer advanced features but must not design schemas/routes in a way that blocks them.

## No Silent Invention
If a table, field, enum, route, UI behavior, moderation rule, SEO rule, or analytics event is missing or contradictory, Claude Code must stop and report the ambiguity.

## Required Exit Report Per Phase
Every completed phase must report:
- files changed
- migrations created
- routes created
- admin pages created
- public pages created
- security/RLS impact
- SEO impact
- analytics impact
- mobile/RTL impact
- build result
- typecheck result
- lint result
- remaining blockers

## Final Rule
The project is considered incomplete if it is beautiful but cannot:
- rank on Google
- be understood by AI search
- convert public listings into claimed profiles
- prove value to centers
- protect review/privacy/legal trust
- track WhatsApp/call/direction actions
- help sales close paid partners


## Internal Advertising Final Requirements

Claude Code must treat advertising as a separate monetization subsystem. It must not mix ad spend with subscription billing unless a canonical ledger entry connects them. It must implement ad features phase-by-phase, starting with admin-controlled flat sponsorships before self-serve CPC wallet campaigns.

No public ad rendering may omit sponsored labels. No billable ad event may be charged without idempotency, server-side validation, and wallet/ledger connection.
