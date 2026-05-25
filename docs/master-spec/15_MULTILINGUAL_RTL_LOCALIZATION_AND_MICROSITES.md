# 15_MULTILINGUAL_RTL_LOCALIZATION_AND_MICROSITES.md

# Multilingual RTL Localization — V10.1

Launch locales are exactly:
- `en` English, LTR
- `ar` Arabic for Oman, RTL

Arabic should be professional, clear and SEO-safe. Omani/local Arabic phrasing may be used in CTAs, ads, social copy, WhatsApp messages and local trust elements.

Not supported in MVP:
- `fa` Persian/Farsi
- `hi` Hindi
- `ur` Urdu

Do not generate `/fa` or `/hi` routes, dictionaries, sitemap entries, hreflang entries, public UI options or SEO pages in MVP.

All major public surfaces support language switching between English and Arabic only:
- homepage
- profiles
- directories
- claim profile
- for centers/doctors
- articles
- trust pages

Admin may be English-first in MVP. Center dashboard should support English and Arabic where user-facing.

Use central i18n config and dictionaries. No separate microsite language system. Create `translate-field.ts` helper for localized DB fallback.

Arabic is RTL. html lang and dir must be correct.

Microsites, if implemented, support `/en` and `/ar` only in MVP. Language switch preserves subdomain/path.

No fake runtime translations. No raw missing dictionary keys in production.
