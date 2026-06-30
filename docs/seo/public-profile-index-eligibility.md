# Public profile index eligibility contract

Public doctor and center detail pages must not become indexable just because a route exists. A public profile is indexable only when it passes the shared `isPublicProfileIndexEligible` helper and the caller can prove that the data came from the public eligible query chain.

This contract keeps profile index safety separate from UI rendering. A profile may render for discovery or review while still being withheld from robots and sitemap expansion. Humanity has suffered enough from thin directory pages pretending to be content.

## Shared helper

The central helper lives at:

- `src/lib/catalog/public-profile-index-eligibility.ts`

It exposes:

- `isPublicProfileIndexEligible(profile, context)`
- `PublicProfileIndexEligibilityResult`
- `PublicProfileIndexEligibilityReason`

The result shape is intentionally explainable:

```ts
{
  eligible: boolean;
  reasons: string[];
}
```

Admin and launch tooling can use the `reasons` array later to show why a profile is not ready for indexing.

## Required inputs

Callers must pass:

- `kind: 'doctor' | 'center'`
- `fromPublicEligibleQuery: true` only after the profile came from the public eligible query layer
- `deletedOrInactive: true` if a raw or future source detects an inactive/deleted state
- `locale` when the caller is checking localized summary safety

If `fromPublicEligibleQuery` is not true, the helper returns `not_from_public_eligible_query`. This is deliberate. Indexing should require proof, not optimism wearing a badge.

## Eligibility requirements

A profile must have:

- name
- slug
- country
- entity type
- generated summary
- a useful relation signal: location, specialty, service, doctor relation, or practice relation
- safety copy telling users to confirm current details directly with the provider
- no unsafe public claim copy
- no deleted or inactive state
- public eligible query provenance

## Reason codes

The helper may return these reason codes:

- `missing_profile`
- `missing_name`
- `missing_slug`
- `missing_country`
- `missing_entity_type`
- `missing_summary`
- `missing_relation_signal`
- `missing_safety_copy`
- `unsafe_claim`
- `deleted_or_inactive`
- `not_from_public_eligible_query`

## Unsafe claim copy

The helper blocks public claim phrases such as:

- top-rated
- guaranteed
- trusted by thousands
- insurance accepted
- MOH approved
- verified by MOH
- 24/7
- emergency availability
- booking guarantee
- available now
- open now
- book now

This is not a replacement for provider description review. It is the index safety belt. Provider copy still needs its own review contract before public display.

## What this PR does not do

This contract does not yet switch profile metadata or sitemap inclusion. Those are separate follow-up gates:

1. Profile metadata index gate
2. Profile sitemap boundary guard
3. Import profile eligibility gate

Keeping those PRs separate prevents a tiny helper from secretly becoming the place where all SEO behavior goes to die.
