-- Table user_profiles pour les données utilisateur persistantes (streak, XP)
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak_count integer NOT NULL DEFAULT 0,
  last_activity_date date,
  daily_goal_minutes integer NOT NULL DEFAULT 15,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- POC: Allow all operations
CREATE POLICY "POC: Allow all operations on user_profiles"
ON public.user_profiles
FOR ALL
USING (true)
WITH CHECK (user_id IS NOT NULL);

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Ajouter les colonnes duration_days et daily_cards_count à courses
ALTER TABLE public.courses 
ADD COLUMN duration_days integer NOT NULL DEFAULT 1,
ADD COLUMN daily_cards_count integer NOT NULL DEFAULT 10;

-- Table course_sessions pour le planning des sessions
CREATE TABLE public.course_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  session_number integer NOT NULL,
  cards_start_index integer NOT NULL DEFAULT 0,
  cards_end_index integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  earned_xp integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, session_number)
);

-- Enable RLS
ALTER TABLE public.course_sessions ENABLE ROW LEVEL SECURITY;

-- POC: Allow all operations
CREATE POLICY "POC: Allow all operations on course_sessions"
ON public.course_sessions
FOR ALL
USING (true)
WITH CHECK (user_id IS NOT NULL);

-- Trigger for updated_at
CREATE TRIGGER update_course_sessions_updated_at
BEFORE UPDATE ON public.course_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les requêtes fréquentes
CREATE INDEX idx_course_sessions_user_date ON public.course_sessions(user_id, scheduled_date);
CREATE INDEX idx_course_sessions_course ON public.course_sessions(course_id);