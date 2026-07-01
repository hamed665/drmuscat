# Final Launch Chain Recap

This recap records the protected provider path from draft preparation to public visibility and admin review.

It is a documentation checkpoint, not a new runtime workflow.

## 1. Draft creation and preparation

A provider starts inside the draft center workflow. Draft records are intentionally private and must stay out of public routes until the final guarded admin step.

Required draft preparation surfaces:

- provider lead review
- manual draft center creation
- draft center workflow panel
- draft center taxonomy panel
- draft center location panel
- draft center contact review panel
- draft center quality panel
- publication readiness panel

The draft workflow remains limited to:

- `draft`
- `pending_review`

## 2. Readiness before activation

The readiness helper and panel must keep activation blocked until required evidence is present.

The chain checks include:

- center status is still `pending_review`
- public flags are still inactive before the final step
- at least one active location exists
- taxonomy is present and approved
- unsupported public claims are not introduced
- blocker count is zero
- profile index eligibility is understood before indexable metadata is allowed
- profile completeness is internal-only and not exposed as a public score
- provider copy is approved or not public
- relation previews remain capped

The readiness panel is allowed to expose evidence and the final gated control, but the server action must re-check readiness before changing public state.

## 3. Final admin action

The final server action must:

- require `draft_centers.update`
- call the readiness helper
- require `status` to still be `pending_review`
- require `is_active` to still be false
- require `is_claimable` to still be false
- set `status` to `active`
- set `is_active` to true
- keep `is_claimable` false
- write `draft_center.public_profile_activated`
- revalidate the admin draft page
- revalidate English and Arabic public profile routes
- revalidate sitemap

The final server action must not change verification state, contact visibility, billing, claim state, sponsorship, taxonomy assignment, or commercial add-ons.

## 4. Public route eligibility

Public center routes must continue using the explicit public eligibility wrapper.

Public center listing, public center detail, and public search must require:

- `is_active` equals true
- `status` equals `active`
- safe verification status
- `deleted_at` is null

Native doctor/center profile indexability uses profile index eligibility.

Native public profile indexability must go through:

- `isPublicProfileIndexEligible`
- `applyProfileMetadataIndexGate`
- `buildProfileNoindexMetadata`
- `robots: { index: false, follow: true }`
- `fromPublicEligibleQuery: true`

Profile metadata index gate is launch-critical.

Fallback profile metadata must fail closed as `noindex,follow` or notFound.

Public center detail must filter related locations, services, doctors, and practice links through eligibility logic. Relation failures must fail closed.

Relation limit guard is launch-critical.

## 5. Import profile boundary

Import profile eligibility remains separate from native profile eligibility.

Imported doctor, pharmacy, and hospital profile indexability must continue using the import profile eligibility gate and reviewed import evidence.

Imported name-only profiles remain `noindex,follow`.

Imported profile indexability requires source, location, language, taxonomy signal, and contact-or-map signal.

## 6. Sitemap boundary

Profile sitemap expansion remains off unless a promotion gate exists.

Native doctor/center profile sitemap expansion remains blocked during soft launch.

The sitemap must stay limited to static SEO pages plus reviewed import sitemap entries.

Import sitemap entries must remain reviewed, `index_eligible`, `index`, and `included`.

No query URLs, filter URLs, preview URLs, admin URLs, provider-dashboard URLs, booking URLs, insurance URLs, rating schema, review schema, or native profile bulk expansion are approved by this recap.

## 7. Public UI safety

Public UI must remain launch-safe:

- no fake rating copy
- no rating schema
- no review schema
- no open-now copy
- no booking copy
- no insurance copy
- no unsupported MOH approval claim
- no best/top provider claims
- no guaranteed availability copy
- no emergency availability copy
- safe contact fallback remains available
- medical safety note remains visible
- license copy appears only with `licenseInfo`
- contact actions come only from approved public contact arrays

## 8. Post-activation admin review

After activation, the provider leaves the draft workflow.

Admin review is handled by:

- active centers read-only view
- audit log read-only route
- public English profile route
- public Arabic profile route

The active centers view must not provide edit forms, mutation actions, verification changes, contact visibility changes, billing, claim, or commercial controls.

The audit route must remain read-only and gated by `admin.audit.read`.

## 9. Required validators in `seo:check`

The following validators must stay wired into `seo:check`:

- `admin:provider-publication-contract:validate`
- `admin:final-chain:validate`
- `admin:launch-checklist:validate`
- `admin:post-activation:validate`
- `admin:provider-view-contract:validate`
- `admin:active-centers-readonly:validate`
- `admin:audit-log-readonly:validate`
- `admin:soft-launch-checklist:validate`
- `seo:public-catalog-eligibility:validate`
- `seo:public-listing-card-safety:validate`
- `seo:public-launch-safe-ui:validate`
- `scripts/seo/check-soft-launch-profile-seo-gate.mjs`
- `scripts/seo/check-public-profile-index-eligibility-contract.mjs`
- `scripts/seo/check-profile-relation-limit-guard.mjs`
- `import:publish-readiness-audit:validate`
- `import:sitemap-family-caps:validate`
- `import:profile-smoke:validate`

The soft launch profile SEO gate is reached through `seo:public-listing-card-safety:validate`, which chains `check-public-profile-index-eligibility-contract.mjs`, which chains `check-soft-launch-profile-seo-gate.mjs`.

Yes, that is a chain. No, it should not be “simplified” by silently deleting one link like a tiny act of sabotage wearing a refactor badge.

## 10. Security launch blocker

Supabase Security Advisor Errors must be 0 before soft launch.

Warnings may remain only if tracked in the security warning backlog.

Security warning hardening is a separate post-profile-SEO sequence and does not approve skipping the profile gate.

## 11. What this recap does not approve

This recap does not approve:

- bulk activation
- live provider editing
- claim workflow changes
- billing changes
- sponsor placement changes
- public ranking claims
- user-generated reviews
- open-now or booking claims
- verified by MOH claims
- insurance accepted claims
- native profile sitemap expansion
- GEO/index expansion
- Supabase warning migrations inside profile SEO PRs

Those must each have their own contract, runtime guard, and CI validator before they become active workflows.
