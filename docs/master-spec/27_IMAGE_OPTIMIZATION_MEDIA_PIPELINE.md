# 27_IMAGE_OPTIMIZATION_MEDIA_PIPELINE.md

# Image Optimization and Media Pipeline

## 1. Goal
Uploaded images must keep visual quality while reducing public delivery size. The user should not see blurry garbage, and Google should not see a 7MB clinic logo because apparently pixels have mortgages now.

## 2. Canonical Upload Flow
1. Client requests signed upload URL.
2. Server validates ownership, bucket, role, MIME type and size.
3. Server creates `media_assets` row with `storage_bucket` and later `storage_path`.
4. Client uploads original to signed URL.
5. Server/admin job verifies upload.
6. Server generates derivatives.
7. Admin approves media when required.
8. Public pages serve approved derivatives through `next/image`.

## 3. Original Preservation
Original files may be preserved for audit/admin/archive, but public UI must not serve the original unless it is already small and intentionally approved.

## 4. Derivative Sizes
Required image variants:

| Variant | Max Width | Use |
|---|---:|---|
| thumbnail | 320px | admin lists, small previews |
| card | 640px | listing cards |
| profile | 1280px | profile hero/gallery |
| admin_preview | 900px | admin review |
| og | 1200x630 | social preview when needed |

Do not upscale images.

## 5. Formats
Preferred:
- AVIF where supported
- WebP fallback
- JPEG fallback for compatibility
- PNG only when transparency is actually needed

## 6. Quality Rules
- Use visually safe quality defaults: WebP 78-85, AVIF 50-65 depending library output.
- Never repeatedly recompress derivatives.
- Strip unsafe metadata from public derivatives.
- Preserve orientation.
- Reject suspicious or invalid image files.

## 7. Performance Rules
- Use `next/image` for public images.
- Set correct `sizes` for cards, hero and gallery.
- Use `priority` only for the true LCP image.
- Lazy-load gallery/card images.
- Avoid layout shift by reserving aspect ratio.
- Do not load hidden carousel images eagerly.

## 8. Storage Metadata
`media_assets` must store or reference:
- original bucket
- original path
- public derivative paths
- width/height per variant
- byte size per variant
- MIME/format per variant
- status
- alt text per locale
- approval metadata where applicable

If schema does not yet include a separate derivatives table, derivative metadata may be stored in a JSONB settings/metadata addition only after schema update is explicitly planned. Claude Code must not silently ignore derivative metadata.

## 9. Admin Media Review
Admin must see:
- original preview
- optimized preview
- file size before/after
- dimensions
- owner entity
- media role
- alt text fields
- approve/reject actions
- rejection reason

## 10. Public Media Safety
Public pages only display media with approved status and public bucket/derivative path. Private documents, receipts, contracts and licenses are never publicly displayed.
