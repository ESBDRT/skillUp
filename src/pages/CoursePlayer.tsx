import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { mockLessons, Lesson } from '@/data/mockData';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { POC_USER_ID } from '@/lib/constants';
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
  
  // Check if we have a generated course from state or resuming
  const generatedCourse = location.state?.generatedCourse;
  const resumedProgress = location.state?.resumedProgress;
  
  // Use generated course if available, otherwise find from mock data
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
    : mockLessons.find(l => l.id === courseId);
    
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

    // Use the POC user ID for all tests
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
        // Update existing progress
        const { error } = await supabase
          .from('course_progress')
          .update(progressData)
          .eq('id', progressId);

        if (error) throw error;
      } else {
        // Create new progress
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

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cours non trouvé</p>
      </div>
    );
  }

  const currentCard = lesson.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / lesson.cards.length) * 100;

  // Get text content for audio
  const getCardTextContent = () => {
    let text = currentCard.title || '';
    if (currentCard.content) {
      text += '. ' + currentCard.content;
    }
    if (currentCard.type === 'flashcard' && currentCard.flashcardBack) {
      text += '. ' + currentCard.flashcardBack;
    }
    return text;
  };

  const handleXPGain = useCallback((amount: number) => {
    setXpAmount(amount);
    setShowXPPopup(true);
    setEarnedXP(prev => prev + amount);
    setCompletedCards(prev => new Set([...prev, currentCardIndex]));
    addXP(amount);
    setTimeout(() => setShowXPPopup(false), 1500);
  }, [addXP, currentCardIndex]);

  const handleNext = useCallback(() => {
    if (currentCardIndex < lesson.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Course complete!
      setIsComplete(true);
      completeLesson(lesson.id);
      addMinutes(lesson.estimatedMinutes);
      
      // Mark as complete in database
      if (progressId) {
        supabase
          .from('course_progress')
          .update({ is_completed: true })
          .eq('id', progressId)
          .then(() => {});
      }
      
      // Fire confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B'],
      });
    }
  }, [currentCardIndex, lesson, completeLesson, addMinutes, progressId]);

  const handlePrev = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  }, [currentCardIndex]);

  const handleTap = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightSide = x > rect.width / 2;

    if (isRightSide) {
      // Only auto-advance for info cards
      if (currentCard.type === 'info') {
        handleXPGain(currentCard.xpReward);
        handleNext();
      }
    } else {
      handlePrev();
    }
  }, [currentCard, handleNext, handlePrev, handleXPGain]);

  const handleCardComplete = useCallback((xp: number) => {
    handleXPGain(xp);
    setTimeout(handleNext, 500);
  }, [handleXPGain, handleNext]);

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
    switch (currentCard.type) {
      case 'info':
        return <InfoCard card={currentCard} />;
      case 'quiz':
        return <QuizCard card={currentCard} onComplete={handleCardComplete} />;
      case 'flashcard':
        return <FlashCard card={currentCard} onComplete={handleCardComplete} />;
      case 'slider':
        return <SliderCard card={currentCard} onComplete={handleCardComplete} />;
      case 'open-question':
        return <OpenQuestionCard card={currentCard} onComplete={handleCardComplete} />;
      case 'lesson':
        return <LessonCard card={currentCard} onComplete={handleCardComplete} />;
      default:
        return <InfoCard card={currentCard} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur safe-top">
        <div className="px-4 py-3 flex items-center gap-4">
          <button 
            onClick={handleExit}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          
          <StoryProgress 
            current={currentCardIndex} 
            total={lesson.cards.length} 
          />

          {/* Save button for generated courses */}
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
      </header>

      {/* Card Area */}
      <main 
        className="flex-1 flex flex-col px-4 py-6 relative no-tap-highlight"
        onClick={handleTap}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            {renderCard()}
          </motion.div>
        </AnimatePresence>

        {/* XP Popup */}
        <AnimatePresence>
          {showXPPopup && <XPPopup amount={xpAmount} />}
        </AnimatePresence>

        {/* Tap hints */}
        <div className="absolute inset-0 pointer-events-none flex">
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

      {/* Audio Player */}
      <AudioPlayer text={getCardTextContent()} />

      {/* Bottom Actions */}
      <footer className="px-4 py-4 border-t border-border bg-card safe-bottom">
        <div className="flex items-center justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Aide IA</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CoursePlayer;
