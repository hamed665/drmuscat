# Launch Smoke Checklist

This checklist records the minimum operational chain required before a provider profile can be safely activated and verified after activation.

## Admin readiness chain

The admin draft center page must expose the full read-only preparation chain before the final control:

- workflow panel
- taxonomy panel
- location panel
- contact review panel
- publication readiness panel
- quality panel

The readiness panel must show blockers, warnings, evidence summary, public flags, verification state, taxonomy review state, and active location count.

## Final admin control

The final admin form must:

- pass only the center id to the server action
- stay disabled until readiness can pass
- show a server result message
- rely on the server action to re-check readiness before any public state changes

## Server action chain

The final server action must:

- require `draft_centers.update`
- call the publication readiness helper before changing state
- require the center to still be in `pending_review`
- require `is_active` to still be false
- require `is_claimable` to still be false
- set the provider status to active
- set active state to true
- keep claimable state false
- write an admin audit event
- revalidate the admin draft page
- revalidate both English and Arabic public profile routes
- revalidate sitemap

The final server action must not change verification status, contact visibility fields, billing fields, sponsorship fields, claim state, taxonomy assignment, or commercial add-ons.

## Public route chain

Public center routes must continue to use the public eligibility wrapper.

The public UI must remain launch-safe:

- no fake rating copy
- no open-now copy
- no booking copy
- no insurance copy
- no unsupported MOH approval claim
- no best/top provider claims
- no guaranteed availability copy
- safe contact fallback copy when public contact actions are absent
- medical safety disclaimer remains visible

## Sitemap and index chain

Sitemap output must remain guarded by existing sitemap and import validators.

The final activation chain may revalidate sitemap, but no unrelated workflow may directly add unsafe public sitemap entries.

## Required validators in `seo:check`

The full launch chain requires these validators inside `seo:check`:

- `admin:provider-publication-contract:validate`
- `admin:final-chain:validate`
- `seo:public-catalog-eligibility:validate`
- `seo:public-listing-card-safety:validate`
- `seo:public-launch-safe-ui:validate`
- `import:publish-readiness-audit:validate`
- `import:sitemap-family-caps:validate`
- `import:profile-smoke:validate`
- `import:pharmacy-profile-route:validate`
- `import:hospital-profile-route:validate`

## Launch smoke result

A launch smoke pass means the repository still has:

- a gated admin preparation page
- a gated server action
- a guarded public UI
- guarded public route eligibility
- guarded sitemap inclusion
- audit evidence for the final action

A launch smoke pass does not mean every provider should be activated. It only means the activation workflow is structurally protected.
