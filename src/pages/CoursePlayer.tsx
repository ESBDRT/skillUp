import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { mockLessons, Lesson, Card } from '@/data/mockData';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { POC_USER_ID } from '@/lib/constants';
import { useCourseSessions } from '@/hooks/useCourseSessions';
import { useMemoryConcepts } from '@/hooks/useMemoryConcepts';
import StoryProgress from '@/components/StoryProgress';
import InfoCard from '@/components/cards/InfoCard';
import QuizCard from '@/components/cards/QuizCard';
import FlashCard from '@/components/cards/FlashCard';
import SliderCard from '@/components/cards/SliderCard';
import OpenQuestionCard from '@/components/cards/OpenQuestionCard';
import LessonCard from '@/components/cards/LessonCard';
import VictoryScreen from '@/components/VictoryScreen';
import XPPopup from '@/components/XPPopup';
import AudioPlayer from '@/components/AudioPlayer';
import { X, MessageCircle, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addXP, completeLesson, addMinutes, user } = useUser();
  const { completeSession } = useCourseSessions();
  const { addConcept } = useMemoryConcepts();

  // Check if we have a generated course from state or resuming
  const generatedCourse = location.state?.generatedCourse;
  const resumedProgress = location.state?.resumedProgress;

  // Session-specific state from navigation
  const sessionId = location.state?.sessionId;
  const cardsStartIndex = location.state?.cardsStartIndex ?? 0;
  const cardsEndIndex = location.state?.cardsEndIndex;

  // State for loading course from DB
  const [dbCourse, setDbCourse] = useState<Lesson | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  // Determine the lesson source
  const mockLesson = mockLessons.find(l => l.id === courseId);

  // Use generated course if available, otherwise find from mock data or DB
  const lesson: Lesson | undefined = generatedCourse
    ? {
      id: generatedCourse.id,
      title: generatedCourse.title,
      description: generatedCourse.description || '',
      category: generatedCourse.category,
      icon: generatedCourse.icon,
      level: generatedCourse.level,
      totalXP: generatedCourse.totalXP,
      estimatedMinutes: generatedCourse.estimatedMinutes,
      cards: generatedCourse.cards,
      isCompleted: false,
      isLocked: false,
    }
    : mockLesson || dbCourse || undefined;

  // Load course from database if not found in mock data
  useEffect(() => {
    const loadCourseFromDB = async () => {
      if (!courseId || generatedCourse || mockLesson) return;

      setIsLoadingCourse(true);
      try {
        // Fetch course details
        const { data: course, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseError) {
          console.error('Error fetching course:', courseError);
          return;
        }

        // Fetch course cards
        const { data: cards, error: cardsError } = await supabase
          .from('course_cards')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index');

        if (cardsError) {
          console.error('Error fetching cards:', cardsError);
          return;
        }


        // Transform cards to the expected format
        const transformedCards: Card[] = (cards || []).map(card => {
          const baseCard = {
            id: card.id,
            type: card.type as Card['type'],
            title: card.title,
            content: card.content,
            xpReward: card.xp_reward,
            image: card.image_url || undefined,
          };

          // Handle different card types
          if (card.type === 'quiz' && card.options) {
            const optionsData = typeof card.options === 'string'
              ? JSON.parse(card.options)
              : card.options;

            // Extract options array - handle nested structure
            let rawOptions = optionsData;
            if (optionsData && typeof optionsData === 'object' && !Array.isArray(optionsData)) {
              rawOptions = optionsData.options || [];
            }
            
            const correctIdx = optionsData?.correctIndex ?? 0;
            
            let parsedOptions: Array<{ id: string; text: string; isCorrect: boolean }> = [];
            
            if (Array.isArray(rawOptions)) {
              parsedOptions = rawOptions.map((opt: any, i: number) => {
                // Handle string options
                if (typeof opt === 'string') {
                  return {
                    id: `opt-${i}`,
                    text: opt,
                    isCorrect: i === correctIdx,
                  };
                }
                // Handle object options
                if (typeof opt === 'object' && opt !== null) {
                  const hasExplicitIsCorrect = 'isCorrect' in opt;
                  return {
                    id: opt.id || `opt-${i}`,
                    text: String(opt.text || opt.label || ''),
                    isCorrect: hasExplicitIsCorrect 
                      ? (opt.isCorrect === true || opt.isCorrect === 'true')
                      : i === correctIdx,
                  };
                }
                return { id: `opt-${i}`, text: String(opt), isCorrect: i === correctIdx };
              }).filter((opt: any) => opt.text && opt.text.trim() !== '');
            }

            // Ensure at least one correct answer exists
            const hasCorrect = parsedOptions.some(o => o.isCorrect);
            if (!hasCorrect && parsedOptions.length > 0) {
              parsedOptions[0].isCorrect = true;
            }

            console.log('Quiz transformed:', { cardId: card.id, optionsCount: parsedOptions.length, hasCorrect: parsedOptions.some(o => o.isCorrect) });

            return {
              ...baseCard,
              options: parsedOptions,
            };
          }

          if (card.type === 'flashcard') {
            return {
              ...baseCard,
              flashcardBack: card.flashcard_back || '',
            };
          }

          if (card.type === 'slider' && card.slider_config) {
            const sliderConfig = typeof card.slider_config === 'string'
              ? JSON.parse(card.slider_config)
              : card.slider_config;
            return {
              ...baseCard,
              sliderConfig: sliderConfig,
            };
          }

          if (card.type === 'open-question') {
            return {
              ...baseCard,
              expectedAnswer: card.flashcard_back || '',
            };
          }

          return baseCard;
        });

        // Build the lesson object
        const loadedLesson: Lesson = {
          id: course.id,
          title: course.title,
          description: course.description || '',
          category: course.category,
          icon: course.icon || '📚',
          level: course.level as 'beginner' | 'intermediate' | 'expert',
          totalXP: course.total_xp,
          estimatedMinutes: course.estimated_minutes,
          cards: transformedCards,
          isCompleted: false,
          isLocked: false,
        };

        setDbCourse(loadedLesson);
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setIsLoadingCourse(false);
      }
    };

    loadCourseFromDB();
  }, [courseId, generatedCourse, mockLesson]);

  // Filter cards for session if session indices are provided
  const sessionCards = lesson?.cards
    ? (cardsEndIndex !== undefined
      ? lesson.cards.slice(cardsStartIndex, cardsEndIndex + 1)
      : lesson.cards)
    : [];

  const [currentCardIndex, setCurrentCardIndex] = useState(resumedProgress?.current_card_index || 0);
  const [earnedXP, setEarnedXP] = useState(resumedProgress?.earned_xp || 0);
  const [completedCards, setCompletedCards] = useState<Set<number>>(
    new Set(resumedProgress?.completed_cards || [])
  );
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progressId, setProgressId] = useState<string | null>(resumedProgress?.id || null);

  const isPreview = !!generatedCourse;
  const isSessionMode = !!sessionId;

  // Auto-save progress periodically
  useEffect(() => {
    if (!generatedCourse || isComplete) return;

    const saveInterval = setInterval(() => {
      saveProgress(false);
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [currentCardIndex, earnedXP, completedCards, isComplete]);

  const saveProgress = async (showToast = true) => {
    if (!generatedCourse) return;

    const userId = POC_USER_ID;

    setIsSaving(true);
    try {
      const progressData = {
        user_id: userId,
        course_id: generatedCourse.id,
        course_data: generatedCourse,
        current_card_index: currentCardIndex,
        completed_cards: Array.from(completedCards),
        earned_xp: earnedXP,
        is_completed: isComplete,
      };

      if (progressId) {
        const { error } = await supabase
          .from('course_progress')
          .update(progressData)
          .eq('id', progressId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('course_progress')
          .upsert(progressData, { onConflict: 'user_id,course_id' })
          .select()
          .single();

        if (error) throw error;
        if (data) setProgressId(data.id);
      }

      if (showToast) {
        toast.success('Progression sauvegardée !');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      if (showToast) {
        toast.error('Erreur lors de la sauvegarde');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleExit = async () => {
    if (generatedCourse && !isComplete) {
      await saveProgress(true);
    }
    navigate('/dashboard');
  };

  // Show loading state while fetching from DB
  if (isLoadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cours non trouvé</p>
      </div>
    );
  }

  // Use session cards if in session mode, otherwise use all cards
  const cardsToPlay = isSessionMode ? sessionCards : lesson.cards;
  const currentCard = cardsToPlay[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cardsToPlay.length) * 100;

  // Get text content for audio
  const getCardTextContent = () => {
    let text = currentCard?.title || '';
    if (currentCard?.content) {
      text += '. ' + currentCard.content;
    }
    if (currentCard?.type === 'flashcard' && currentCard.flashcardBack) {
      text += '. ' + currentCard.flashcardBack;
    }
    return text;
  };

  // Add concept to memory after completing a card
  const saveConceptToMemory = async (card: typeof currentCard) => {
    if (!card || !courseId) return;

    if (['info', 'lesson', 'flashcard'].includes(card.type)) {
      try {
        await addConcept(courseId, card.title, card.content);
      } catch (error) {
        console.error('Error saving concept:', error);
      }
    }
  };

  const handleXPGain = (amount: number) => {
    // No popup, just track XP silently
    setEarnedXP(prev => prev + amount);
    setCompletedCards(prev => new Set([...prev, currentCardIndex]));
    addXP(amount);

    saveConceptToMemory(currentCard);
  };

  const handleNext = async () => {
    if (currentCardIndex < cardsToPlay.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      completeLesson(lesson.id);
      addMinutes(lesson.estimatedMinutes);

      if (isSessionMode && sessionId) {
        try {
          await completeSession(sessionId, earnedXP);
        } catch (error) {
          console.error('Error completing session:', error);
        }
      }

      if (progressId) {
        supabase
          .from('course_progress')
          .update({ is_completed: true })
          .eq('id', progressId)
          .then(() => { });
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B'],
      });
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  // Only allow tap navigation for non-interactive cards
  const isInteractiveCard = currentCard && ['quiz', 'flashcard', 'open-question', 'slider'].includes(currentCard.type);

  const handleTap = (e: React.MouseEvent) => {
    // Disable tap navigation for interactive cards
    if (isInteractiveCard) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightSide = x > rect.width / 2;

    if (isRightSide) {
      if (currentCard.type === 'info') {
        handleXPGain(currentCard.xpReward);
        handleNext();
      }
    } else {
      handlePrev();
    }
  };

  const handleCardComplete = (xp: number) => {
    handleXPGain(xp);
    // No auto-scroll - let user read feedback and tap to continue
  };

  if (isComplete) {
    return (
      <VictoryScreen
        lesson={lesson}
        earnedXP={earnedXP}
        onClose={() => navigate('/dashboard')}
        isPreview={isPreview}
        generatedCourse={generatedCourse}
      />
    );
  }

  const renderCard = () => {
    if (!currentCard) return null;

    // Calculate slide number for info cards
    const infoCardsUpToNow = cardsToPlay.slice(0, currentCardIndex + 1).filter(c => c.type === 'info').length;
    const totalInfoCards = cardsToPlay.filter(c => c.type === 'info').length;

    switch (currentCard.type) {
      case 'info':
        return <InfoCard card={currentCard} slideNumber={infoCardsUpToNow} totalSlides={totalInfoCards} />;
      case 'quiz':
        return <QuizCard card={currentCard} onComplete={handleCardComplete} onNext={handleNext} />;
      case 'flashcard':
        return <FlashCard card={currentCard} onComplete={handleCardComplete} onNext={handleNext} />;
      case 'slider':
        return <SliderCard card={currentCard} onComplete={handleCardComplete} />;
      case 'open-question':
        return <OpenQuestionCard card={currentCard} onComplete={handleCardComplete} onNext={handleNext} />;
      case 'lesson':
        return <LessonCard card={currentCard} onComplete={handleCardComplete} />;
      default:
        return <InfoCard card={currentCard} />;
    }
  };

  // Card type badges and labels
  const getCardTypeBadge = () => {
    if (!currentCard) return null;
    const badges: Record<string, { icon: string; label: string; color: string }> = {
      info: { icon: '📖', label: 'Cours', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      quiz: { icon: '❓', label: 'Quiz', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
      flashcard: { icon: '🔄', label: 'Flashcard', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
      'open-question': { icon: '📝', label: 'Question', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
      slider: { icon: '🎚️', label: 'Estimation', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
      lesson: { icon: '📚', label: 'Leçon', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    };
    return badges[currentCard.type] || badges.info;
  };

  const cardTypeBadge = getCardTypeBadge();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50 safe-top">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          {/* Top row: Exit, XP, Save */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleExit}
              className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Session XP */}
            <div className="flex items-center gap-2">
              <motion.div 
                key={earnedXP}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full"
              >
                <span className="text-sm">⚡</span>
                <span className="text-sm font-bold text-primary">{earnedXP} XP</span>
              </motion.div>

              {isPreview && (
                <button
                  onClick={() => saveProgress(true)}
                  disabled={isSaving}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                  title="Sauvegarder la progression"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 text-primary" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Progress bar row */}
          <div className="flex items-center gap-3">
            <StoryProgress
              current={currentCardIndex}
              total={cardsToPlay.length}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentCardIndex + 1}/{cardsToPlay.length}
            </span>
          </div>

          {/* Card type indicator */}
          {cardTypeBadge && (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cardTypeBadge.color}`}>
                <span>{cardTypeBadge.icon}</span>
                {cardTypeBadge.label}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Card Area */}
      <main
        className="flex-1 flex flex-col px-4 sm:px-6 py-4 sm:py-6 relative no-tap-highlight overflow-hidden"
        onClick={handleTap}
      >
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 flex flex-col min-h-0"
            >
              {renderCard()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation hints - hidden on larger screens */}
        <div className="absolute inset-0 pointer-events-none flex sm:hidden">
          <div className="w-1/2 flex items-center justify-start pl-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="text-xs text-muted-foreground"
            >
              ← Retour
            </motion.div>
          </div>
          <div className="w-1/2 flex items-center justify-end pr-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="text-xs text-muted-foreground"
            >
              Suivant →
            </motion.div>
          </div>
        </div>
      </main>

      <AudioPlayer text={getCardTextContent()} />

      {/* Enhanced Footer with Navigation */}
      <footer className="px-4 sm:px-6 py-4 border-t border-border bg-card safe-bottom">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            disabled={currentCardIndex === 0}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium transition-colors text-sm sm:text-base ${
              currentCardIndex === 0
                ? 'opacity-30 cursor-not-allowed bg-muted text-muted-foreground'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            ← <span className="hidden sm:inline">Précédent</span>
          </button>

          {/* AI Help */}
          <button className="p-2.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
            <MessageCircle className="w-4 h-4 text-primary" />
          </button>

          {/* Next button - only for info cards */}
          {!isInteractiveCard && (
            <button
              onClick={() => {
                handleXPGain(currentCard.xpReward);
                handleNext();
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Suivant</span> →
            </button>
          )}

          {/* Placeholder for layout balance */}
          {isInteractiveCard && <div className="w-16 sm:w-24" />}
        </div>
      </footer>
    </div>
  );
};

export default CoursePlayer;
