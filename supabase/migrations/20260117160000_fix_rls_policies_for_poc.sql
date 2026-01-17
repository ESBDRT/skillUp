-- Migration to fix RLS policies for POC environment
-- This allows the hardcoded POC_USER_ID to access data without proper authentication

-- 1. COURSES
DROP POLICY IF EXISTS "Users can view their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Users can create their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can delete their own courses" ON public.courses;

CREATE POLICY "POC: Full access to courses"
ON public.courses
FOR ALL
USING (true)
WITH CHECK (true);

-- 2. COURSE_CARDS
DROP POLICY IF EXISTS "Users can view cards of their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can create cards for their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can update cards of their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can delete cards of their courses" ON public.course_cards;

CREATE POLICY "POC: Full access to cards"
ON public.course_cards
FOR ALL
USING (true)
WITH CHECK (true);

-- 3. COURSE_PROGRESS
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can create their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.course_progress;

CREATE POLICY "POC: Full access to progress"
ON public.course_progress
FOR ALL
USING (true)
WITH CHECK (true);
