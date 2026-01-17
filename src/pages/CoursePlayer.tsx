import { useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { mockLessons, Lesson } from '@/data/mockData';
import { useUser } from '@/context/UserContext';
import StoryProgress from '@/components/StoryProgress';
import InfoCard from '@/components/cards/InfoCard';
import QuizCard from '@/components/cards/QuizCard';
import FlashCard from '@/components/cards/FlashCard';
import SliderCard from '@/components/cards/SliderCard';
import OpenQuestionCard from '@/components/cards/OpenQuestionCard';
import VictoryScreen from '@/components/VictoryScreen';
import XPPopup from '@/components/XPPopup';
import { X, Volume2, MessageCircle } from 'lucide-react';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addXP, completeLesson, addMinutes } = useUser();
  
  // Check if we have a generated course from state
  const generatedCourse = location.state?.generatedCourse;
  
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
    
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const isPreview = !!generatedCourse;

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cours non trouvé</p>
      </div>
    );
  }

  const currentCard = lesson.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / lesson.cards.length) * 100;

  const handleXPGain = useCallback((amount: number) => {
    setXpAmount(amount);
    setShowXPPopup(true);
    setEarnedXP(prev => prev + amount);
    addXP(amount);
    setTimeout(() => setShowXPPopup(false), 1500);
  }, [addXP]);

  const handleNext = useCallback(() => {
    if (currentCardIndex < lesson.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Course complete!
      setIsComplete(true);
      completeLesson(lesson.id);
      addMinutes(lesson.estimatedMinutes);
      
      // Fire confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B'],
      });
    }
  }, [currentCardIndex, lesson, completeLesson, addMinutes]);

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
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          
          <StoryProgress 
            current={currentCardIndex} 
            total={lesson.cards.length} 
          />
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

      {/* Bottom Actions */}
      <footer className="px-4 py-4 border-t border-border bg-card safe-bottom">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
            <Volume2 className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Écouter</span>
          </button>

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
