# CHANGELOG_V10_2.md

# DrMuscat V10.2 — Scale, Geo, Doctors, Extensibility, Consent, Payments, Analytics

## Purpose
V10.2 expanded DrMuscat from a Muscat-only directory into a country-aware GCC-ready platform architecture while keeping Oman as the launch market.

## Main Additions

```text
- Country-aware routing: /[locale]/[country]/...
- Five-layer geo hierarchy.
- geo_countries, geo_regions, geo_cities, geo_areas.
- First-class doctor profile model.
- Multi-location doctor practice support.
- Feature flags.
- Settings engine.
- Dashboard module registry.
- Legal documents and user acceptances.
- Consent logs.
- Notification preferences.
- Payment gateway foundation.
- Dynamic plans foundation.
- Behavior analytics foundation.
- AI discoverability foundation including llms.txt.
- Sponsored slot transparency.
- Week-one scope and deferred feature boundaries.
```

## Canonical Source Files

```text
05e_PLATFORM_SCALE_GEO_DOCTOR_EXTENSIBILITY_DDL_SUPPLEMENT_V10_2.md
39_EXTENSIBILITY_FEATURE_FLAGS_AND_SETTINGS_ENGINE.md
40_LUXURY_UI_POLISH_AND_PERFORMANCE_BUDGET.md
41_AI_DISCOVERABILITY_LLM_SEARCH_AND_FUZZY_SEARCH.md
42_CONSENT_COOKIES_NOTIFICATIONS_AND_LEGAL_ACCEPTANCE.md
43_PAYMENT_GATEWAYS_DYNAMIC_PLANS_AND_UPGRADE_NUDGES.md
44_BEHAVIORAL_ANALYTICS_EVENTS_AND_FUNNELS.md
45_SPONSORED_SLOTS_AND_PREMIUM_VISIBILITY_RULES.md
46_MULTI_COUNTRY_GEO_AND_DOCTOR_PROFILE_SYSTEM.md
47_WEEK_ONE_LAUNCH_SCOPE_AND_DEFERRED_FEATURES_V10_2.md
```

## Implementation Impact

```text
- Use /en/om and /ar/om as canonical launch routes.
- Do not generate old /en/dentist/al-khuwair style routes except as redirects.
- Treat geo_areas as the forward canonical area model.
- Treat doctor_practice_locations as the forward doctor-location model.
- Keep Meilisearch, AI query understanding, Web Push, full CPC wallet, and country expansion deferred.
```
