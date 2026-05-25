# 22_CLAUDE_PRE_IMPLEMENTATION_CHECKLIST.md

# Claude Pre-Implementation Checklist

Before coding, Claude must answer:

1. Did you read all files in order?
2. Which file is canonical for DDL?
3. Did you validate indexed tables/columns?
4. Did you confirm events/ad_events separation?
5. Did you confirm no direct events insert from client?
6. Did you confirm center slug exists?
7. Did you confirm doctor_centers exists?
8. Did you confirm subscription lifecycle fields?
9. Did you confirm receipt FK ordering?
10. Did you confirm phone-first auth?
11. Did you confirm guest browsing?
12. Did you confirm multilingual/RTL everywhere?
13. Did you confirm responsive viewport requirements?
14. Did you confirm no fake translations or fake ratings?
15. Did you confirm storage signed URL strategy?
16. Did you confirm no Phase 2/3 feature build unless approved?

If any answer is uncertain, stop and ask.

# V10 CANONICAL ADDITION — Additional Pre-Implementation Questions

Claude Code must answer these questions before Phase 0/1 implementation.

## Schema Consistency Questions

17. Did you confirm `subscription_status` or subscription status constraints include all required lifecycle states such as `pending`, `active`, `suspended`, `expired`, `cancelled`; `trial` is explicitly disabled in MVP?
18. Did you confirm bucket names match `18_SUPABASE_STORAGE_BUCKETS_AND_POLICIES.md` exactly?
19. Did you confirm the role is `center_owner`, not `clinic_owner`, `owner`, or any invented role?
20. Did you confirm `audit_logs` uses `actor_id`, not `actor_user_id`?
21. Did you confirm `audit_logs` includes `request_id`?
22. Did you confirm `doctor_centers.organization_id` is derived or validated from `centers.organization_id`?
23. Did you confirm `event_owner_type` excludes `ad_campaign` in canonical V10 DDL?
24. Did you confirm paid ad telemetry uses `ad_events`, not `events`?
25. Did you confirm `payments.receipt_media_asset_id` FK is added only after `media_assets` exists?
26. Did you confirm patient offers replace the old card concept, no card sales exist, and offer claim codes are generated safely?
27. Did you confirm invoice number generation uses the canonical database function?
28. Did you confirm every `updated_at` trigger target table has an `updated_at` column?
29. Did you confirm no table uses unrestricted TEXT for business-critical statuses unless protected by CHECK constraint?

## Implementation Pattern Questions

30. Did you read `23_CODE_PATTERNS_AND_EXAMPLES.md` before writing code?
31. Did you read `24_FOLDER_STRUCTURE.md` before creating files?
32. Did you confirm service-role Supabase client exists only in `src/lib/supabase/service.ts`?
33. Did you confirm public SEO pages are Server Component first?
34. Did you confirm `returnTo` validation blocks external redirects?
35. Did you confirm phone normalization uses `libphonenumber-js`?
36. Did you confirm no custom OTP tables are created?
37. Did you confirm Turnstile is part of OTP request flow when configured?
38. Did you confirm all public route handlers use standardized `ApiSuccess` / `ApiError`?
39. Did you confirm every critical operation generates or propagates `request_id`?
40. Did you confirm audit logs are written for critical admin actions?

## Responsive / i18n Questions

41. Did you confirm the page works at 360, 390, 430, 768, 1024, 1280, 1440 and 1536+ widths?
42. Did you confirm Arabic RTL layout separately?
43. Did you confirm no unintended horizontal overflow exists?
44. Did you confirm LanguageSwitcher preserves current route and subdomain?
45. Did you confirm no raw dictionary keys appear in UI?
46. Did you confirm missing localized database content falls back safely without runtime fake translation?

## Claude Stop Rule

If any answer is “not confirmed”, Claude Code must stop and report before coding.

# V10 Growth / Trust / AI Checklist

Claude Code must explicitly verify before implementation:

- Free seeded listings are unclaimed and not presented as partners.
- Unclaimed profiles include claim, suggest edit, report wrong info and removal request paths.
- Reviews are pending/moderated by default.
- Review ratings include sub-ratings.
- Review schema is not emitted until review threshold and compliance are met.
- AI chat is discovery-only and not medical diagnosis.
- Analytics events use canonical V10 event names.
- Offer claim/redemption tracking exists in the architecture.
- Center analytics and monthly report architecture exist.
- Sales CRM, proposals, contracts and presentation mode exist in admin architecture.
- Programmatic SEO pages have noindex guardrails.
- Trust/compliance pages exist.

## V10.3 Checklist Override
Where this checklist asks whether `doctor_centers` exists, V10.3 changes the required confirmation to: `doctor_practice_locations` exists and is canonical. `doctor_centers`, if present, is legacy read-only/migration-only and not used by new application logic.
