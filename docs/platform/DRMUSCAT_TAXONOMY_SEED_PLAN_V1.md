# DrMuscat Taxonomy Seed Plan V1

## 1. Purpose

This document is a documentation-only seed plan for the first DrMuscat taxonomy seed phase.

It defines the human-reviewed initial bilingual catalog for:

- healthcare verticals
- center categories
- public directory flags
- active/disabled policy
- healthy food and veterinary launch boundaries

This plan does not insert seed rows, create migrations, change RLS, update generated types, add routes, add UI, activate public pages, add provider dashboard features, add media, add reviews, add offers, add ads, add billing, or add AI behavior.

## 2. Required prior phases

This seed plan assumes these phases are already complete:

- MODEL-A / TAX-A provider profile and taxonomy model spec
- TAX-B taxonomy schema plan
- TAX-C1-PLAN migration boundary plan
- TAX-C1-DB vertical/category table migration
- TAX-RLS-A public read policies for approved taxonomy rows

## 3. Seed phase boundary

TAX-SEED-A is planning only.

TAX-SEED-B may later implement the approved rows only if this plan is accepted.

TAX-SEED-B must not add:

- providers
- centers
- doctors
- reviews
- ratings
- insurance providers
- license authorities
- offers
- ads
- media
- articles
- AI content
- public routes

## 4. Core seed rules

Every seed row must have:

- stable slug
- English name
- Arabic name
- English description
- Arabic description
- public flag decision
- active flag decision
- schema.org safety note where relevant
- no fake entity data

No free-text category should be seeded without a matching English and Arabic label.

No public-facing medical claim should be seeded unless the wording is generic and non-diagnostic.

## 5. Initial healthcare vertical seed candidates

These verticals should be seeded in TAX-SEED-B unless a human reviewer removes them.

| slug | name_en | name_ar | active | public_directory_enabled | public_profile_enabled | notes |
| --- | --- | --- | --- | --- | --- | --- |
| medical | Medical | طبي | true | true | true | Human medical providers. |
| dental | Dental | طب الأسنان | true | true | true | Dental providers and services. |
| aesthetic | Aesthetic & Beauty | التجميل والعناية | true | true | true | Beauty/aesthetic health-adjacent providers. |
| diagnostics | Diagnostics | التشخيص | true | true | true | Labs and imaging centers. |
| pharmacy | Pharmacy | صيدلية | true | true | true | Pharmacies. |
| wellness | Wellness | العافية | true | true | true | Wellness centers and preventive health. |
| fitness | Fitness | اللياقة | true | false | true | Planned for profiles, directory later after scope review. |
| nutrition | Nutrition | التغذية | true | true | true | Diet and nutrition providers. |
| home_care | Home Care | الرعاية المنزلية | true | true | true | Home care and home health services. |
| rehabilitation | Rehabilitation | التأهيل | true | true | true | Rehabilitation and recovery providers. |
| mental_health | Mental Health | الصحة النفسية | true | true | true | Psychology, psychiatry, counseling. |
| optical_eye_care | Optical & Eye Care | البصريات ورعاية العيون | true | true | true | Optical and eye care. |
| veterinary | Veterinary / Pet Health | الطب البيطري ورعاية الحيوانات | false | false | false | Planned but disabled until product scope approval. |
| healthy_food | Healthy Food | الطعام الصحي | false | false | false | Planned but disabled until product scope approval. |
| other_health | Other Health Services | خدمات صحية أخرى | true | false | true | Controlled fallback, not a dumping ground. |

## 6. Healthcare vertical descriptions

TAX-SEED-B should include generic bilingual descriptions.

Recommended descriptions:

### medical

- description_en: Clinics, hospitals, and medical providers in Oman.
- description_ar: عيادات ومستشفيات ومقدمو خدمات طبية في عُمان.

### dental

- description_en: Dental clinics and oral health providers in Oman.
- description_ar: عيادات الأسنان ومقدمو رعاية صحة الفم في عُمان.

### aesthetic

- description_en: Aesthetic, dermatology, beauty, and personal care providers.
- description_ar: مقدمو خدمات التجميل والجلدية والعناية الشخصية.

### diagnostics

- description_en: Medical laboratories, imaging centers, and diagnostic services.
- description_ar: المختبرات الطبية ومراكز التصوير وخدمات التشخيص.

### pharmacy

- description_en: Pharmacies and medicine-related services.
- description_ar: الصيدليات والخدمات المرتبطة بالأدوية.

### wellness

- description_en: Wellness, preventive health, and wellbeing providers.
- description_ar: مقدمو خدمات العافية والصحة الوقائية والرفاه.

### fitness

- description_en: Fitness and sports health providers.
- description_ar: مقدمو خدمات اللياقة والصحة الرياضية.

### nutrition

- description_en: Nutrition, diet, and weight management providers.
- description_ar: مقدمو خدمات التغذية والحمية وإدارة الوزن.

### home_care

- description_en: Home healthcare and home support services.
- description_ar: خدمات الرعاية الصحية والدعم المنزلي.

### rehabilitation

- description_en: Rehabilitation, recovery, and therapy providers.
- description_ar: مقدمو خدمات التأهيل والتعافي والعلاج.

### mental_health

- description_en: Mental health, counseling, and psychology providers.
- description_ar: مقدمو خدمات الصحة النفسية والاستشارات وعلم النفس.

### optical_eye_care

- description_en: Optical, vision, and eye care providers.
- description_ar: مقدمو خدمات البصريات والنظر ورعاية العيون.

### veterinary

- description_en: Veterinary and pet health providers. Planned but not public yet.
- description_ar: مقدمو خدمات الطب البيطري ورعاية الحيوانات. مخطط له ولم يتم إطلاقه للعامة بعد.

### healthy_food

- description_en: Healthy food providers. Planned but not public yet.
- description_ar: مقدمو الطعام الصحي. مخطط له ولم يتم إطلاقه للعامة بعد.

### other_health

- description_en: Other approved health-related providers.
- description_ar: مقدمو خدمات صحية أخرى معتمدة.

## 7. Initial center category seed candidates

These category rows should be attached to the matching verticals.

| vertical_slug | slug | name_en | name_ar | default_center_type | active | public_directory_enabled | public_profile_enabled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| medical | clinic | Clinic | عيادة | clinic | true | true | true |
| medical | hospital | Hospital | مستشفى | hospital | true | true | true |
| medical | medical-center | Medical Center | مركز طبي | clinic | true | true | true |
| dental | dental-clinic | Dental Clinic | عيادة أسنان | dental_clinic | true | true | true |
| aesthetic | aesthetic-clinic | Aesthetic Clinic | عيادة تجميل | beauty_clinic | true | true | true |
| aesthetic | dermatology-clinic | Dermatology Clinic | عيادة جلدية | clinic | true | true | true |
| diagnostics | medical-laboratory | Medical Laboratory | مختبر طبي | laboratory | true | true | true |
| diagnostics | imaging-center | Imaging Center | مركز تصوير طبي | imaging_center | true | true | true |
| pharmacy | pharmacy | Pharmacy | صيدلية | pharmacy | true | true | true |
| wellness | wellness-center | Wellness Center | مركز عافية | wellness_center | true | true | true |
| wellness | spa-wellness | Spa & Wellness | سبا وعافية | wellness_center | true | false | true |
| fitness | gym-fitness-center | Gym / Fitness Center | نادي رياضي / مركز لياقة | other | true | false | true |
| nutrition | nutrition-center | Nutrition Center | مركز تغذية | wellness_center | true | true | true |
| nutrition | dietitian-clinic | Dietitian Clinic | عيادة أخصائي تغذية | clinic | true | true | true |
| home_care | home-healthcare | Home Healthcare | رعاية صحية منزلية | other | true | true | true |
| rehabilitation | physiotherapy-center | Physiotherapy Center | مركز علاج طبيعي | physiotherapy_center | true | true | true |
| rehabilitation | rehabilitation-center | Rehabilitation Center | مركز تأهيل | physiotherapy_center | true | true | true |
| mental_health | psychology-clinic | Psychology Clinic | عيادة نفسية | clinic | true | true | true |
| mental_health | psychiatry-clinic | Psychiatry Clinic | عيادة طب نفسي | clinic | true | true | true |
| optical_eye_care | eye-clinic | Eye Clinic | عيادة عيون | clinic | true | true | true |
| optical_eye_care | optical-store | Optical Store | محل بصريات | other | true | true | true |
| veterinary | pet-clinic | Pet Clinic | عيادة حيوانات أليفة | other | false | false | false |
| veterinary | veterinary-clinic | Veterinary Clinic | عيادة بيطرية | other | false | false | false |
| healthy_food | healthy-restaurant | Healthy Restaurant | مطعم صحي | other | false | false | false |
| healthy_food | healthy-cafe | Healthy Cafe | مقهى صحي | other | false | false | false |
| other_health | other-health-service | Other Health Service | خدمة صحية أخرى | other | true | false | true |

## 8. Category description defaults

TAX-SEED-B may use short generic descriptions. Descriptions must not promise medical outcomes.

Examples:

- Clinic: General clinic and outpatient healthcare provider.
- عيادة: عيادة عامة أو مقدم رعاية صحية خارجية.
- Medical Laboratory: Laboratory testing and diagnostic sample services.
- مختبر طبي: خدمات الفحوصات المخبرية والعينات التشخيصية.
- Gym / Fitness Center: Fitness and sports activity provider.
- نادي رياضي / مركز لياقة: مقدم خدمات اللياقة والأنشطة الرياضية.
- Pet Clinic: Veterinary care for pets. Planned but disabled.
- عيادة حيوانات أليفة: رعاية بيطرية للحيوانات الأليفة. مخطط لها وغير مفعلة.
- Healthy Restaurant: Healthy food provider. Planned but disabled.
- مطعم صحي: مقدم طعام صحي. مخطط له وغير مفعل.

## 9. Disabled categories policy

The following must remain disabled in TAX-SEED-B unless separately approved:

- veterinary
- pet-clinic
- veterinary-clinic
- healthy_food
- healthy-restaurant
- healthy-cafe

Reason:

- veterinary must not be mixed with human medical schema
- healthy food must not be presented as a medical provider
- public routes and schema.org policy are not implemented yet for these verticals

## 10. Public flag policy

Initial public_directory_enabled rules:

- true for core human healthcare categories
- false for fitness until content and business scope are approved
- false for veterinary until product scope is approved
- false for healthy_food until product scope is approved
- false for fallback other_health directory, but profile support may remain true

Initial public_profile_enabled rules:

- true for core categories
- false for disabled future verticals
- true for controlled fallback category

## 11. Slug rules

Slugs must:

- use lowercase English
- use hyphen separators
- avoid plural if singular is clearer
- be stable forever once seeded
- not include country/city/area
- not include Arabic letters in canonical slug

Good:

- `medical-laboratory`
- `dental-clinic`
- `physiotherapy-center`

Bad:

- `labs-in-muscat`
- `عيادة-اسنان`
- `best-clinic`

## 12. Arabic label quality notes

Arabic labels should be Modern Standard Arabic, suitable for Oman/GCC public UI.

Avoid overly informal dialect in canonical taxonomy labels.

Omani dialect can be used later in marketing copy, captions, or social content, not canonical taxonomy labels.

## 13. Schema.org safety notes

TAX-SEED-B must not seed schema_org_hint values until a separate schema policy review approves exact values.

Recommended TAX-SEED-B default:

- `schema_org_hint = null`

Reason:

- Medical schema must match entity type
- healthy food must not be MedicalClinic
- veterinary must not be human medical schema
- pharmacy/lab/dental schema choices require separate SEO review

## 14. TAX-SEED-B implementation rules

If approved, TAX-SEED-B should:

- create a seed migration or seed file according to project convention
- insert only the approved vertical/category rows from this plan
- be idempotent
- avoid duplicate slugs
- not seed centers/providers/doctors
- not seed reviews/ratings
- not seed insurance/license authorities
- keep disabled categories inactive and non-public
- pass seed validation and static seed tests

## 15. Validation expectations for TAX-SEED-B

TAX-SEED-B must add or update validation to ensure:

- all seeded verticals have English and Arabic names
- all seeded categories have English and Arabic names
- disabled categories remain non-public
- veterinary and healthy food remain disabled unless explicitly approved
- no fake providers or fake reviews are added
- no insurance/license authorities are seeded from memory

## 16. Acceptance criteria

TAX-SEED-A is complete when it documents:

- approved vertical seed candidates
- approved center category seed candidates
- bilingual labels
- public flag policy
- disabled future vertical policy
- schema.org safety notes
- TAX-SEED-B implementation rules
- TAX-SEED-B validation expectations

This document does not make any seed data live.
