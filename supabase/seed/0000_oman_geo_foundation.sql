with country_seed (
  code,
  slug,
  name_en,
  name_ar,
  phone_country_code,
  currency_code,
  sort_order
) as (
  values
    ('om'::country_code, 'oman', 'Oman', 'عُمان', '968', 'OMR', 10),
    ('ae'::country_code, 'united-arab-emirates', 'United Arab Emirates', 'الإمارات العربية المتحدة', '971', 'AED', 20),
    ('qa'::country_code, 'qatar', 'Qatar', 'قطر', '974', 'QAR', 30),
    ('bh'::country_code, 'bahrain', 'Bahrain', 'البحرين', '973', 'BHD', 40),
    ('kw'::country_code, 'kuwait', 'Kuwait', 'الكويت', '965', 'KWD', 50),
    ('sa'::country_code, 'saudi-arabia', 'Saudi Arabia', 'المملكة العربية السعودية', '966', 'SAR', 60),
    ('iq'::country_code, 'iraq', 'Iraq', 'العراق', '964', 'IQD', 70),
    ('sy'::country_code, 'syria', 'Syria', 'سوريا', '963', 'SYP', 80),
    ('jo'::country_code, 'jordan', 'Jordan', 'الأردن', '962', 'JOD', 90),
    ('lb'::country_code, 'lebanon', 'Lebanon', 'لبنان', '961', 'LBP', 100),
    ('ps'::country_code, 'palestine', 'Palestine', 'فلسطين', '970', null, 110),
    ('eg'::country_code, 'egypt', 'Egypt', 'مصر', '20', 'EGP', 120),
    ('ye'::country_code, 'yemen', 'Yemen', 'اليمن', '967', 'YER', 130),
    ('ma'::country_code, 'morocco', 'Morocco', 'المغرب', '212', 'MAD', 140),
    ('dz'::country_code, 'algeria', 'Algeria', 'الجزائر', '213', 'DZD', 150),
    ('tn'::country_code, 'tunisia', 'Tunisia', 'تونس', '216', 'TND', 160),
    ('ly'::country_code, 'libya', 'Libya', 'ليبيا', '218', 'LYD', 170),
    ('sd'::country_code, 'sudan', 'Sudan', 'السودان', '249', 'SDG', 180),
    ('mr'::country_code, 'mauritania', 'Mauritania', 'موريتانيا', '222', 'MRU', 190),
    ('ir'::country_code, 'iran', 'Iran', 'إيران', '98', 'IRR', 200)
), updated_countries as (
  update public.geo_countries target
  set
    slug = seed.slug,
    name_en = seed.name_en,
    name_ar = seed.name_ar,
    phone_country_code = seed.phone_country_code,
    currency_code = seed.currency_code,
    is_active = true,
    sort_order = seed.sort_order,
    deleted_at = null,
    metadata = jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-FULL-B'),
    updated_at = now()
  from country_seed seed
  where target.code = seed.code
  returning target.id, target.slug
)
insert into public.geo_countries (
  code,
  slug,
  name_en,
  name_ar,
  phone_country_code,
  currency_code,
  is_active,
  sort_order,
  metadata
)
select
  seed.code,
  seed.slug,
  seed.name_en,
  seed.name_ar,
  seed.phone_country_code,
  seed.currency_code,
  true,
  seed.sort_order,
  jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-FULL-B')
from country_seed seed
where not exists (
  select 1 from public.geo_countries existing where existing.code = seed.code
);

with oman_country as (
  select id from public.geo_countries where code = 'om'::country_code and deleted_at is null
), region_seed (
  slug,
  name_en,
  name_ar,
  sort_order
) as (
  values
    ('muscat-governorate', 'Muscat Governorate', 'محافظة مسقط', 10)
), region_rows as (
  select country.id as country_id, seed.*
  from region_seed seed
  cross join oman_country country
), updated_regions as (
  update public.geo_regions target
  set
    name_en = seed.name_en,
    name_ar = seed.name_ar,
    is_active = true,
    sort_order = seed.sort_order,
    deleted_at = null,
    metadata = jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-SEED-A'),
    updated_at = now()
  from region_rows seed
  where target.country_id = seed.country_id
    and target.slug = seed.slug
  returning target.id, target.slug
)
insert into public.geo_regions (
  country_id,
  slug,
  name_en,
  name_ar,
  is_active,
  sort_order,
  metadata
)
select
  seed.country_id,
  seed.slug,
  seed.name_en,
  seed.name_ar,
  true,
  seed.sort_order,
  jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-SEED-A')
from region_rows seed
where not exists (
  select 1
  from public.geo_regions existing
  where existing.country_id = seed.country_id
    and existing.slug = seed.slug
);

with oman_country as (
  select id from public.geo_countries where code = 'om'::country_code and deleted_at is null
), muscat_region as (
  select region.id
  from public.geo_regions region
  join oman_country country on country.id = region.country_id
  where region.slug = 'muscat-governorate'
    and region.deleted_at is null
), city_seed (
  slug,
  name_en,
  name_ar,
  is_capital,
  sort_order
) as (
  values
    ('muscat', 'Muscat', 'مسقط', true, 10)
), city_rows as (
  select country.id as country_id, region.id as region_id, seed.*
  from city_seed seed
  cross join oman_country country
  cross join muscat_region region
), updated_cities as (
  update public.geo_cities target
  set
    region_id = seed.region_id,
    name_en = seed.name_en,
    name_ar = seed.name_ar,
    is_capital = seed.is_capital,
    is_active = true,
    sort_order = seed.sort_order,
    deleted_at = null,
    metadata = jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-SEED-A'),
    updated_at = now()
  from city_rows seed
  where target.country_id = seed.country_id
    and target.slug = seed.slug
  returning target.id, target.slug
)
insert into public.geo_cities (
  country_id,
  region_id,
  slug,
  name_en,
  name_ar,
  is_capital,
  is_active,
  sort_order,
  metadata
)
select
  seed.country_id,
  seed.region_id,
  seed.slug,
  seed.name_en,
  seed.name_ar,
  seed.is_capital,
  true,
  seed.sort_order,
  jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-SEED-A')
from city_rows seed
where not exists (
  select 1
  from public.geo_cities existing
  where existing.country_id = seed.country_id
    and existing.slug = seed.slug
);

with oman_country as (
  select id from public.geo_countries where code = 'om'::country_code and deleted_at is null
), muscat_region as (
  select region.id
  from public.geo_regions region
  join oman_country country on country.id = region.country_id
  where region.slug = 'muscat-governorate'
    and region.deleted_at is null
), muscat_city as (
  select city.id
  from public.geo_cities city
  join oman_country country on country.id = city.country_id
  where city.slug = 'muscat'
    and city.deleted_at is null
), area_seed (
  slug,
  name_en,
  name_ar,
  sort_order
) as (
  values
    ('al-khuwair', 'Al Khuwair', 'الخوير', 10),
    ('al-azaiba', 'Al Azaiba', 'العذيبة', 20),
    ('al-ghubra', 'Al Ghubra', 'الغبرة', 30),
    ('bousher', 'Bousher', 'بوشر', 40),
    ('qurum', 'Qurum', 'القرم', 50),
    ('al-mawaleh', 'Al Mawaleh', 'الموالح', 60),
    ('muttrah', 'Muttrah', 'مطرح', 70),
    ('ruwi', 'Ruwi', 'روي', 80)
), area_rows as (
  select
    country.id as country_id,
    region.id as region_id,
    city.id as city_id,
    seed.*
  from area_seed seed
  cross join oman_country country
  cross join muscat_region region
  cross join muscat_city city
), updated_areas as (
  update public.geo_areas target
  set
    country_id = seed.country_id,
    region_id = seed.region_id,
    name_en = seed.name_en,
    name_ar = seed.name_ar,
    is_active = true,
    sort_order = seed.sort_order,
    deleted_at = null,
    metadata = jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-SEED-A'),
    updated_at = now()
  from area_rows seed
  where target.city_id = seed.city_id
    and target.slug = seed.slug
  returning target.id, target.slug
)
insert into public.geo_areas (
  country_id,
  region_id,
  city_id,
  slug,
  name_en,
  name_ar,
  is_active,
  sort_order,
  metadata
)
select
  seed.country_id,
  seed.region_id,
  seed.city_id,
  seed.slug,
  seed.name_en,
  seed.name_ar,
  true,
  seed.sort_order,
  jsonb_build_object('seed_key', seed.slug, 'seed_phase', 'GEO-SEED-A')
from area_rows seed
where not exists (
  select 1
  from public.geo_areas existing
  where existing.city_id = seed.city_id
    and existing.slug = seed.slug
);
