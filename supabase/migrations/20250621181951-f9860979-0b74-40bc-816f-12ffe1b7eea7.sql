
-- First, completely drop the table's RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop specific policies that might exist
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON public.profiles;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create brand new, simple policies
CREATE POLICY "users_can_view_own_profile" ON public.profiles
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON public.profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
