-- Drop the existing check constraint
ALTER TABLE public.course_cards DROP CONSTRAINT IF EXISTS course_cards_type_check;

-- Add the new check constraint with 'lesson' type included
ALTER TABLE public.course_cards 
ADD CONSTRAINT course_cards_type_check 
CHECK (type = ANY (ARRAY['info'::text, 'quiz'::text, 'flashcard'::text, 'slider'::text, 'open-question'::text, 'lesson'::text]));