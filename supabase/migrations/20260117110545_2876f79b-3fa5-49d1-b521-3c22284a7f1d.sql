-- Create memory_concepts table for SRS (Spaced Repetition System)
CREATE TABLE public.memory_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  concept_title TEXT NOT NULL,
  concept_content TEXT,
  ease_factor DECIMAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  memory_strength DECIMAL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_concepts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own concepts"
ON public.memory_concepts FOR SELECT
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);

CREATE POLICY "Users can insert their own concepts"
ON public.memory_concepts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own concepts"
ON public.memory_concepts FOR UPDATE
USING (true);

CREATE POLICY "Users can delete their own concepts"
ON public.memory_concepts FOR DELETE
USING (true);

-- Create index for faster queries
CREATE INDEX idx_memory_concepts_user_id ON public.memory_concepts(user_id);
CREATE INDEX idx_memory_concepts_next_review ON public.memory_concepts(next_review_at);