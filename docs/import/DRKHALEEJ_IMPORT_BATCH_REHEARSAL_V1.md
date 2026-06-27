# DrKhaleej Import Batch Rehearsal V1

## Purpose

`IMPORT-BATCH-REHEARSAL-A` defines the first safe rehearsal before any broad imported profile batch is allowed into the public sitemap.

This is a launch-readiness checklist. It does not publish data, approve an import row, create a provider dashboard, enable offers, enable public comments, enable public ratings, enable appointment workflows, enable payments, or loosen any evidence gate. Apparently this has to be written down, because spreadsheets keep auditioning for the role of unchecked infrastructure.

## Scope

The rehearsal applies only to these currently guarded imported profile families:

| Family | Canonical pattern | Current public status | Sitemap cap | First rehearsal cap |
| --- | --- | --- | --- | --- |
| doctor | `/en/om/doctor/{slug}`, `/ar/om/doctor/{slug}` | guarded index path | 3000 | 50 |
| pharmacy | `/en/om/pharmacies/{slug}`, `/ar/om/pharmacies/{slug}` | guarded index path | 1500 | 25 |
| hospital | `/en/om/hospitals/{slug}`, `/ar/om/hospitals/{slug}` | guarded index path | 500 | 10 |

Labs, centers, dental, beauty, offers, search result URLs, area pages, service pages, specialty pages, article pages, pet routes, public comments, public ratings, appointment workflows, payments, and provider dashboard routes remain outside this rehearsal.

## Required gates before selecting rows

The following CI and static gates must already be green on `main`:

- `pnpm import:templates:validate`
- `pnpm import:alias-coverage:validate`
- `pnpm import:publish-readiness-audit:validate`
- `pnpm import:sitemap-family-caps:validate`
- `pnpm import:profile-smoke:validate`
- `pnpm seo:route-snapshot:validate`
- `pnpm seo:check`

The runtime source of truth for readiness remains `getImportPublishReadinessAudit()` in `src/server/admin/import-publish-readiness-audit.ts`.

## Row eligibility contract

Every row in the rehearsal batch must satisfy all of these conditions before it can appear in the public import sitemap:

- `target_entity_type` is exactly `doctor`, `pharmacy`, or `hospital`.
- `publish_status` is exactly `index_eligible`.
- `index_policy` is exactly `index`.
- `sitemap_policy` is exactly `included`.
- `metadata.sitemap_included` is `true`.
- `metadata.robots_policy` is exactly `index`.
- `metadata.canonical_path` matches the safe canonical pattern for the family.
- `metadata.import_entity_candidate_id` is present.
- The candidate exists in `import_entity_candidates`.
- The candidate has `candidate_status` equal to `approved`.
- The candidate entity type matches the queue family.
- Source evidence exists: `sourceName` or `sourceUrl`, plus `lastCheckedAt`.
- Contact or map evidence exists: phone, WhatsApp, email, website, Google Maps, or directions URL.
- Oman geo evidence exists: area, wilayat, governorate, latitude, or longitude.

## Rehearsal steps

1. Freeze a tiny candidate set.
   - Maximum: 50 doctors, 25 pharmacies, 10 hospitals.
   - Prefer Muscat-area entities first because local QA is easier and less glamorous than breaking the whole country.

2. Run the readiness audit.
   - Use `getImportPublishReadinessAudit()`.
   - The audit must show zero blockers for the selected rows.
   - Any `canonical_unsafe`, `source_missing`, `contact_or_map_missing`, `geo_missing`, `candidate_missing`, or `candidate_not_approved` blocker stops the rehearsal.

3. Verify sitemap output.
   - The public sitemap must contain only the frozen rows from this rehearsal plus existing static routes.
   - Imported doctor URLs must match `/en/om/doctor/{slug}` or `/ar/om/doctor/{slug}`.
   - Imported pharmacy URLs must match `/en/om/pharmacies/{slug}` or `/ar/om/pharmacies/{slug}`.
   - Imported hospital URLs must match `/en/om/hospitals/{slug}` or `/ar/om/hospitals/{slug}`.
   - No lab, center import, dental, beauty, offer, search result, area, service, specialty, article, pet, public comment, public rating, appointment workflow, payment, or provider dashboard URL may appear.

4. Smoke-check representative public pages.
   - At least 5 doctor profile URLs.
   - At least 5 pharmacy profile URLs.
   - At least 3 hospital profile URLs.
   - Each sampled page must render the expected name, location evidence, last checked value, source label, contact or direction signal, canonical URL, and locale alternate links where the route supports them.

5. Check noindex boundaries.
   - Static blocked routes must remain `noindex, follow`.
   - Search utility pages must remain out of the sitemap.
   - Future profile families must remain blocked.

6. Record the rehearsal result.
   - Capture batch timestamp.
   - Capture entity counts by family.
   - Capture audit blocker count.
   - Capture sitemap URL count before and after.
   - Capture sampled URLs and pass/fail notes.

## Stop conditions

Stop the rehearsal and remove the affected rows from sitemap eligibility if any of these happen:

- A sampled page renders a wrong name, wrong area, wrong family, or wrong canonical URL.
- A URL appears for a family that is not doctor, pharmacy, or hospital.
- A URL appears for a country other than Oman.
- A URL appears for a locale other than English or Arabic.
- Any imported URL appears without source evidence.
- Any imported URL appears without contact or map evidence.
- Any imported URL appears without Oman geo evidence.
- Any profile page route calls `listPublicImportSitemapEntries()` directly.
- The public sitemap crosses the rehearsal cap.
- The audit returns any blocker for selected rows.

## Go decision

The first rehearsal can proceed only when all of these are true:

- CI is green.
- `pnpm seo:check` is green.
- Readiness audit blockers for selected rows are zero.
- Public sitemap diff matches only the frozen batch.
- Representative page smoke checks pass.
- No blocked route class appears in the sitemap.

If any condition fails, the decision is `NO-GO`. Not “almost go,” not “ship and pray,” not “but the spreadsheet looked confident.” Just no.
