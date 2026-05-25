create table if not exists public.centers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text null,
  legal_name text null,
  center_type center_type not null,
  status provider_status not null default 'draft',
  verification_status verification_status not null default 'unverified',
  primary_phone text null,
  secondary_phone text null,
  whatsapp_phone text null,
  email text null,
  website_url text null,
  logo_url text null,
  cover_image_url text null,
  short_description_en text null,
  short_description_ar text null,
  description_en text null,
  description_ar text null,
  default_locale app_locale not null default 'en',
  default_country country_code not null default 'om',
  is_active boolean not null default true,
  is_claimable boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint centers_email_format_check check (
    email is null or email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  ),
  constraint centers_website_url_format_check check (
    website_url is null or website_url ~* '^https?://[^\s/$.?#].[^\s]*$'
  )
);

create index if not exists centers_status_idx
  on public.centers (status);

create index if not exists centers_center_type_idx
  on public.centers (center_type);

create index if not exists centers_verification_status_idx
  on public.centers (verification_status);

create index if not exists centers_default_country_idx
  on public.centers (default_country);

create index if not exists centers_deleted_at_idx
  on public.centers (deleted_at)
  where deleted_at is not null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_centers_updated_at'
  ) then
    create trigger set_centers_updated_at
    before update on public.centers
    for each row
    execute function public.set_updated_at();
  end if;
end $$;
