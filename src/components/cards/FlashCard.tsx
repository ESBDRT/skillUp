import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { Card } from '@/data/mockData';

interface FlashCardProps {
  card: Card;
  onComplete: (xp: number) => void;
  onNext?: () => void;
}

const FlashCard = ({ card, onComplete, onNext }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFlipped) {
      setIsFlipped(true);
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete(card.xpReward);
      }
    }
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 sm:mb-6 text-center"
      >
        <div className="inline-block px-2.5 sm:px-3 py-1 bg-success/10 rounded-full mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-medium text-success">Flashcard</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">{card.title}</h2>
      </motion.div>

      <div className="w-full perspective-1000">
        <motion.div
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="relative w-full aspect-[4/3] cursor-pointer preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-card rounded-2xl sm:rounded-3xl shadow-elevated border border-border flex flex-col items-center justify-center p-4 sm:p-6 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-base sm:text-xl font-medium text-foreground text-center mb-4 sm:mb-6">
              {card.content}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Tapez pour retourner</span>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow rounded-2xl sm:rounded-3xl shadow-elevated flex items-center justify-center p-4 sm:p-6 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <p className="text-base sm:text-xl font-medium text-primary-foreground text-center">
              {card.flashcardBack}
            </p>
          </div>
        </motion.div>
      </div>

      {isFlipped && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleContinue}
          className="mt-4 sm:mt-6 w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-primary text-primary-foreground rounded-xl sm:rounded-full font-medium hover:bg-primary/90 transition-colors touch-target"
        >
          Continuer →
        </motion.button>
      )}
    </div>
  );
};

export default FlashCard;
