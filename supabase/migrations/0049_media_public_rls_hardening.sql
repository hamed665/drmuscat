-- Phase 4.6F-2: public media RLS hardening
-- Purpose: require explicit item visibility and approval for public provider media reads.

ALTER POLICY entity_media_public_select
ON public.entity_media
TO anon, authenticated
USING (
  deleted_at IS NULL
  AND public_media_visible = true
  AND media_review_status = 'approved'
  AND entity_type IN ('center', 'doctor')
  AND usage_kind IN ('logo', 'cover', 'profile', 'gallery', 'thumbnail')
  AND EXISTS (
    SELECT 1
    FROM public.media_assets
    WHERE media_assets.id = entity_media.media_asset_id
      AND media_assets.deleted_at IS NULL
      AND media_assets.status = 'approved'
      AND media_assets.mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
  )
);
