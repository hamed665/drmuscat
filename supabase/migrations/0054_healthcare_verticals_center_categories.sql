create table if not exists public.healthcare_verticals (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name_en text not null,
  name_ar text not null,
  description_en text null,
  description_ar text null,
  is_medical boolean not null default true,
  requires_medical_disclaimer boolean not null default false,
  is_human_health boolean not null default true,
  is_veterinary boolean not null default false,
  is_food_related boolean not null default false,
  schema_org_hint text null,
  public_directory_enabled boolean not null default false,
  public_profile_enabled boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint healthcare_verticals_slug_not_empty_check
    check (char_length(btrim(slug)) between 2 and 80),
  constraint healthcare_verticals_slug_format_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint healthcare_verticals_name_en_not_empty_check
    check (char_length(btrim(name_en)) between 2 and 160),
  constraint healthcare_verticals_name_ar_not_empty_check
    check (char_length(btrim(name_ar)) between 2 and 160),
  constraint healthcare_verticals_name_en_plain_text_check
    check (name_en !~* '<[^>]+>'),
  constraint healthcare_verticals_name_ar_plain_text_check
    check (name_ar !~* '<[^>]+>'),
  constraint healthcare_verticals_description_en_plain_text_check
    check (description_en is null or description_en !~* '<[^>]+>'),
  constraint healthcare_verticals_description_ar_plain_text_check
    check (description_ar is null or description_ar !~* '<[^>]+>'),
  constraint healthcare_verticals_schema_org_hint_check
    check (
      schema_org_hint is null
      or (
        char_length(btrim(schema_org_hint)) between 2 and 80
        and schema_org_hint !~* '<[^>]+>'
      )
    ),
  constraint healthcare_verticals_veterinary_not_human_health_check
    check (is_veterinary = false or is_human_health = false),
  constraint healthcare_verticals_food_not_medical_check
    check (is_food_related = false or is_medical = false)
);

create unique index if not exists healthcare_verticals_slug_active_unique_idx
  on public.healthcare_verticals (slug)
  where deleted_at is null;

create index if not exists healthcare_verticals_is_active_idx
  on public.healthcare_verticals (is_active);

create index if not exists healthcare_verticals_public_directory_enabled_idx
  on public.healthcare_verticals (public_directory_enabled)
  where deleted_at is null and is_active = true;

create index if not exists healthcare_verticals_deleted_at_idx
  on public.healthcare_verticals (deleted_at)
  where deleted_at is not null;

create table if not exists public.center_categories (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid not null references public.healthcare_verticals(id),
  parent_category_id uuid null references public.center_categories(id),
  slug text not null,
  name_en text not null,
  name_ar text not null,
  description_en text null,
  description_ar text null,
  default_center_type center_type null,
  is_medical boolean not null default true,
  requires_medical_disclaimer boolean not null default false,
  schema_org_hint text null,
  public_directory_enabled boolean not null default false,
  public_profile_enabled boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint center_categories_slug_not_empty_check
    check (char_length(btrim(slug)) between 2 and 80),
  constraint center_categories_slug_format_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint center_categories_name_en_not_empty_check
    check (char_length(btrim(name_en)) between 2 and 160),
  constraint center_categories_name_ar_not_empty_check
    check (char_length(btrim(name_ar)) between 2 and 160),
  constraint center_categories_parent_not_self_check
    check (parent_category_id is null or parent_category_id <> id),
  constraint center_categories_name_en_plain_text_check
    check (name_en !~* '<[^>]+>'),
  constraint center_categories_name_ar_plain_text_check
    check (name_ar !~* '<[^>]+>'),
  constraint center_categories_description_en_plain_text_check
    check (description_en is null or description_en !~* '<[^>]+>'),
  constraint center_categories_description_ar_plain_text_check
    check (description_ar is null or description_ar !~* '<[^>]+>'),
  constraint center_categories_schema_org_hint_check
    check (
      schema_org_hint is null
      or (
        char_length(btrim(schema_org_hint)) between 2 and 80
        and schema_org_hint !~* '<[^>]+>'
      )
    )
);

create unique index if not exists center_categories_vertical_slug_active_unique_idx
  on public.center_categories (vertical_id, slug)
  where deleted_at is null;

create index if not exists center_categories_vertical_id_idx
  on public.center_categories (vertical_id);

create index if not exists center_categories_parent_category_id_idx
  on public.center_categories (parent_category_id)
  where parent_category_id is not null;

create index if not exists center_categories_default_center_type_idx
  on public.center_categories (default_center_type)
  where default_center_type is not null;

create index if not exists center_categories_public_directory_enabled_idx
  on public.center_categories (public_directory_enabled)
  where deleted_at is null and is_active = true;

create index if not exists center_categories_deleted_at_idx
  on public.center_categories (deleted_at)
  where deleted_at is not null;

create table if not exists public.center_category_assignments (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id),
  vertical_id uuid not null references public.healthcare_verticals(id),
  category_id uuid not null references public.center_categories(id),
  is_primary boolean not null default false,
  is_public boolean not null default false,
  review_status text not null default 'draft',
  reviewed_by_profile_id uuid null references public.profiles(id),
  reviewed_at timestamptz null,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint center_category_assignments_review_status_check
    check (review_status in ('draft', 'pending_review', 'approved', 'rejected', 'archived')),
  constraint center_category_assignments_public_requires_approved_check
    check (is_public = false or review_status = 'approved'),
  constraint center_category_assignments_reviewed_at_status_check
    check (reviewed_at is null or review_status in ('approved', 'rejected', 'archived'))
);

create unique index if not exists center_category_assignments_center_category_active_unique_idx
  on public.center_category_assignments (center_id, category_id)
  where deleted_at is null;

create index if not exists center_category_assignments_center_id_idx
  on public.center_category_assignments (center_id);

create index if not exists center_category_assignments_vertical_id_idx
  on public.center_category_assignments (vertical_id);

create index if not exists center_category_assignments_category_id_idx
  on public.center_category_assignments (category_id);

create index if not exists center_category_assignments_review_status_idx
  on public.center_category_assignments (review_status);

create index if not exists center_category_assignments_primary_idx
  on public.center_category_assignments (center_id)
  where deleted_at is null and is_primary = true;

create index if not exists center_category_assignments_public_idx
  on public.center_category_assignments (center_id, category_id)
  where deleted_at is null and is_public = true;

create index if not exists center_category_assignments_deleted_at_idx
  on public.center_category_assignments (deleted_at)
  where deleted_at is not null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_healthcare_verticals_updated_at'
  ) then
    create trigger set_healthcare_verticals_updated_at
    before update on public.healthcare_verticals
    for each row
    execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_center_categories_updated_at'
  ) then
    create trigger set_center_categories_updated_at
    before update on public.center_categories
    for each row
    execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_center_category_assignments_updated_at'
  ) then
    create trigger set_center_category_assignments_updated_at
    before update on public.center_category_assignments
    for each row
    execute function public.set_updated_at();
  end if;
end $$;
