-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'expert')),
  category TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  total_xp INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_cards table
CREATE TABLE public.course_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('info', 'quiz', 'flashcard', 'slider', 'open-question')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  options JSONB,
  flashcard_back TEXT,
  slider_config JSONB,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_cards ENABLE ROW LEVEL SECURITY;

-- Policies for courses
CREATE POLICY "Users can view their own courses" 
ON public.courses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view published courses" 
ON public.courses 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Users can create their own courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" 
ON public.courses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" 
ON public.courses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for course_cards
CREATE POLICY "Users can view cards of their courses" 
ON public.course_cards 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_cards.course_id 
    AND (courses.user_id = auth.uid() OR courses.is_published = true)
  )
);

CREATE POLICY "Users can create cards for their courses" 
ON public.course_cards 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_cards.course_id 
    AND courses.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update cards of their courses" 
ON public.course_cards 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_cards.course_id 
    AND courses.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete cards of their courses" 
ON public.course_cards 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_cards.course_id 
    AND courses.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();