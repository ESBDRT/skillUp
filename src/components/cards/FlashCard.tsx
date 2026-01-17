import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { Card } from '@/data/mockData';

interface FlashCardProps {
  card: Card;
  onComplete: (xp: number) => void;
}

const FlashCard = ({ card, onComplete }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFlipped) {
      setIsFlipped(true);
      if (!hasCompleted) {
        setHasCompleted(true);
        setTimeout(() => {
          onComplete(card.xpReward);
        }, 500);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 text-center"
      >
        <div className="inline-block px-3 py-1 bg-success/10 rounded-full mb-4">
          <span className="text-sm font-medium text-success">Flashcard</span>
        </div>
        <h2 className="text-xl font-bold text-foreground">{card.title}</h2>
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
            className="absolute inset-0 bg-card rounded-3xl shadow-elevated border border-border flex flex-col items-center justify-center p-6 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xl font-medium text-foreground text-center mb-6">
              {card.content}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <RotateCw className="w-4 h-4" />
              <span className="text-sm">Tapez pour retourner</span>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow rounded-3xl shadow-elevated flex items-center justify-center p-6 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <p className="text-xl font-medium text-primary-foreground text-center">
              {card.flashcardBack}
            </p>
          </div>
        </motion.div>
      </div>

      {isFlipped && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm text-muted-foreground text-center"
        >
          Tapez à droite pour continuer →
        </motion.p>
      )}
    </div>
  );
};

export default FlashCard;
