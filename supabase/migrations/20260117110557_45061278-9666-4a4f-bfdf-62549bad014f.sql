-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Users can insert their own concepts" ON public.memory_concepts;
DROP POLICY IF EXISTS "Users can update their own concepts" ON public.memory_concepts;
DROP POLICY IF EXISTS "Users can delete their own concepts" ON public.memory_concepts;
DROP POLICY IF EXISTS "Users can view their own concepts" ON public.memory_concepts;

-- Create proper RLS policies based on user_id column matching localStorage user ID
-- Since we use localStorage user_id (TEXT), we check against that
CREATE POLICY "Users can view their own concepts"
ON public.memory_concepts FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own concepts"
ON public.memory_concepts FOR INSERT
WITH CHECK (user_id IS NOT NULL AND user_id != '');

CREATE POLICY "Users can update their own concepts"
ON public.memory_concepts FOR UPDATE
USING (user_id IS NOT NULL AND user_id != '');

CREATE POLICY "Users can delete their own concepts"
ON public.memory_concepts FOR DELETE
USING (user_id IS NOT NULL AND user_id != '');