# Public profile summary contract

Public doctor, center, and reviewed import profile pages must include a short, unique, fact-based profile summary. This summary is part of the soft-launch SEO and GEO safety boundary, not decorative copy.

## Goal

The public profile summary prevents profile pages from becoming near-duplicate pages where only the provider name changes. It gives each profile a small amount of useful, entity-specific context while keeping the page safe for healthcare discovery.

## Required behavior

Every indexable public doctor or center profile must use the shared summary helpers:

- `buildPublicCenterProfileSummary`
- `buildPublicDoctorProfileSummary`
- `buildPublicProfileMetaDescription`

Every reviewed imported public profile must use the shared import summary helpers:

- `buildPublicImportProfileSummary`
- `buildPublicImportProfileMetaDescription`

The generated summary must be used in profile metadata. It must also be visible in the public profile content, inside the profile about or overview section.

## Allowed inputs

Summaries may only use approved public directory facts that already exist in the public profile payload:

- entity name
- entity type or public title
- public location context
- approved services
- related public doctor profiles
- primary specialty
- connected practice locations
- approved public directory data status
- reviewed import source signals
- reviewed import languages
- reviewed import departments

The summary must not invent services, credentials, availability, outcomes, reviews, ratings, insurance acceptance, emergency coverage, or government approval.

## Manual provider text

Provider-written or editorial text may appear when it is already part of the approved public profile data, such as `shortDescription`, `description`, or doctor biography. That text does not replace the fact-based summary. It can appear before the generated summary, so the page can carry both provider-specific wording and a consistent safe discovery summary.

Future provider-submitted profile copy must be reviewed before public use. Until a review workflow exists, generated fact-based summaries remain the safe fallback.

## Reviewed import profiles

Reviewed import profiles include imported doctor, pharmacy, and hospital profiles that passed the import publication gates. These pages must not use generic repeated descriptions as their primary summary.

The import profile summary must be based on the imported entity name, entity type, local geography, public service or department signals, language signals, and reviewed import data status where available.

The same summary must be used in metadata and visible profile content for:

- `GuardedImportProfilePage`
- imported pharmacy profiles
- imported hospital profiles

## Forbidden claims

Generated summaries must not include these claims unless a future evidence gate explicitly supports them:

- best
- top-rated
- guaranteed
- trusted by thousands
- insurance accepted
- MOH approved
- 24/7

The current contract intentionally avoids promotional claims. This is a public healthcare discovery product, not a machine for manufacturing confident nonsense with a logo on it.

## Metadata boundary

Profile metadata descriptions must be produced from the generated summary through `buildPublicProfileMetaDescription` or `buildPublicImportProfileMetaDescription`. Metadata must not fall back to a generic repeated sentence when a public doctor, center, pharmacy, or hospital profile is available.

## Public UI boundary

The generated profile summary must render inside:

- `PublicCenterDetail`
- `PublicDoctorDetail`
- `GuardedImportProfilePage`
- imported pharmacy profile pages
- imported hospital profile pages

Existing provider description or doctor biography can remain visible, but the generated summary must still render so the page has a consistent fact-based baseline.

## Launch guard

The contract is enforced by:

- `scripts/seo/check-public-profile-summary-contract.mjs`
- `scripts/seo/check-public-listing-card-safety.mjs`

The guard must remain wired into the existing SEO check chain.