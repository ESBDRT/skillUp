import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, BookOpen, Brain, CheckCircle2, Zap, MessageSquare, Image } from 'lucide-react';
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
        type: 'lesson',
        title: 'What is Machine Learning?',
        content: 'Machine Learning is a revolutionary subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. Unlike traditional programming where developers write specific rules, ML algorithms analyze vast amounts of data to identify patterns and make intelligent decisions. This paradigm shift has transformed industries from healthcare diagnostics to autonomous vehicles, enabling systems that continuously evolve and adapt to new information.',
        imageAlt: 'Neural network visualization',
        keyInsight: 'ML learns from patterns in data, not explicit rules'
      },
      {
        type: 'quiz',
        question: 'Which type of ML uses labeled data?',
        options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'],
        correct: 0,
        explanation: 'Supervised learning uses labeled data to train models that can predict outcomes.'
      },
      {
        type: 'open',
        question: 'In your own words, explain why feature selection is important in ML.',
        placeholder: 'Write your answer here...',
        hint: 'Think about noise, computational cost, and model performance.'
      },
      {
        type: 'flashcard',
        front: 'What are the 3 main types of Machine Learning?',
        back: 'Supervised, Unsupervised, and Reinforcement Learning'
      },
      {
        type: 'slider',
        question: 'How confident are you with ML concepts now?',
        min: 0,
        max: 100,
        labels: ['Beginner', 'Comfortable', 'Expert']
      }
    ]
  },
  fr: {
    title: "Introduction au Machine Learning",
    category: "Technologie",
    level: "Débutant",
    cards: [
      {
        type: 'lesson',
        title: "Qu'est-ce que le Machine Learning ?",
        content: "Le Machine Learning représente une révolution dans l'intelligence artificielle, permettant aux ordinateurs d'apprendre et de s'améliorer à partir de l'expérience sans programmation explicite. Contrairement à la programmation traditionnelle où les développeurs écrivent des règles spécifiques, les algorithmes ML analysent d'immenses quantités de données pour identifier des patterns et prendre des décisions intelligentes. Ce changement de paradigme a transformé des industries entières, du diagnostic médical aux véhicules autonomes.",
        imageAlt: 'Visualisation réseau neuronal',
        keyInsight: 'Le ML apprend des patterns, pas de règles explicites'
      },
      {
        type: 'quiz',
        question: 'Quel type de ML utilise des données étiquetées ?',
        options: ['Apprentissage supervisé', 'Apprentissage non-supervisé', 'Apprentissage par renforcement'],
        correct: 0,
        explanation: "L'apprentissage supervisé utilise des données étiquetées pour entraîner des modèles."
      },
      {
        type: 'open',
        question: 'Expliquez avec vos mots pourquoi la sélection des features est importante.',
        placeholder: 'Écrivez votre réponse ici...',
        hint: 'Pensez au bruit, coût computationnel, et performance du modèle.'
      },
      {
        type: 'flashcard',
        front: 'Quels sont les 3 types principaux de Machine Learning ?',
        back: 'Supervisé, Non-supervisé et par Renforcement'
      },
      {
        type: 'slider',
        question: 'Quel est votre niveau de confiance sur les concepts ML ?',
        min: 0,
        max: 100,
        labels: ['Débutant', 'Confortable', 'Expert']
      }
    ]
  }
};

const CoursePreview = ({ language }: CoursePreviewProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [autoPlay, setAutoPlay] = useState(true);
  
  const content = courseContent[language];
  const card = content.cards[currentCard];
  
  // Auto-advance cards
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentCard((prev) => {
        const next = (prev + 1) % content.cards.length;
        setIsFlipped(false);
        setSelectedAnswer(null);
        setOpenAnswer('');
        setSliderValue(50);
        return next;
      });
    }, 4000);
    
    return () => clearInterval(timer);
  }, [autoPlay, content.cards.length]);
  
  const goNext = () => {
    setAutoPlay(false);
    if (currentCard < content.cards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setIsFlipped(false);
      setSelectedAnswer(null);
      setOpenAnswer('');
    }
  };
  
  const goPrev = () => {
    setAutoPlay(false);
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setIsFlipped(false);
      setSelectedAnswer(null);
      setOpenAnswer('');
    }
  };

  const renderCard = () => {
    switch (card.type) {
      case 'lesson':
        return (
          <div className="h-full flex flex-col justify-start pt-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {language === 'en' ? 'Lesson' : 'Leçon'}
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">{card.title}</h3>
            
            {/* Simulated image placeholder */}
            <div className="w-full h-24 rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-primary/5 mb-3 flex items-center justify-center border border-primary/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary)/0.3)_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(270_75%_60%/0.2)_0%,transparent_50%)]" />
              <div className="relative flex flex-col items-center gap-1">
                <Image className="w-6 h-6 text-primary/60" />
                <span className="text-[10px] text-muted-foreground">{card.imageAlt}</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {card.content}
            </p>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-[10px] text-primary font-medium">
                💡 {card.keyInsight}
              </p>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="h-full flex flex-col justify-start pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">Quiz</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-3">{card.question}</h3>
            <div className="space-y-2">
              {card.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAnswer(index);
                    setAutoPlay(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left text-xs transition-all ${
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
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
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
                className={`mt-3 p-2 rounded-lg ${
                  selectedAnswer === card.correct 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                <p className="text-[10px] font-medium">
                  {selectedAnswer === card.correct 
                    ? (language === 'en' ? '✓ Correct! +10 XP' : '✓ Correct ! +10 XP')
                    : (language === 'en' ? '✗ Not quite right' : "✗ Pas tout à fait")}
                </p>
              </motion.div>
            )}
          </div>
        );

      case 'open':
        return (
          <div className="h-full flex flex-col justify-start pt-2">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {language === 'en' ? 'Open Question' : 'Question ouverte'}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-3">{card.question}</h3>
            <textarea
              value={openAnswer}
              onChange={(e) => {
                setOpenAnswer(e.target.value);
                setAutoPlay(false);
              }}
              placeholder={card.placeholder}
              className="w-full h-20 p-2 rounded-lg bg-muted/50 border border-border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="mt-2 p-2 rounded-lg bg-muted/30 border border-border">
              <p className="text-[10px] text-muted-foreground">
                💡 {language === 'en' ? 'Hint' : 'Indice'}: {card.hint}
              </p>
            </div>
            {openAnswer.length > 20 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2"
              >
                <Button size="sm" className="w-full text-xs h-7">
                  {language === 'en' ? 'Submit Answer' : 'Soumettre'}
                </Button>
              </motion.div>
            )}
          </div>
        );

      case 'flashcard':
        return (
          <div 
            className="h-full flex items-center justify-center cursor-pointer"
            onClick={() => {
              setIsFlipped(!isFlipped);
              setAutoPlay(false);
            }}
          >
            <motion.div
              className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-2 mb-3">
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
                  className="text-sm font-medium text-foreground text-center"
                >
                  {isFlipped ? card.back : card.front}
                </motion.p>
              </AnimatePresence>
              <p className="text-[10px] text-muted-foreground text-center mt-3">
                {language === 'en' ? 'Tap to flip' : 'Appuyez pour retourner'}
              </p>
            </motion.div>
          </div>
        );

      case 'slider':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {language === 'en' ? 'Self-Assessment' : 'Auto-évaluation'}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-6">{card.question}</h3>
            
            <div className="relative mb-4">
              <input
                type="range"
                min={card.min}
                max={card.max}
                value={sliderValue}
                onChange={(e) => {
                  setSliderValue(Number(e.target.value));
                  setAutoPlay(false);
                }}
                className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-primary/50 pointer-events-none"
                style={{ width: `${sliderValue}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {card.labels.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <span className="text-2xl font-bold text-primary">{sliderValue}%</span>
            </div>
          </div>
        );

      default:
        return null;
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
            <div className="absolute inset-0 flex items-center justify-center p-4 pt-36 pb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full overflow-hidden"
                >
                  {renderCard()}
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
