# 20_UTF8_MEDICAL_CLAIM_GUARDRAILS.md

# DrMuscat V10.3 — UTF-8, Arabic/English Text Safety, and Medical Claim Guardrails

## 1. Purpose
This file defines content validation rules for multilingual medical directory content. It protects DrMuscat from broken Arabic text, mojibake, spammy SEO content, and unsafe medical claims.

It applies to:
- center profiles.
- doctor profiles.
- service descriptions.
- offers.
- reviews.
- FAQ blocks.
- AI summary blocks.
- SEO intros.
- articles.
- notifications.

---

## 2. Encoding Rules

### 2.1 Required encoding
All text files, database content, import files, and generated pages must use UTF-8.

### 2.2 Prohibited encoding symptoms
Reject or flag content containing obvious mojibake:

```text
Ø
Ù
Ã
Â
�
????
```

Do not blindly reject legitimate characters if context proves valid, but imported content with repeated mojibake patterns must fail validation.

### 2.3 Arabic text handling
Arabic content must support:
- Arabic letters.
- Arabic punctuation.
- Arabic-Indic and Western numerals.
- mixed English medical terms.
- phone numbers.
- URLs only in approved fields.

---

## 3. Language Field Rules

For public SEO pages:

```text
name_en required for English pages
name_ar required for Arabic pages
slug_en or normalized slug required where applicable
slug_ar optional unless Arabic slug strategy is approved
meta_title_en/meta_description_en required for indexable English pages
meta_title_ar/meta_description_ar required for indexable Arabic pages
```

If Arabic content is missing, the Arabic page must either:
- use a verified fallback with warning in admin, or
- be noindex until content is complete.

---

## 4. Medical Claim Safety

### 4.1 Forbidden claim patterns
Content must be flagged if it contains claims equivalent to:

```text
guaranteed cure
100% cure
permanent cure guaranteed
no risk
risk-free surgery
best doctor in Oman unless objectively awarded and sourced
number one clinic unless verifiable
cures all diseases
instant cure
miracle treatment
```

Arabic/Omani equivalents must be flagged, including but not limited to:

```text
شفاء مضمون
علاج مضمون 100%
بدون أي مخاطر
أفضل دكتور في عمان
العيادة رقم واحد
علاج نهائي لكل الحالات
نتيجة مضمونة
```

Persian/Hindi public launch routes are not supported, but imported Persian/Hindi text in admin notes must still not leak into public SEO pages.

### 4.2 Safer replacement style
Unsafe:

```text
Guaranteed 100% permanent cure for back pain.
```

Allowed style:

```text
Provides consultation and treatment options for back pain. Suitability depends on clinical assessment.
```

Unsafe Arabic:

```text
نضمن لك الشفاء النهائي بدون أي مخاطر.
```

Allowed Arabic:

```text
يوفر المركز استشارات وخيارات علاجية، وتعتمد ملاءمة العلاج على تقييم الطبيب.
```

---

## 5. Offer Content Guardrails

Patient offers must include:

```text
offer title
provider name
validity period
terms and conditions
medical disclaimer
redemption method
```

Offers must not say:
- guaranteed outcome.
- treatment is suitable for everyone.
- emergency care replacement.
- misleading original price if not verifiable.

---

## 6. Review Guardrails

Reviews must be moderated for:

```text
profanity
personal attacks
private medical details
phone numbers
emails
accusations that require legal review
fake review indicators
provider self-review
```

Private medical details should be redacted or rejected unless clearly safe and user-approved for public display.

---

## 7. Regex/Test Case Guidance

### 7.1 Mojibake detection examples
Flag when content includes repeated patterns:

```regex
(Ø|Ù|Ã|Â|�){2,}
(\?\?\?\?+)
```

### 7.2 Unsafe English claim examples

```regex
(?i)\b(guaranteed|100%|risk[- ]?free|miracle|permanent cure|cures all)\b
(?i)\b(best|number one|#1)\b.*\b(doctor|clinic|hospital|dentist)\b
```

### 7.3 Unsafe Arabic claim examples

```regex
(شفاء\s*مضمون|علاج\s*مضمون|بدون\s*أي\s*مخاطر|نتيجة\s*مضمونة|رقم\s*واحد|أفضل\s*دكتور)
```

These regexes are guardrails, not final legal judgment. Flag for review instead of auto-deleting when context is uncertain.

---

## 8. Import Validation

Bulk import must:

```text
- validate UTF-8
- detect mojibake
- normalize whitespace
- trim invisible characters
- reject unsafe public claims or place rows into review queue
- report row-level errors
- preserve original imported source for audit
```

---

## 9. Admin Review Workflow

Flagged content status:

```text
clean
needs_review
rejected
approved_with_edits
approved
```

Admin/content reviewer must see:
- field name.
- offending phrase.
- suggested safer rewrite.
- entity affected.
- public page impact.

---

## 10. Acceptance Criteria

```text
- UTF-8 validation exists for imports and public content fields.
- Mojibake detection is tested.
- English and Arabic unsafe claim patterns are tested.
- Flagged content does not become indexable until reviewed.
- Offer medical disclaimer is required.
- Review moderation handles private medical details.
- AI summary blocks only use approved safe public content.
- No Health Card/card sales wording appears in public content.
```
