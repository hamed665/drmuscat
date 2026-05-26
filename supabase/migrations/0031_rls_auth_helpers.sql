CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM public.profiles AS p
  WHERE p.auth_user_id = auth.uid()
    AND p.deleted_at IS NULL
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.auth_user_id = auth.uid()
      AND p.deleted_at IS NULL
      AND p.is_platform_admin = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_provider_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.auth_user_id = auth.uid()
      AND p.deleted_at IS NULL
      AND p.is_provider_user = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_patient_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.auth_user_id = auth.uid()
      AND p.deleted_at IS NULL
      AND p.is_patient_user = true
  );
$$;
