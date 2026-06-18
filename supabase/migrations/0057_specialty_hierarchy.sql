alter table public.specialties
  add column if not exists parent_specialty_id uuid null references public.specialties(id);

create index if not exists specialties_parent_specialty_id_idx
  on public.specialties (parent_specialty_id)
  where parent_specialty_id is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'specialties_parent_not_self_check'
      and conrelid = 'public.specialties'::regclass
  ) then
    alter table public.specialties
      add constraint specialties_parent_not_self_check
      check (parent_specialty_id is null or parent_specialty_id <> id);
  end if;
end $$;
