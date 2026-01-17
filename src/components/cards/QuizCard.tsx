import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Card } from '@/data/mockData';

interface QuizCardProps {
  card: Card;
  onComplete: (xp: number) => void;
}

const QuizCard = ({ card, onComplete }: QuizCardProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (optionId: string) => {
    if (hasAnswered) return;
    
    setSelectedId(optionId);
    setHasAnswered(true);

    const isCorrect = card.options?.find(o => o.id === optionId)?.isCorrect;
    
    setTimeout(() => {
      onComplete(isCorrect ? card.xpReward : 0);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="inline-block px-3 py-1 bg-level-intermediate/10 rounded-full mb-4">
          <span className="text-sm font-medium text-level-intermediate">Quiz</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{card.title}</h2>
        <p className="text-lg text-muted-foreground">{card.content}</p>
      </motion.div>

      <div className="space-y-3">
        {card.options?.map((option, index) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.isCorrect;
          const showResult = hasAnswered && isSelected;

          return (
            <motion.button
              key={option.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option.id);
              }}
              disabled={hasAnswered}
              className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
                showResult
                  ? isCorrect
                    ? 'bg-success/10 border-success'
                    : 'bg-destructive/10 border-destructive'
                  : hasAnswered && isCorrect
                  ? 'bg-success/10 border-success'
                  : isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  showResult
                    ? isCorrect
                      ? 'text-success'
                      : 'text-destructive'
                    : 'text-foreground'
                }`}>
                  {option.text}
                </span>
                {showResult && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`p-1 rounded-full ${
                      isCorrect ? 'bg-success' : 'bg-destructive'
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="w-4 h-4 text-success-foreground" />
                    ) : (
                      <X className="w-4 h-4 text-destructive-foreground" />
                    )}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;
