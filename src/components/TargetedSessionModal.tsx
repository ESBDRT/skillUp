import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { MemoryConcept } from '@/hooks/useMemoryConcepts';

type SessionType = 'all' | 'danger' | 'course';

interface TargetedSessionModalProps {
  concepts: MemoryConcept[];
  conceptsByCourse: Record<string, { courseTitle: string; concepts: MemoryConcept[] }>;
  onStartSession: (conceptIds: string[]) => void;
}

const TargetedSessionModal = ({
  concepts,
  conceptsByCourse,
  onStartSession,
}: TargetedSessionModalProps) => {
  const [open, setOpen] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [conceptCount, setConceptCount] = useState(10);

  const dangerConcepts = concepts.filter(c => c.memory_strength < 40);
  const reviewableConcepts = concepts.filter(c => 
    new Date(c.next_review_at) <= new Date() || c.memory_strength < 50
  );

  const getTargetConcepts = (): MemoryConcept[] => {
    let targetConcepts: MemoryConcept[] = [];

    switch (sessionType) {
      case 'danger':
        targetConcepts = dangerConcepts;
        break;
      case 'course':
        if (selectedCourse && conceptsByCourse[selectedCourse]) {
          targetConcepts = conceptsByCourse[selectedCourse].concepts.filter(c =>
            new Date(c.next_review_at) <= new Date() || c.memory_strength < 50
          );
        }
        break;
      case 'all':
      default:
        targetConcepts = reviewableConcepts;
    }

    // Shuffle and limit
    return [...targetConcepts]
      .sort(() => Math.random() - 0.5)
      .slice(0, conceptCount);
  };

  const handleStart = () => {
    const targetConcepts = getTargetConcepts();
    if (targetConcepts.length > 0) {
      onStartSession(targetConcepts.map(c => c.id));
      setOpen(false);
    }
  };

  const previewCount = getTargetConcepts().length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full py-6 text-lg font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Zap className="w-5 h-5 mr-2" />
          Session ciblée
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Session ciblée
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Session Type Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Type de session</p>
            <div className="grid gap-2">
              <SessionTypeButton
                icon={<Clock className="w-4 h-4" />}
                label="Tous à réviser"
                description={`${reviewableConcepts.length} concepts`}
                selected={sessionType === 'all'}
                onClick={() => {
                  setSessionType('all');
                  setSelectedCourse(null);
                }}
              />
              <SessionTypeButton
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Focus danger"
                description={`${dangerConcepts.length} en danger`}
                selected={sessionType === 'danger'}
                onClick={() => {
                  setSessionType('danger');
                  setSelectedCourse(null);
                }}
                disabled={dangerConcepts.length === 0}
              />
              <SessionTypeButton
                icon={<BookOpen className="w-4 h-4" />}
                label="Par cours"
                description="Choisir un cours"
                selected={sessionType === 'course'}
                onClick={() => setSessionType('course')}
              />
            </div>
          </div>

          {/* Course Selection (if course type) */}
          {sessionType === 'course' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <p className="text-sm font-medium text-foreground">Sélectionner un cours</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {Object.entries(conceptsByCourse).map(([courseId, { courseTitle, concepts: courseConcepts }]) => {
                  const reviewable = courseConcepts.filter(c =>
                    new Date(c.next_review_at) <= new Date() || c.memory_strength < 50
                  ).length;
                  
                  return (
                    <button
                      key={courseId}
                      onClick={() => setSelectedCourse(courseId)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                        selectedCourse === courseId
                          ? 'bg-primary/10 border border-primary'
                          : 'bg-muted hover:bg-muted/80 border border-transparent'
                      }`}
                    >
                      <span className="font-medium text-foreground truncate">{courseTitle}</span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {reviewable} à réviser
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Concept Count Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Nombre de concepts</p>
              <span className="text-sm text-muted-foreground">{conceptCount}</span>
            </div>
            <Slider
              value={[conceptCount]}
              onValueChange={([value]) => setConceptCount(value)}
              min={5}
              max={20}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 min</span>
              <span>20 max</span>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStart}
            disabled={previewCount === 0}
            className="w-full"
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            Démarrer ({previewCount} concepts)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface SessionTypeButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SessionTypeButton = ({
  icon,
  label,
  description,
  selected,
  onClick,
  disabled,
}: SessionTypeButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
      disabled
        ? 'opacity-50 cursor-not-allowed bg-muted'
        : selected
        ? 'bg-primary/10 border border-primary'
        : 'bg-muted hover:bg-muted/80 border border-transparent'
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
      selected ? 'bg-primary text-primary-foreground' : 'bg-background'
    }`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </button>
);

export default TargetedSessionModal;
