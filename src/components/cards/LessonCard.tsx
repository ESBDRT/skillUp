import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Loader2 } from 'lucide-react';
import { Card, LessonSection } from '@/data/mockData';
import { Button } from '@/components/ui/button';

interface LessonCardProps {
  card: Card;
  onComplete: (xp: number) => void;
}

const LessonCard = ({ card, onComplete }: LessonCardProps) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionsRead, setSectionsRead] = useState<Set<number>>(new Set([0]));
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const sections = card.sections || [];
  const currentSection = sections[currentSectionIndex];
  const allSectionsRead = sectionsRead.size === sections.length;
  const isLastSection = currentSectionIndex === sections.length - 1;

  useEffect(() => {
    if (allSectionsRead && !hasCompleted) {
      setHasCompleted(true);
      onComplete(card.xpReward);
    }
  }, [allSectionsRead, hasCompleted, onComplete, card.xpReward]);

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      setSectionsRead(prev => new Set([...prev, nextIndex]));
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    setCurrentSectionIndex(index);
    setSectionsRead(prev => new Set([...prev, index]));
  };

  if (!currentSection) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Aucun contenu disponible</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-h-full overflow-hidden">
      {/* Course Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Section {currentSectionIndex + 1} / {sections.length}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{card.title}</h1>
      </motion.div>

      {/* Section Navigation Pills */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(index)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${index === currentSectionIndex 
                ? 'bg-primary text-primary-foreground' 
                : sectionsRead.has(index)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {index + 1}. {section.title.substring(0, 15)}{section.title.length > 15 ? '...' : ''}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Section Title */}
            <h2 className="text-xl font-semibold text-foreground border-l-4 border-primary pl-4">
              {currentSection.title}
            </h2>

            {/* Section Image */}
            {currentSection.imageUrl && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative rounded-2xl overflow-hidden shadow-elevated"
              >
                <img
                  src={currentSection.imageUrl}
                  alt={currentSection.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </motion.div>
            )}

            {/* Section Content - Rendered with proper formatting */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {currentSection.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-4 pt-4 border-t border-border flex items-center justify-between"
      >
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentSectionIndex === 0}
          className="gap-2"
        >
          <ChevronUp className="w-4 h-4" />
          Précédent
        </Button>

        <div className="flex gap-1">
          {sections.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSectionIndex
                  ? 'bg-primary w-4'
                  : sectionsRead.has(idx)
                    ? 'bg-primary/50'
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {isLastSection && allSectionsRead ? (
          <p className="text-sm text-success font-medium">
            ✓ Cours terminé !
          </p>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isLastSection}
            className="gap-2"
          >
            Suivant
            <ChevronDown className="w-4 h-4" />
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default LessonCard;
