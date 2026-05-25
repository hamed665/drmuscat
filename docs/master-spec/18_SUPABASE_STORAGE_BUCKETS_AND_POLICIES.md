# 18_SUPABASE_STORAGE_BUCKETS_AND_POLICIES.md

# Supabase Storage Buckets and Policies

Buckets: public-media, private-documents, payment-receipts, contracts, license-files, video-assets.

Preferred MVP: signed upload URLs. Server validates ownership, creates pending media row, generates path, returns signed URL. Admin approves before public display.

Path conventions:
- public-media/organizations/{organization_id}/logo/{media_id}.jpg
- public-media/organizations/{organization_id}/cover/{media_id}.jpg
- public-media/organizations/{organization_id}/gallery/{media_id}.jpg
- public-media/doctors/{doctor_id}/profile/{media_id}.jpg
- license-files/{owner_type}/{owner_id}/{media_id}.pdf
- payment-receipts/{subscriber_type}/{subscriber_id}/{payment_id}.pdf
- contracts/{subscriber_type}/{subscriber_id}/{contract_id}.pdf

Images max 10MB. PDFs max 15MB. Videos admin-side only in Phase 1.

Do not create broad authenticated upload policies. Do not accept arbitrary external URLs except admin-approved YouTube video IDs.


## V10 Image Optimization and Video Decision
`video-assets` exists architecturally but is admin-only/future in MVP. The signed upload route must reject `video-assets` unless an admin-only video phase is explicitly approved.

For images, the original upload may be stored for admin/archive purposes, but public pages must serve optimized derivatives, never oversized originals.

Required derivative targets:
- thumbnail: max 320px wide, WebP/AVIF where supported
- card: max 640px wide
- profile/hero: max 1280px wide
- admin preview: max 900px wide

The system must preserve visual quality while reducing size. Strip unsafe metadata from public derivatives. Keep useful alt text fields. Never recompress repeatedly from an already-compressed derivative.
