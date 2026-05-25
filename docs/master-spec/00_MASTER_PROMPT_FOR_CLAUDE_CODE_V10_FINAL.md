# 00_MASTER_PROMPT_FOR_CLAUDE_CODE_V10_FINAL.md

# DrMuscat Claude Code Master Execution Prompt — V10 Final

## 1. Identity
You are implementing DrMuscat: a premium, fast, multilingual, phone-first, SEO-safe healthcare and wellness discovery marketplace for Oman.

DrMuscat must not become a generic directory, a slow startup template, a raw admin database screen, or a half-localized mess. This is a real commercial platform with security, health content, billing, CRM, media, localization, reviews, AI chat safety, center acquisition, SEO, attribution, and reporting concerns.

## 2. Mandatory Behavior Before Coding
Before writing code, read every document in the exact send order. Then produce a pre-implementation review and stop.

Required review format:
```text
DRMUSCAT PRE-IMPLEMENTATION REVIEW
1. Documents read in order
2. Architecture summary
3. Phase 0 scope summary
4. Database DDL consistency validation
5. Storage policy acknowledgement
6. RLS/security acknowledgement
7. Auth/phone-first acknowledgement
8. Guest browsing acknowledgement
9. Free seeded listing and claim-profile acknowledgement
10. Multilingual/RTL acknowledgement
11. SEO/canonical/sitemap acknowledgement
12. Responsive/performance/accessibility acknowledgement
13. Medical claim/UTF-8 acknowledgement
14. Observability/privacy acknowledgement
15. Growth/SEO/AI-search strategy acknowledgement
16. Reviews/ratings/moderation acknowledgement
17. AI chat safety and no-diagnosis acknowledgement
18. Analytics/attribution/reporting acknowledgement
19. Center acquisition/claim/sales CRM acknowledgement
20. Local SEO/programmatic noindex acknowledgement
21. Contradictions found
22. Missing details or risks
23. Phase 0 files to create
24. Human approvals needed before implementation
```

Do not write code until the user approves.

## 3. Execution Rules
- Work phase by phase.
- Do not jump phases.
- Do not implement future features unless explicitly approved.
- Do not create fake data presented as real.
- Do not create fake ratings, fake reviews, fake doctor claims, or fake clinic rankings.
- Do not make public SEO pages client-only.
- Do not expose service role keys.
- Do not create broad storage policies.
- Do not bypass RLS with public APIs.
- Do not implement direct client writes to financial, role, audit, approval, or ledger systems.

## 4. Core Product Rules
Guests can browse, search, read articles, view published profiles, view approved microsites, and click WhatsApp/call/directions.
Guests cannot access dashboards, CRM, payments, invoices, private leads, private documents, or admin data.

Phone OTP through Supabase Auth is the primary public authentication method. Default country code is +968. Email is optional for normal users.

V10.1 launch public languages are English and Arabic only. Arabic must be RTL. Do not create Persian/Farsi or Hindi public routes, sitemap entries, hreflang entries, dictionaries, or UI language options in MVP. Admin may be English-first; public pages must support English and Arabic.

## 5. Quality Targets
- Lighthouse Performance: 90+
- Lighthouse SEO: 95+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 90+
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- WCAG 2.2 AA target
- No unintended horizontal overflow at 360, 390, 430, 768, 1024, 1280, 1440, 1536+ widths

## 6. Database Preflight
Before writing migrations, validate:
1. every indexed table exists
2. every indexed column exists
3. every trigger target table exists
4. every updated_at trigger target has updated_at
5. every FK target exists before FK is created or is added later with ALTER
6. role/status fields use enum/check, not random text
7. `event_owner_type` excludes paid ad campaign telemetry
8. `public.events` has no anon/authenticated direct insert
9. `public.ad_events` remains separate from events
10. Offer claim codes and invoice numbers use DB functions
11. `doctor_centers` exists and is used for branch-level doctor display
12. `subscriptions` has lifecycle timestamps
13. `audit_logs` has request_id
14. storage paths are server-generated

## 7. Claude Output After Every Task
After every task, report:
- task completed
- files changed
- code created
- build/typecheck/lint result where applicable
- security risks
- performance risks
- RTL/mobile impact
- next recommended task

Stop after major milestones and wait for approval.

# V10 MASTER PROMPT ADDITION — Code Patterns and Folder Structure

Before implementation, Claude Code must read and obey:

- `23_CODE_PATTERNS_AND_EXAMPLES.md`
- `24_FOLDER_STRUCTURE.md`

These files are canonical.

Claude Code must not invent alternative folder structures, Supabase client boundaries, auth helper patterns, i18n helpers, returnTo handling, signed upload patterns, audit log patterns, route handler response shapes, or server mutation patterns.

If implementation requires a pattern not covered by the docs, Claude Code must stop and ask before inventing it.


# V10 CANONICAL ADDITION — Final Build Discipline

## 8. Execution Modes
Claude Code must support exactly two execution modes.

### SAFE_REVIEW_ONLY
Default mode. Claude Code reads all files in `README_SEND_ORDER_AND_RULES.md`, produces the pre-implementation review, reports blockers, and stops. It writes no code.

### PHASED_BUILD_AFTER_REVIEW
Claude Code reads all files, produces the pre-implementation review, and may start implementation only if the user explicitly requests this mode and there are no blockers. Claude Code must start with Phase 0 only, then stop after each phase with a changed-files report.

Claude Code must never build the full project in one uncontrolled pass. One human prompt may start the process, but implementation must remain phase-gated.

## 9. Canonical Priority
If documents conflict, Claude Code must obey `25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md` first. Claude Code must not silently resolve conflicts from older wording.

## 10. Premium Product Requirement
DrMuscat must feel like a premium Oman-first healthcare product, not a CRUD admin template wearing a teal badge. Public UX must be visually distinctive, fast, mobile-first, SEO-first, and trust-focused.

## 11. Admin Panel Requirement
The admin panel is a first-class product. It must support safe management of settings, roles, approvals, content, media, billing, SEO, homepage modules, packages, ads, microsites, translations, and feature flags according to `26_CREATIVE_UI_ADMIN_AND_SETTINGS_REQUIREMENTS.md`.

## 12. Image Optimization Requirement
All image uploads must use the V10 media pipeline in `27_IMAGE_OPTIMIZATION_MEDIA_PIPELINE.md`: preserve original file when required, generate optimized derivatives, reduce file size without visible quality loss, keep metadata/auditability, and never serve oversized originals on public pages.

## 13. One-Command Reality Check
The goal is that Claude Code can understand the whole product from one package. The safe build still happens phase by phase because letting an AI generate a full healthcare marketplace in one breath is how small bugs become folklore.


## 14. V10 Growth, Reviews, AI and Reporting Requirement
Claude Code must read and obey files 31 through 36 before implementation.

DrMuscat must include architecture for:
- unclaimed public listings and claim conversion
- Google SEO and AI-search-ready structured content
- WhatsApp/call/direction/offer/review/claim event tracking
- structured moderated reviews and ratings
- AI discovery chat with no diagnosis/prescription
- center analytics and monthly reporting
- sales CRM, proposals, contracts and visibility scorecards
- local programmatic SEO with noindex rules for thin pages

If any of these systems conflict with earlier docs, report the conflict before coding.


## V10 Advertising Review Requirement

In the pre-implementation review, Claude Code must explicitly report whether the internal advertising system is in scope for the requested phase. If ads are in scope, it must verify placement definitions, wallet/ledger behavior, billing model, anti-fraud rules, sponsored labels, medical ad policy, and admin approval flow before writing code.

## V10.3 Canonical Override Notice
Any older mention that `doctor_centers` is used for branch-level display is legacy-only. From V10.3 onward, `public.doctor_practice_locations` is the canonical writable doctor-to-center/location relation. `doctor_centers` must not be used for new application logic except as a read-only compatibility view or migration source if explicitly implemented in file 59.
