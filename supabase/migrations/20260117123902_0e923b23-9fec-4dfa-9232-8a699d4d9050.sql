-- Drop existing restrictive policies for POC
DROP POLICY IF EXISTS "Users can create their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can delete their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view their own courses" ON public.courses;

DROP POLICY IF EXISTS "Users can create cards for their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can delete cards of their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can update cards of their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can view cards of their courses" ON public.course_cards;

DROP POLICY IF EXISTS "Users can create their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;

-- Create permissive policies for POC (allow all operations with non-null user_id)
-- COURSES
CREATE POLICY "POC: Allow all operations on courses"
ON public.courses FOR ALL
USING (true)
WITH CHECK (user_id IS NOT NULL);

-- COURSE_CARDS
CREATE POLICY "POC: Allow all operations on course_cards"
ON public.course_cards FOR ALL
USING (true)
WITH CHECK (true);

-- COURSE_PROGRESS
CREATE POLICY "POC: Allow all operations on course_progress"
ON public.course_progress FOR ALL
USING (true)
WITH CHECK (user_id IS NOT NULL);