-- 1. Drop the overly permissive profiles SELECT policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2. Create a secure policy: users can only view their own full profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 3. Create a policy for public display info only (for leaderboards, etc.)
-- This uses a security definer function to expose only safe fields
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  display_name text,
  avatar text,
  grade text,
  school text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.display_name, p.avatar, p.grade, p.school
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- 4. Allow admins/teachers to view student profiles for educational purposes
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Enable RLS on curriculum tables
ALTER TABLE "curriculumGrade0" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "curriculumGrade1" ENABLE ROW LEVEL SECURITY;

-- 6. Create read-only policies for curriculum (authenticated users can read)
CREATE POLICY "Authenticated users can read curriculum"
ON "curriculumGrade0"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read curriculum"
ON "curriculumGrade1"
FOR SELECT
TO authenticated
USING (true);

-- 7. Admin-only write policies for curriculum
CREATE POLICY "Admins can manage curriculum"
ON "curriculumGrade0"
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage curriculum"
ON "curriculumGrade1"
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. Enable RLS on story tables
ALTER TABLE "storyGrade0" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "storyGrade1" ENABLE ROW LEVEL SECURITY;

-- 9. Create read-only policies for stories
CREATE POLICY "Authenticated users can read stories"
ON "storyGrade0"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read stories"
ON "storyGrade1"
FOR SELECT
TO authenticated
USING (true);

-- 10. Admin-only write policies for stories
CREATE POLICY "Admins can manage stories"
ON "storyGrade0"
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage stories"
ON "storyGrade1"
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 11. Enable RLS on progress tables
ALTER TABLE "progressGrade0" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "progressGrade1" ENABLE ROW LEVEL SECURITY;

-- Note: progressGrade0/1 tables appear to use integer IDs, not user_ids
-- For now, create admin-only access. Consider migrating to game_progress table.
CREATE POLICY "Admins can manage progress data"
ON "progressGrade0"
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage progress data"
ON "progressGrade1"
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));