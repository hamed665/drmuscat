# 41 — AI Discoverability, LLM Search and Fuzzy Search V10.2

DrMuscat must be discoverable by Google and AI assistants. It must also understand user search mistakes in English and Arabic.

## llms.txt

Launch must include `/llms.txt` with:

- DrMuscat summary
- supported countries and locales
- key patient pages
- provider onboarding page
- verification/trust page
- major specialty pages
- major city/area pages
- safety disclaimers

## robots.txt

Robots must allow public SEO pages and explicitly not block major AI crawlers unless a later legal decision changes this. Admin, dashboard, API, private storage, and internal endpoints must remain disallowed.

## AI Summary Blocks

Programmatic SEO pages should include a concise human-reviewed or template-safe summary block, for example:

```text
Summary: Al Khuwair has verified dental clinics listed on DrMuscat. You can compare opening hours, services, languages, insurance, offers, reviews, and WhatsApp contact options.
```

No summary may claim medical superiority, guaranteed outcomes, or diagnosis.

## Fuzzy Search Week-One

Launch search must use PostgreSQL `pg_trgm` and `unaccent` for typo-tolerant matching.

Search must handle:

- Muscat / Muskat / Mascat / Masqat
- Al Khuwair / Alkhuwair / Khuwair
- Arabic spelling variants
- missing spaces
- common dental/clinic typos

## Future Search Phases

Phase 2:

- search synonym admin UI
- transliteration maps
- Arabic normalization
- search query logs dashboard

Phase 3:

- Meilisearch or Typesense
- AI query understanding
- smart intent extraction

## Medical Safety

AI query understanding may suggest specialties or filters. It must not diagnose. `tooth pain` may map to dentist/emergency dentist, but must not output a diagnosis such as nerve inflammation.
