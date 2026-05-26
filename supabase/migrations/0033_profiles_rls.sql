ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY profiles_select_own
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (
        auth_user_id = auth.uid()
        AND deleted_at IS NULL
      );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'profiles_select_platform_admin'
  ) THEN
    CREATE POLICY profiles_select_platform_admin
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (
        public.is_platform_admin() = true
        AND deleted_at IS NULL
      );
  END IF;
END
$$;
