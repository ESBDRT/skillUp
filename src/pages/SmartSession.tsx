import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronLeft, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMemoryConcepts, MemoryConcept } from '@/hooks/useMemoryConcepts';
import confetti from 'canvas-confetti';

const SmartSession = () => {
  const navigate = useNavigate();
  const { concepts, getConceptsForReview, updateConceptAfterReview, loading } = useMemoryConcepts();
  
  const [sessionConcepts, setSessionConcepts] = useState<MemoryConcept[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    if (!loading && concepts.length > 0) {
      const reviewConcepts = getConceptsForReview();
      // Shuffle and take up to 10 concepts
      const shuffled = [...reviewConcepts].sort(() => Math.random() - 0.5).slice(0, 10);
      setSessionConcepts(shuffled);
    }
  }, [loading, concepts, getConceptsForReview]);

  const currentConcept = sessionConcepts[currentIndex];

  const handleResponse = async (quality: number) => {
    if (!currentConcept) return;

    await updateConceptAfterReview(currentConcept.id, quality);

    if (quality >= 3) {
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    if (currentIndex < sessionConcepts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
      if (stats.correct + 1 >= sessionConcepts.length * 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    const reviewConcepts = getConceptsForReview();
    const shuffled = [...reviewConcepts].sort(() => Math.random() - 0.5).slice(0, 10);
    setSessionConcepts(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionComplete(false);
    setStats({ correct: 0, incorrect: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Brain className="w-16 h-16 text-primary" />
          <p className="text-muted-foreground">Préparation de la session...</p>
        </div>
      </div>
    );
  }

  if (sessionConcepts.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <header className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/brain')}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Smart Session</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-20">
          <Trophy className="w-20 h-20 text-success mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Tout est à jour !</h2>
          <p className="text-muted-foreground text-center mb-6">
            Tu n'as aucun concept à réviser pour l'instant. Reviens plus tard !
          </p>
          <Button onClick={() => navigate('/brain')}>Retour au Cerveau</Button>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const percentage = Math.round((stats.correct / sessionConcepts.length) * 100);

    return (
      <div className="min-h-screen bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[80vh] text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              percentage >= 70 ? 'bg-success/20' : 'bg-xp/20'
            }`}
          >
            <Trophy className={`w-12 h-12 ${percentage >= 70 ? 'text-success' : 'text-xp'}`} />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Session terminée !</h1>
          <p className="text-muted-foreground mb-6">
            Tu as révisé {sessionConcepts.length} concept{sessionConcepts.length > 1 ? 's' : ''}
          </p>

          <div className="flex gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center gap-2 text-success mb-1">
                <CheckCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">{stats.correct}</span>
              </div>
              <p className="text-sm text-muted-foreground">Corrects</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <XCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">{stats.incorrect}</span>
              </div>
              <p className="text-sm text-muted-foreground">À revoir</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/brain')}>
              Retour au Cerveau
            </Button>
            <Button onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Nouvelle session
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/brain')}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Révision</p>
          <p className="font-semibold text-foreground">
            {currentIndex + 1} / {sessionConcepts.length}
          </p>
        </div>
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / sessionConcepts.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentConcept.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-card border border-border rounded-2xl p-6 min-h-[300px] flex flex-col justify-center items-center text-center"
        >
          <div className="mb-6">
            <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              {currentConcept.concept_title}
            </h2>
            {!showAnswer && (
              <p className="text-muted-foreground text-sm">
                Essaie de te rappeler ce concept...
              </p>
            )}
          </div>

          {showAnswer && currentConcept.concept_content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/50 rounded-xl p-4 w-full"
            >
              <p className="text-foreground">{currentConcept.concept_content}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-8 space-y-4">
        {!showAnswer ? (
          <Button
            onClick={() => setShowAnswer(true)}
            className="w-full py-6 text-lg"
          >
            Montrer la réponse
          </Button>
        ) : (
          <>
            <p className="text-center text-muted-foreground text-sm mb-4">
              Comment tu as trouvé ?
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="py-6 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex flex-col gap-1"
                onClick={() => handleResponse(1)}
              >
                <XCircle className="w-6 h-6" />
                <span className="text-xs">Oublié</span>
              </Button>
              <Button
                variant="outline"
                className="py-6 border-xp text-xp hover:bg-xp hover:text-background flex flex-col gap-1"
                onClick={() => handleResponse(3)}
              >
                <RotateCcw className="w-6 h-6" />
                <span className="text-xs">Difficile</span>
              </Button>
              <Button
                variant="outline"
                className="py-6 border-success text-success hover:bg-success hover:text-white flex flex-col gap-1"
                onClick={() => handleResponse(5)}
              >
                <CheckCircle className="w-6 h-6" />
                <span className="text-xs">Facile</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SmartSession;
