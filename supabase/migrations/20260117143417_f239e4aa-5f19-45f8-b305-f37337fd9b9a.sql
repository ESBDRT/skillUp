-- Create memory_reviews table for tracking revision history
CREATE TABLE public.memory_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES memory_concepts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  quality INTEGER NOT NULL CHECK (quality >= 1 AND quality <= 5),
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.memory_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for memory_reviews
CREATE POLICY "Users can view their own reviews"
ON public.memory_reviews FOR SELECT
USING (user_id IS NOT NULL AND user_id <> '');

CREATE POLICY "Users can insert their own reviews"
ON public.memory_reviews FOR INSERT
WITH CHECK (user_id IS NOT NULL AND user_id <> '');

-- Add course_title to memory_concepts for easier display
ALTER TABLE public.memory_concepts
ADD COLUMN IF NOT EXISTS course_title TEXT;

-- Create index for faster lookups
CREATE INDEX idx_memory_reviews_concept_id ON public.memory_reviews(concept_id);
CREATE INDEX idx_memory_reviews_user_id ON public.memory_reviews(user_id);
CREATE INDEX idx_memory_concepts_course_id ON public.memory_concepts(course_id);

-- Clean up duplicate concepts (keep the one with most reviews/oldest)
DELETE FROM public.memory_concepts a
USING public.memory_concepts b
WHERE a.id > b.id
AND a.user_id = b.user_id
AND a.course_id = b.course_id
AND a.concept_title = b.concept_title;

-- Add unique constraint to prevent future duplicates
ALTER TABLE public.memory_concepts
ADD CONSTRAINT unique_concept_per_user_course UNIQUE (user_id, course_id, concept_title);