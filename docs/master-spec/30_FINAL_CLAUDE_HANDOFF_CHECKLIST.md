# 30_FINAL_CLAUDE_HANDOFF_CHECKLIST.md

# Final Claude Handoff Checklist

Before Claude Code writes code, it must answer yes/no to every item.

## Package Integrity
1. Did you read all files in README order?
2. Is this package V10 only?
3. Did you ignore older V5/V6 wording if any accidental text remains?
4. Did you apply the conflict priority from file 25?

## Architecture
5. Is the app Next.js App Router with localized public routes?
6. Are public pages server-rendered by default?
7. Are dashboards role-gated server-side?
8. Is the folder structure from file 24 followed exactly?

## Database and Security
9. Are all enums aligned with V10 decisions?
10. Is subscription status exactly pending/active/suspended/expired/cancelled?
11. Is trial disabled?
12. Are helper functions present?
13. Is RLS enabled on all application tables?
14. Are public policies limited to published/approved content?
15. Are financial/role/audit/approval/ledger tables protected from direct browser writes?

## Admin
16. Does admin have settings architecture?
17. Are settings validated server-side?
18. Are settings changes audit-logged?
19. Are secrets kept in environment variables only?
20. Is audit log read-only?

## Media
21. Does signed upload persist storage bucket and storage path?
22. Is video-assets rejected in MVP public uploads?
23. Are image derivatives planned?
24. Are public pages using optimized derivatives, not originals?
25. Is alt text supported per locale?

## SEO and Performance
26. Are canonical, hreflang, sitemap and robots rules implemented centrally?
27. Are matrix pages noindex unless 3+ published centers exist?
28. Are images using next/image and correct sizes?
29. Are admin libraries excluded from public bundles?
30. Are mobile/RTL checks included?

## Build Discipline
31. Are you in SAFE_REVIEW_ONLY unless explicitly told otherwise?
32. If building, are you implementing Phase 0 only first?
33. Will you stop after each phase with changed files and test results?

If any answer is no, Claude Code must stop and report before coding.


## V10 Growth / Reviews / AI / Sales Checks
34. Are unclaimed seeded listings clearly distinguished from claimed/verified/partner profiles?
35. Does every unclaimed profile have Claim, Suggest Edit, Report Wrong Info and Request Removal CTAs?
36. Are reviews structured, moderated, sub-rated and protected from pay-to-delete behavior?
37. Are center responses moderated and audited?
38. Is AI chat restricted to discovery/platform guidance, not diagnosis or prescriptions?
39. Are WhatsApp/call/direction/offer/review/claim events tracked with canonical event names?
40. Does the center dashboard show measurable value, not just profile settings?
41. Is monthly reporting architecture present for paid/claimed centers?
42. Is sales CRM/proposal/contract tracking represented in admin architecture?
43. Are programmatic SEO pages noindex unless they meet quality thresholds?
44. Are review schema and aggregate rating emitted only for compliant approved reviews?
45. Are trust/compliance pages included?

If any V10 growth/review/AI/sales answer is no, Claude Code must report the gap before coding.


## Advertising Checklist

Before implementing any advertising feature, Claude Code must confirm:

- ad placements are admin-defined, not hard-coded
- sponsored labels are visible in English and Arabic
- no ad goes live without admin approval
- wallet/ledger/idempotency exists before CPC billing
- flat sponsorship bookings can be audited
- anti-duplicate click billing is enforced
- medical ad claims pass policy review
- original uploaded ad images are never served publicly
- competitor ads on individual center profile pages are disabled by default
- ad metrics feed center dashboard and monthly reports
