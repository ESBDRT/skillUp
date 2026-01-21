import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, BookOpen, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface CourseProgress {
  id: string;
  course_id: string;
  course_data: any;
  current_card_index: number;
  completed_cards: number[];
  earned_xp: number;
  is_completed: boolean;
  updated_at: string;
}

export function SavedCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSavedCourses();
    }
  }, [user]);

  const fetchSavedCourses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching saved courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resumeCourse = (progress: CourseProgress) => {
    navigate(`/course/${progress.course_id}`, {
      state: {
        generatedCourse: progress.course_data,
        resumedProgress: progress
      }
    });
  };

  const deleteCourse = async (progressId: string) => {
    setDeletingId(progressId);
    try {
      const { error } = await supabase
        .from('course_progress')
        .delete()
        .eq('id', progressId);

      if (error) throw error;

      setCourses(prev => prev.filter(c => c.id !== progressId));
      toast.success('Cours supprimé');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Cours en cours
      </h2>
      
      <div className="space-y-3">
        {courses.map((progress, index) => {
          const courseData = progress.course_data;
          const totalCards = courseData.cards?.length || 1;
          const progressPercent = Math.round((progress.current_card_index / totalCards) * 100);

          return (
            <motion.div
              key={progress.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="text-3xl">{courseData.icon || '📚'}</div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {courseData.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {courseData.estimatedMinutes || courseData.estimated_minutes} min
                        </span>
                        <span>{progress.earned_xp} XP gagnés</span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progression</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => resumeCourse(progress)}
                        className="gap-1.5"
                      >
                        <Play className="w-4 h-4" />
                        Reprendre
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteCourse(progress.id)}
                        disabled={deletingId === progress.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {deletingId === progress.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
