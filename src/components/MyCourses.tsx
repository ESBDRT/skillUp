import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Sparkles, Loader2, BookOpen, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { POC_USER_ID } from '@/lib/constants';

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  icon: string | null;
  level: string;
  estimated_minutes: number;
  total_xp: number;
  created_at: string;
}

interface CourseCard {
  id: string;
  course_id: string;
  order_index: number;
  type: string;
  title: string;
  content: string;
  options: any;
  flashcard_back: string | null;
  slider_config: any;
  xp_reward: number;
}

export function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', POC_USER_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playCourse = async (course: Course) => {
    try {
      // Fetch course cards
      const { data: cards, error } = await supabase
        .from('course_cards')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index', { ascending: true });

      if (error) throw error;

      // Format cards for CoursePlayer
      const formattedCards = (cards || []).map((card: CourseCard) => {
        let options = null;
        if (card.options) {
          const opts = card.options as { options?: string[]; correctIndex?: number };
          if (opts.options) {
            options = opts.options.map((text: string, i: number) => ({
              id: `opt-${i}`,
              text,
              isCorrect: i === opts.correctIndex
            }));
          }
        }

        // Parse sections from content if it's a lesson type
        let sections = undefined;
        if (card.type === 'lesson' && card.content) {
          try {
            sections = JSON.parse(card.content);
          } catch {
            // Content is not JSON, use as-is
          }
        }

        return {
          id: card.id,
          type: card.type,
          title: card.title,
          content: sections ? '' : card.content,
          sections,
          options,
          flashcardBack: card.flashcard_back,
          sliderConfig: card.slider_config,
          xpReward: card.xp_reward,
        };
      });

      // Navigate to course player
      navigate(`/course/${course.id}`, {
        state: {
          generatedCourse: {
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category,
            icon: course.icon,
            level: course.level,
            estimatedMinutes: course.estimated_minutes,
            totalXP: course.total_xp,
            cards: formattedCards,
          }
        }
      });
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Erreur lors du chargement du cours');
    }
  };

  const deleteCourse = async (courseId: string) => {
    setDeletingId(courseId);
    try {
      // Delete cards first (due to foreign key)
      await supabase
        .from('course_cards')
        .delete()
        .eq('course_id', courseId);

      // Delete course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success('Cours supprimé');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const levelLabels: Record<string, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert',
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
        <Sparkles className="w-5 h-5 text-primary" />
        Mes cours créés
      </h2>
      
      <div className="space-y-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="text-3xl">{course.icon || '📚'}</div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.estimated_minutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {levelLabels[course.level] || course.level}
                      </span>
                      <span>{course.total_xp} XP</span>
                    </div>

                    {course.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => playCourse(course)}
                      className="gap-1.5"
                    >
                      <Play className="w-4 h-4" />
                      Lancer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteCourse(course.id)}
                      disabled={deletingId === course.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      {deletingId === course.id ? (
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
        ))}
      </div>
    </div>
  );
}
