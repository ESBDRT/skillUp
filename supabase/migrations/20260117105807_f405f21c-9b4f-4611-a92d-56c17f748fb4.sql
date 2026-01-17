-- Table pour sauvegarder la progression des cours
CREATE TABLE public.course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  course_data JSONB NOT NULL,
  current_card_index INTEGER NOT NULL DEFAULT 0,
  completed_cards INTEGER[] DEFAULT '{}',
  earned_xp INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- Policies pour l'accès utilisateur
CREATE POLICY "Users can view their own progress" 
ON public.course_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.course_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.course_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
ON public.course_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_course_progress_updated_at
BEFORE UPDATE ON public.course_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();