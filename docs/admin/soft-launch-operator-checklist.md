# Soft Launch Operator Checklist

This checklist is the manual operating guide for activating the first small set of provider profiles.

It does not approve bulk activation, paid placement, claim workflows, booking claims, open-now claims, ratings, insurance claims, provider editing after activation, or native doctor/center sitemap expansion.

## Before activating a provider

Confirm all of the following in the admin draft center detail page:

- the provider is still in `pending_review`
- the provider is not active yet
- the provider is not claimable
- at least one active location exists
- taxonomy assignment exists
- taxonomy review is approved
- quality blockers are zero
- contact visibility has only approved public values
- readiness panel shows no blockers
- readiness evidence is understandable enough for audit review
- profile index eligibility passes
- profile completeness `missing[]` is empty or accepted by the soft-launch rule
- metadata gate returns indexable only if eligible
- center and doctor fallback metadata remains `noindex,follow`
- provider copy is approved or not public
- license copy appears only with `licenseInfo`
- contact actions are approved public values
- relation previews are capped

Do not activate a provider only because the UI button is enabled. The operator must still check the evidence shown on the page.

## Data that must not be changed during soft launch

During soft launch, do not manually change:

- verification status
- claim state
- billing state
- subscription state
- commercial add-ons
- sponsorship or ranking controls
- taxonomy assignments after readiness review
- contact visibility after activation
- sitemap entries outside the guarded flow
- generated public profile summaries outside the summary contract
- profile completeness score visibility
- native profile sitemap expansion

If any of these must change, stop and create a separate contract and validator first.

## Activation step

Use only the final gated control in the publication readiness panel.

The server action must re-check readiness before changing public state. If the action fails, do not retry blindly. Re-check blockers, locations, taxonomy, contact visibility, profile readiness, metadata eligibility, and quality evidence.

## Immediately after activation

Check these admin routes:

- `/admin/draft-centers`
- `/admin/draft-centers/[centerId]`
- `/admin/active-centers`
- `/admin/audit-log`

Expected results:

- the provider no longer appears in the draft center list
- the provider appears in the active centers read-only view
- the active centers view has no edit controls
- the audit log has `draft_center.public_profile_activated`
- the audit event references the center entity
- the audit metadata records public paths and sitemap refresh evidence
- draft still pending_review before final activation
- readiness blockers are zero before activation
- activation action re-checks readiness
- active centers remain read-only after activation

## Public route checks

Check both public profile routes recorded by the action:

- English public profile route
- Arabic public profile route

Expected public behavior:

- the profile loads only through the public eligibility wrapper
- generated fact-based profile summary is visible in the About section
- provider description or biography does not replace the generated summary baseline
- metadata description remains profile-specific through the profile summary contract
- metadata gate returns indexable only if eligible
- fallback missing route returns `noindex,follow` or notFound
- contact actions only show approved public contact values
- safe fallback copy appears when contact actions are absent
- medical safety note is visible
- directions links are safe external links
- services and doctors are filtered through public eligibility
- license copy only appears with `licenseInfo`
- relation previews are capped

## Import profile checks

Imported doctor, pharmacy, and hospital profiles must remain separate from native doctor and center profile readiness.

Before considering imported profiles soft-launch safe, confirm:

- imported doctor must be reviewed
- imported pharmacy must be reviewed
- imported hospital must be reviewed
- language present
- source present
- taxonomy signal present
- location present
- contact/map signal present
- name-only imported profile remains noindex
- imported profile metadata stays `noindex,follow` when import profile eligibility fails
- reviewed imported profile uses the public import summary helper
- Arabic output is checked where applicable

## Manual QA list

Run this manual QA set before soft launch:

- 1 English doctor profile
- 1 Arabic doctor profile
- 1 English center profile
- 1 Arabic center profile
- 1 missing/invalid center fallback
- 1 missing/invalid doctor fallback
- 1 imported doctor
- 1 imported pharmacy
- 1 imported hospital
- `/sitemap.xml`
- Security Advisor errors = 0

## Public claims that must not appear

The public profile, generated profile summary, metadata, sitemap output, and listing cards must not claim:

- best or top provider
- best doctors
- top-rated
- rating or review score
- rating schema
- review schema
- AggregateRating
- ratingValue
- reviewCount
- Book now
- booking guarantee
- open-now availability
- Open now
- available now
- booking availability
- insurance acceptance
- insurance accepted
- unsupported MOH approval
- MOH approved
- verified by MOH
- guaranteed provider availability
- guaranteed treatment
- emergency availability
- sponsored ranking

Any copy that implies one of these claims must be removed before the profile is considered soft-launch safe.

## Sitemap and search checks

After activation:

- sitemap may be revalidated by the final action
- sitemap inclusion must remain guarded by the existing sitemap validators
- public route eligibility must remain the source of truth for public center detail
- import sitemap policies must not be bypassed manually
- no native doctor/center profile sitemap expansion yet
- no query/filter URLs
- no preview URLs
- import sitemap remains reviewed/index_eligible/included only

Do not manually insert public sitemap entries during soft launch.

## Security launch blocker

Supabase Security Advisor Errors must be 0 before soft launch.

Warnings may remain only if tracked in the security warning backlog.

The current security warning backlog is separate from this checklist update and must not interrupt the profile SEO gate sequence unless an error appears.

## Rollback note

Soft launch activation is not a rollback workflow.

If a provider must be removed from public view, stop and use or create a separate deactivate or unpublish workflow with its own contract, audit event, route revalidation, and validator.

## Soft launch pass criteria

A provider passes the soft-launch operator check only when:

- readiness evidence was reviewed before activation
- final action succeeded without manual database edits
- admin active centers view shows the provider read-only
- audit log shows activation evidence
- English and Arabic public routes load safely
- generated fact-based profile summary is visible
- profile index eligibility passes or the profile remains `noindex,follow`
- public UI does not show unsupported claims
- imported profile checks pass for imported routes
- relation previews are capped
- sitemap behavior remains guarded
- Supabase Security Advisor Errors are 0

This checklist is intentionally strict. Soft launch is supposed to reduce risk, not decorate a rushed production mistake with a nicer name.
