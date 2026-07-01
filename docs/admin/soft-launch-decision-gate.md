# Soft launch decision gate

This gate decides whether the project can move from guarded soft-launch readiness into any public expansion work.

It is a release decision contract, not a runtime workflow.

## Default state

Default state is no-go.

The project remains no-go for expansion until every required evidence item is recorded and reviewed.

## Required pass evidence

The go decision requires:

- soft-launch manual QA evidence is complete
- admin route evidence is complete
- public profile evidence is complete
- import profile evidence is complete
- sitemap evidence is complete
- advisor errors are 0
- remaining advisor warnings are tracked in the warning backlog
- no native doctor or center sitemap expansion exists in `src/app/sitemap.ts`
- native profile promotion contract remains helper-only until a later wiring PR

## Blockers

Any of these keeps the release in no-go:

- missing QA evidence
- missing admin route evidence
- missing public profile evidence
- missing import profile evidence
- missing sitemap evidence
- advisor errors above 0
- untracked advisor warnings
- native profile sitemap expansion before approval
- query, filter, preview, admin, provider dashboard, commercial action, payment, or public-score URLs in sitemap output
- unsupported public claims in profile UI or metadata

## Allowed after go

Only after this gate is go may a separate PR start wiring a limited native profile sitemap promotion source.

That later PR must still keep family caps, deterministic ordering, eligibility checks, completeness acceptance, reviewed promotion evidence, and safe canonical paths.

## Not allowed by this gate

This gate does not approve:

- bulk profile sitemap expansion
- GEO growth
- ranking pages
- user feedback schema
- appointment schema
- plan or payment claims
- provider self-editing public copy
- public claim workflow launch
- sponsored ranking

## Operator note

A green CI run is not the same as go.

CI proves the gates exist. The operator still must record the manual evidence before launch expansion starts.
