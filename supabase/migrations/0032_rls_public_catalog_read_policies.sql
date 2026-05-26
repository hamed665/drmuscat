ALTER TABLE public.geo_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_practice_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY geo_countries_public_select
ON public.geo_countries
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY geo_regions_public_select
ON public.geo_regions
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY geo_cities_public_select
ON public.geo_cities
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY geo_areas_public_select
ON public.geo_areas
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY taxonomy_groups_public_select
ON public.taxonomy_groups
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY specialties_public_select
ON public.specialties
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY service_categories_public_select
ON public.service_categories
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY services_public_select
ON public.services
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY centers_public_select
ON public.centers
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true AND status = 'active');

CREATE POLICY center_locations_public_select
ON public.center_locations
FOR SELECT
TO anon, authenticated
USING (
  deleted_at IS NULL
  AND is_active = true
  AND EXISTS (
    SELECT 1
    FROM public.centers AS c
    WHERE c.id = center_locations.center_id
      AND c.deleted_at IS NULL
      AND c.is_active = true
      AND c.status = 'active'
  )
);

CREATE POLICY center_services_public_select
ON public.center_services
FOR SELECT
TO anon, authenticated
USING (
  deleted_at IS NULL
  AND is_available = true
  AND EXISTS (
    SELECT 1
    FROM public.centers AS c
    WHERE c.id = center_services.center_id
      AND c.deleted_at IS NULL
      AND c.is_active = true
      AND c.status = 'active'
  )
);

CREATE POLICY doctors_public_select
ON public.doctors
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND is_active = true AND status = 'active');

CREATE POLICY doctor_practice_locations_public_select
ON public.doctor_practice_locations
FOR SELECT
TO anon, authenticated
USING (
  deleted_at IS NULL
  AND is_active = true
  AND EXISTS (
    SELECT 1
    FROM public.doctors AS d
    WHERE d.id = doctor_practice_locations.doctor_id
      AND d.deleted_at IS NULL
      AND d.is_active = true
      AND d.status = 'active'
  )
  AND EXISTS (
    SELECT 1
    FROM public.centers AS c
    WHERE c.id = doctor_practice_locations.center_id
      AND c.deleted_at IS NULL
      AND c.is_active = true
      AND c.status = 'active'
  )
);

CREATE POLICY doctor_services_public_select
ON public.doctor_services
FOR SELECT
TO anon, authenticated
USING (
  deleted_at IS NULL
  AND is_available = true
  AND EXISTS (
    SELECT 1
    FROM public.doctors AS d
    WHERE d.id = doctor_services.doctor_id
      AND d.deleted_at IS NULL
      AND d.is_active = true
      AND d.status = 'active'
  )
);

CREATE POLICY reviews_public_select
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND status = 'approved');

CREATE POLICY media_assets_public_select
ON public.media_assets
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND status = 'approved');

CREATE POLICY entity_media_public_select
ON public.entity_media
FOR SELECT
TO anon, authenticated
USING (
  deleted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.media_assets AS ma
    WHERE ma.id = entity_media.media_asset_id
      AND ma.deleted_at IS NULL
      AND ma.status = 'approved'
  )
);
