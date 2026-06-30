# Public profile sitemap boundary

Public doctor and center profile routes must not enter the sitemap just because the route exists. Profile index expansion requires a separate promotion path after profile index eligibility, metadata gating, and review evidence are in place.

The current sitemap boundary is intentionally conservative:

- static public directory pages may come from the SEO page registry
- reviewed imported profiles may come from the import sitemap queue
- normal doctor and center detail routes must not use `generateStaticParams`
- query and filter URLs must not appear in sitemap output
- preview, provider dashboard, admin, claim, booking, rating, review, and insurance paths must not appear in sitemap output

Yes, this is boring. Boring is what prevents 2,000 weak URLs from marching into the index like a badly organized parade.

## Runtime boundary

The public sitemap lives at:

- `src/app/sitemap.ts`

It must only combine:

- `listSitemapEligibleSeoPageDefinitions()` for approved static/canonical public pages
- `listPublicImportSitemapEntries()` for reviewed imported profiles

The sitemap must not directly import or call:

- `getPublicDoctorBySlug`
- `getPublicCenterBySlug`
- `listPublicDoctors`
- `listPublicCenters`
- `isPublicProfileIndexEligible`
- profile route params or preview helpers

Profile detail index expansion needs its own explicit promotion gate later. Metadata eligibility is not, by itself, permission to flood the sitemap.

## Route boundary

These routes must not export `generateStaticParams`:

- `src/app/[locale]/[country]/doctor/[doctorSlug]/page.tsx`
- `src/app/[locale]/[country]/center/[centerSlug]/page.tsx`

This keeps profile pages request-time only until sitemap expansion has its own gate.

## Import boundary

Imported profile sitemap entries must stay behind import review evidence:

- `publish_status = index_eligible`
- `index_policy = index`
- `sitemap_policy = included`
- `metadata.sitemap_included === true`
- `metadata.robots_policy === index`
- `metadata.canonical_path` exists
- `metadata.import_entity_candidate_id` exists
- canonical path matches the safe public family regex
- family caps remain in place

## Follow-up

The next runtime expansion step should create an explicit profile sitemap promotion helper for native doctor and center profiles. It should consume `isPublicProfileIndexEligible`, reviewed promotion evidence, and family caps before any profile detail URL is added.
