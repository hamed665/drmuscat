# 46 — Multi-Country Geography and Doctor Profile System V10.2

This file is canonical for geographic scalability and doctor profile design.

## Geo Hierarchy

Required hierarchy:

```text
Country -> Region/Governorate -> City -> Area/Neighborhood -> Address/Location Point
```

Launch active country:

```text
Oman: slug `om`, ISO `OM`, currency `OMR`, phone code `+968`, timezone `Asia/Muscat`
```

Future launching countries may be configured as Coming Soon:

- UAE `ae`
- Saudi Arabia `sa`
- Qatar `qa`

## URL Strategy

Use country subfolder from launch:

```text
/en/om/centers
/ar/om/centers
/en/om/centers/dentistry/al-khuwair
/ar/om/centers/dentistry/al-khuwair
/en/om/muscat/al-mouj
/ar/om/muscat/al-mouj
/en/om/doctors/dr-hassan-al-balushi
/ar/om/doctors/dr-hassan-al-balushi
```

This keeps one domain authority now while allowing later country expansion. Separate domains may be supported later by mapping country config to domain strategy.

## Country Selector

Header must support a country/language selector:

- Oman active
- UAE/Saudi/Qatar Coming Soon lead capture optional
- English/Arabic toggle per active country

## Doctor Profile Requirements

Doctor profile pages are SEO-critical and trust-critical. Required sections:

- name EN/AR
- profile photo and cover
- verified/license badge
- specialty and sub-specialties
- years of experience
- spoken languages
- nationality optional
- practice locations
- services/procedures
- education
- career history
- certifications/memberships
- insurance accepted
- consultation fee range if available
- reviews and sub-ratings
- media gallery
- before/after only with explicit patient consent
- similar doctors
- structured data

## Multi-Location Practice

Doctors may practice in multiple centers with separate schedules. The doctor page must show each practice location and schedule. Center pages must show doctors practicing there.

## Languages Spoken Filter

Doctor and center search must support language filtering. Launch UI should support at least:

- Arabic
- English
- Hindi
- Urdu
- Malayalam
- Tagalog
- Bengali
- Persian as a spoken-language filter only if data exists, not as a site locale

This does not mean Persian/Hindi public route support. Spoken language is a profile attribute, not a site locale.

## Medical Safety

Doctor profiles must not claim guaranteed outcomes, superiority, or unverified credentials. License and verification claims must reflect actual admin-reviewed status.
