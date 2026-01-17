import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Sparkles, Loader2, BookOpen, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { POC_USER_ID } from '@/lib/constants';

// Shared types
export interface Course {
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

export interface CourseProgress {
    id: string;
    course_id: string;
    course_data: any;
    current_card_index: number;
    completed_cards: number[];
    earned_xp: number;
    is_completed: boolean;
    updated_at: string;
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

type CourseListMode = 'created' | 'in-progress';

interface CourseListProps {
    mode: CourseListMode;
}

const levelLabels: Record<string, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert',
};

export function CourseList({ mode }: CourseListProps) {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [progressItems, setProgressItems] = useState<CourseProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (mode === 'created') {
            fetchCreatedCourses();
        } else {
            fetchInProgressCourses();
        }
    }, [mode]);

    const fetchCreatedCourses = async () => {
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

    const fetchInProgressCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('course_progress')
                .select('*')
                .eq('user_id', POC_USER_ID)
                .eq('is_completed', false)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setProgressItems(data || []);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const playCourse = async (course: Course) => {
        try {
            const { data: cards, error } = await supabase
                .from('course_cards')
                .select('*')
                .eq('course_id', course.id)
                .order('order_index', { ascending: true });

            if (error) throw error;

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

                let sections = undefined;
                if (card.type === 'lesson' && card.content) {
                    try {
                        sections = JSON.parse(card.content);
                    } catch {
                        // Content is not JSON
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
            toast.error('Erreur lors du chargement du cours');
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

    const deleteCourse = async (id: string) => {
        setDeletingId(id);
        try {
            if (mode === 'created') {
                await supabase.from('course_cards').delete().eq('course_id', id);
                const { error } = await supabase.from('courses').delete().eq('id', id);
                if (error) throw error;
                setCourses(prev => prev.filter(c => c.id !== id));
            } else {
                const { error } = await supabase.from('course_progress').delete().eq('id', id);
                if (error) throw error;
                setProgressItems(prev => prev.filter(p => p.id !== id));
            }
            toast.success('Cours supprimé');
        } catch (error) {
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

    const items = mode === 'created' ? courses : progressItems;
    if (items.length === 0) return null;

    const title = mode === 'created' ? 'Mes cours créés' : 'Cours en cours';
    const TitleIcon = mode === 'created' ? Sparkles : BookOpen;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <TitleIcon className="w-5 h-5 text-primary" />
                {title}
            </h2>

            <div className="space-y-3">
                {mode === 'created' ? (
                    courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="text-3xl">{course.icon || '📚'}</div>
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
                                        <div className="flex flex-col gap-2">
                                            <Button size="sm" onClick={() => playCourse(course)} className="gap-1.5">
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
                    ))
                ) : (
                    progressItems.map((progress, index) => {
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
                                            <div className="text-3xl">{courseData.icon || '📚'}</div>
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
                                                <div className="mt-3 space-y-1">
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>Progression</span>
                                                        <span>{progressPercent}%</span>
                                                    </div>
                                                    <Progress value={progressPercent} className="h-2" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Button size="sm" onClick={() => resumeCourse(progress)} className="gap-1.5">
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
                    })
                )}
            </div>
        </div>
    );
}
