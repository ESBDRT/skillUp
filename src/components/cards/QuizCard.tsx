import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '@/data/mockData';

interface QuizCardProps {
  card: Card;
  onComplete: (xp: number) => void;
  onNext?: () => void;
  questionNumber?: number;
  totalQuestions?: number;
}

// Normalize options to the expected format - handles nested objects and various formats
const normalizeOptions = (options: any): Array<{ id: string; text: string; isCorrect: boolean }> => {
  if (!options) return [];
  
  // Handle case where options is an object with nested options array
  if (typeof options === 'object' && !Array.isArray(options) && options.options) {
    return normalizeOptions(options.options);
  }
  
  if (!Array.isArray(options)) return [];
  
  return options.map((option, index) => {
    // If it's null or undefined
    if (option === null || option === undefined) {
      return { id: `opt-${index}`, text: '', isCorrect: false };
    }
    
    // If it's already in the correct format with text property
    if (typeof option === 'object' && option !== null && 'text' in option) {
      return {
        id: option.id || `opt-${index}`,
        text: String(option.text || ''),
        isCorrect: Boolean(option.isCorrect),
      };
    }
    
    // If it's just a string
    if (typeof option === 'string') {
      return {
        id: `opt-${index}`,
        text: option,
        isCorrect: false,
      };
    }
    
    // If it's a number, convert to string
    if (typeof option === 'number') {
      return {
        id: `opt-${index}`,
        text: String(option),
        isCorrect: false,
      };
    }
    
    // Fallback: convert to string representation
    return {
      id: `opt-${index}`,
      text: typeof option === 'object' ? JSON.stringify(option) : String(option),
      isCorrect: false,
    };
  }).filter(opt => opt.text && opt.text !== '[object Object]');
};

const QuizCard = ({ card, onComplete, onNext, questionNumber, totalQuestions }: QuizCardProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Normalize options to ensure correct format
  const normalizedOptions = normalizeOptions(card.options);
  
  // Find the correct answer
  const correctOption = normalizedOptions.find(o => o.isCorrect);
  const selectedOption = normalizedOptions.find(o => o.id === selectedId);
  const isCorrect = selectedOption?.isCorrect;

  const handleSelect = (optionId: string) => {
    if (hasAnswered) return;
    
    setSelectedId(optionId);
    setHasAnswered(true);

    const isAnswerCorrect = normalizedOptions.find(o => o.id === optionId)?.isCorrect;
    
    // Award XP after a short delay
    setTimeout(() => {
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete(isAnswerCorrect ? card.xpReward : 0);
      }
    }, 500);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  // Fallback UI when no options are available
  if (normalizedOptions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          Quiz non disponible
        </p>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Les options de ce quiz n'ont pas pu être chargées.
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(0);
            if (onNext) onNext();
          }}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          Passer ce quiz →
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-xl mx-auto w-full" onClick={(e) => e.stopPropagation()}>
      {/* Question header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 sm:mb-6"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1.5 sm:mb-2 leading-tight">{card.title}</h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{card.content}</p>
      </motion.div>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        {normalizedOptions.map((option, index) => {
          const isSelected = selectedId === option.id;
          const isThisCorrect = option.isCorrect;
          const showAsCorrect = hasAnswered && isThisCorrect;
          const showAsWrong = hasAnswered && isSelected && !isThisCorrect;

          return (
            <motion.button
              key={option.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.08 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option.id);
              }}
              disabled={hasAnswered}
              className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all border-2 ${
                showAsCorrect
                  ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : showAsWrong
                  ? 'bg-red-500/15 border-red-500 shadow-lg shadow-red-500/20'
                  : isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {/* Option letter */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                  showAsCorrect
                    ? 'bg-emerald-500 text-white'
                    : showAsWrong
                    ? 'bg-red-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Option text */}
                <span className={`flex-1 text-sm sm:text-base font-medium ${
                  showAsCorrect
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : showAsWrong
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-foreground'
                }`}>
                  {option.text}
                </span>

                {/* Result icon */}
                {hasAnswered && (showAsCorrect || showAsWrong) && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`p-1 sm:p-1.5 rounded-full ${
                      showAsCorrect ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  >
                    {showAsCorrect ? (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback section */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
          >
            {/* Result message */}
            <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 ${
              isCorrect 
                ? 'bg-emerald-500/15 border border-emerald-500/30' 
                : 'bg-amber-500/15 border border-amber-500/30'
            }`}>
              {isCorrect ? (
                <>
                  <div className="p-1.5 sm:p-2 bg-emerald-500 rounded-full flex-shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                      Excellent ! +{card.xpReward} XP
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Tu maîtrises ce concept !
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-1.5 sm:p-2 bg-amber-500 rounded-full flex-shrink-0">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-amber-600 dark:text-amber-400">
                      Pas tout à fait...
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      La bonne réponse : <span className="font-medium text-foreground">{correctOption?.text}</span>
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleContinue}
              className="w-full py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Continuer →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizCard;
