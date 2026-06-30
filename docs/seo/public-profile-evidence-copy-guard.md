# Public profile evidence copy guard

Public doctor and center profile copy must stay tied to evidence that is actually present in the public data model. The profile UI may help users discover providers, but it must not imply official approval, live availability, booking guarantees, insurance coverage, or emergency care.

This guard is deliberately boring. Boring is how a medical directory avoids turning into a legal confetti cannon.

## Guarded rules

- License information can render only through `PublicLicenseInfoCard` and only when `licenseInfo` exists.
- `verificationStatus === 'verified'` means a DrKhaleej internal profile state, not official regulator approval.
- Verification copy must explicitly say it is not a license or official approval claim.
- Contact actions must come from approved public contact action arrays, not from listing-card shortcuts or free text.
- Contact fallback copy must tell users to confirm details with the provider.
- Discovery pages must avoid live availability promises, emergency-care promises, booking promises, insurance claims, and ranking claims.

## Covered files

- `src/components/public/public-center-detail.tsx`
- `src/components/public/public-doctor-detail.tsx`
- `src/components/public/public-license-info-card.tsx`

## Out of scope

This is not a provider-copy review workflow. Provider-written descriptions still need their own draft, pending review, approved, and rejected contract before they can be used as public claims.
