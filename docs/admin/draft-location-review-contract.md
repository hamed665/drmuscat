# Draft Location Review Contract

This contract defines the next workflow after draft location create, edit, and selection.

## Purpose

A draft location may become eligible for active internal use only after a separate admin review workflow.

Create, edit, and selection flows must remain private candidate flows. They must not publish a provider, verify a center, expose contact fields, touch sitemap eligibility, or revalidate public pages.

## Required checks before approval

A location review workflow must check:

- the center exists and is still in a draft review state
- the location belongs to that center
- the location is not deleted
- required geography is present: country, governorate or region, and city or wilayat
- at least one useful location identity field exists: name, address, or map URL
- contact fields remain internal unless a later contact visibility workflow approves them

## Allowed review side effects

The review workflow may set internal review fields for the location and may mark a location active for admin quality-gate evaluation.

It must keep public contact visibility disabled by default.

## Forbidden side effects

The review workflow must not publish provider pages, verify the center, claim the center, change billing, change sponsorship, expose contact fields, update sitemap eligibility, or revalidate public routes.

## Audit and revalidation

Every successful review action must write an admin audit event.

The review action must revalidate the draft center detail page only.

## UI design contract

The admin UI for this workflow must follow the homepage visual language:

- rounded premium surfaces
- soft cyan and slate accents
- calm amber warning blocks for irreversible or gated steps
- dark primary CTA with cyan hover treatment
- pill badges with uppercase tracking
- clear safety copy near the action

The UI must not introduce a separate visual language for location review.
