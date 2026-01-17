import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, BookOpen, Brain, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoursePreviewProps {
  language: 'en' | 'fr';
}

const courseContent = {
  en: {
    title: "Introduction to Machine Learning",
    category: "Technology",
    level: "Beginner",
    cards: [
      {
        type: 'info',
        title: 'What is Machine Learning?',
        content: 'Machine Learning is a subset of AI that enables computers to learn from data without being explicitly programmed.',
        highlight: 'learns from patterns'
      },
      {
        type: 'flashcard',
        front: 'What are the 3 main types of Machine Learning?',
        back: 'Supervised, Unsupervised, and Reinforcement Learning'
      },
      {
        type: 'quiz',
        question: 'Which type of ML uses labeled data?',
        options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'],
        correct: 0
      }
    ]
  },
  fr: {
    title: "Introduction au Machine Learning",
    category: "Technologie",
    level: "Débutant",
    cards: [
      {
        type: 'info',
        title: "Qu'est-ce que le Machine Learning ?",
        content: "Le Machine Learning est une branche de l'IA qui permet aux ordinateurs d'apprendre à partir de données sans être explicitement programmés.",
        highlight: 'apprend des patterns'
      },
      {
        type: 'flashcard',
        front: 'Quels sont les 3 types principaux de Machine Learning ?',
        back: 'Supervisé, Non-supervisé et par Renforcement'
      },
      {
        type: 'quiz',
        question: 'Quel type de ML utilise des données étiquetées ?',
        options: ['Apprentissage supervisé', 'Apprentissage non-supervisé', 'Apprentissage par renforcement'],
        correct: 0
      }
    ]
  }
};

const CoursePreview = ({ language }: CoursePreviewProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  const content = courseContent[language];
  const card = content.cards[currentCard];
  
  const goNext = () => {
    if (currentCard < content.cards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setIsFlipped(false);
      setSelectedAnswer(null);
    }
  };
  
  const goPrev = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setIsFlipped(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="relative">
      {/* Phone mockup frame */}
      <div className="relative mx-auto w-[320px] md:w-[380px]">
        {/* Phone bezel */}
        <div className="relative bg-card rounded-[3rem] p-3 shadow-2xl shadow-primary/10 border border-border">
          {/* Dynamic island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-foreground/90 rounded-full z-20" />
          
          {/* Screen */}
          <div className="relative bg-background rounded-[2.25rem] overflow-hidden aspect-[9/18]">
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />
            
            {/* Progress bar */}
            <div className="absolute top-14 left-4 right-4 flex gap-1 z-10">
              {content.cards.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index < currentCard ? 'bg-primary' : 
                    index === currentCard ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            {/* Course header */}
            <div className="absolute top-20 left-4 right-4 z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {content.category}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{content.level}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground truncate">{content.title}</h4>
            </div>
            
            {/* Card content */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pt-32 pb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {card.type === 'info' && (
                    <div className="h-full flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">
                          {language === 'en' ? 'Lesson' : 'Leçon'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.content}
                      </p>
                      <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-xs text-primary font-medium">
                          💡 {language === 'en' ? 'Key insight' : 'Point clé'}: {card.highlight}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {card.type === 'flashcard' && (
                    <div 
                      className="h-full flex items-center justify-center cursor-pointer"
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <motion.div
                        className="w-full p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium text-primary uppercase tracking-wide">
                            {language === 'en' ? 'Flashcard' : 'Carte mémoire'}
                          </span>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={isFlipped ? 'back' : 'front'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-base font-medium text-foreground text-center"
                          >
                            {isFlipped ? card.back : card.front}
                          </motion.p>
                        </AnimatePresence>
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          {language === 'en' ? 'Tap to flip' : 'Appuyez pour retourner'}
                        </p>
                      </motion.div>
                    </div>
                  )}
                  
                  {card.type === 'quiz' && (
                    <div className="h-full flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">
                          Quiz
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-4">{card.question}</h3>
                      <div className="space-y-2">
                        {card.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                              selectedAnswer === null
                                ? 'bg-muted/50 hover:bg-muted border border-transparent'
                                : selectedAnswer === index
                                  ? index === card.correct
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-foreground'
                                    : 'bg-red-500/20 border border-red-500/50 text-foreground'
                                  : index === card.correct
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-foreground'
                                    : 'bg-muted/30 border border-transparent text-muted-foreground'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {selectedAnswer !== null && index === card.correct && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              )}
                              {option}
                            </span>
                          </button>
                        ))}
                      </div>
                      {selectedAnswer !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-3 rounded-xl ${
                            selectedAnswer === card.correct 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}
                        >
                          <p className="text-xs font-medium">
                            {selectedAnswer === card.correct 
                              ? (language === 'en' ? '✓ Correct! +10 XP' : '✓ Correct ! +10 XP')
                              : (language === 'en' ? '✗ Not quite. Review and try again!' : "✗ Pas tout à fait. Révisez et réessayez !")}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Bottom navigation */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <button
                onClick={goPrev}
                disabled={currentCard === 0}
                className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-all">
                  <Volume2 className="w-4 h-4" />
                </button>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {currentCard + 1}/{content.cards.length}
                </div>
              </div>
              
              <button
                onClick={goNext}
                disabled={currentCard === content.cards.length - 1}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/4 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
        <div className="absolute -z-10 bottom-1/4 -right-12 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default CoursePreview;