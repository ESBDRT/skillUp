import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronLeft, CheckCircle, XCircle, RotateCcw, Trophy, Loader2, Send, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMemoryConcepts, MemoryConcept } from '@/hooks/useMemoryConcepts';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

type QuestionType = 'flashcard' | 'qcm' | 'open';

interface QCMData {
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

interface OpenData {
  question: string;
  expectedAnswer: string;
  hints: string[];
}

interface FlashcardData {
  front: string;
  back: string;
  tip: string;
}

interface GeneratedQuestion {
  type: QuestionType;
  data: QCMData | OpenData | FlashcardData;
}

const SmartSession = () => {
  const navigate = useNavigate();
  const { concepts, getConceptsForReview, updateConceptAfterReview, loading } = useMemoryConcepts();
  
  const [sessionConcepts, setSessionConcepts] = useState<MemoryConcept[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  
  // Question generation state
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Answer state
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!loading && concepts.length > 0) {
      const reviewConcepts = getConceptsForReview();
      const shuffled = [...reviewConcepts].sort(() => Math.random() - 0.5).slice(0, 10);
      setSessionConcepts(shuffled);
    }
  }, [loading, concepts, getConceptsForReview]);

  const currentConcept = sessionConcepts[currentIndex];

  // Generate a question when concept changes
  useEffect(() => {
    if (currentConcept && !currentQuestion && !isGenerating) {
      generateQuestion();
    }
  }, [currentConcept, currentIndex]);

  const generateQuestion = async () => {
    if (!currentConcept) return;
    
    setIsGenerating(true);
    setCurrentQuestion(null);
    setShowAnswer(false);
    setSelectedOption(null);
    setOpenAnswer('');
    setFeedback(null);
    setShowHint(false);

    // Randomly select question type (weighted towards variety)
    const types: QuestionType[] = ['flashcard', 'qcm', 'open'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    try {
      const { data, error } = await supabase.functions.invoke('generate-review-question', {
        body: {
          concept: {
            concept_title: currentConcept.concept_title,
            concept_content: currentConcept.concept_content,
          },
          questionType: randomType,
        },
      });

      if (error) throw error;

      setCurrentQuestion({
        type: data.type,
        data: data.data,
      });
    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback to simple flashcard
      setCurrentQuestion({
        type: 'flashcard',
        data: {
          front: currentConcept.concept_title,
          back: currentConcept.concept_content || 'Révise ce concept',
          tip: 'Essaie de te rappeler le contexte où tu as appris ceci.',
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQCMSelect = (optionId: string) => {
    if (selectedOption) return; // Already answered
    
    setSelectedOption(optionId);
    const qcmData = currentQuestion?.data as QCMData;
    const selectedOpt = qcmData.options.find(o => o.id === optionId);
    const correctOpt = qcmData.options.find(o => o.isCorrect);
    
    if (selectedOpt?.isCorrect) {
      setFeedback({ isCorrect: true, message: qcmData.explanation });
    } else {
      setFeedback({ 
        isCorrect: false, 
        message: `La bonne réponse était : ${correctOpt?.text}. ${qcmData.explanation}` 
      });
    }
  };

  const handleOpenSubmit = async () => {
    if (!openAnswer.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    const openData = currentQuestion?.data as OpenData;

    try {
      const { data, error } = await supabase.functions.invoke('analyze-response', {
        body: {
          question: openData.question,
          expectedAnswer: openData.expectedAnswer,
          userAnswer: openAnswer,
        },
      });

      if (error) throw error;

      setFeedback({
        isCorrect: data.isCorrect,
        message: data.feedback + (data.additions ? `\n\n💡 ${data.additions}` : ''),
      });
    } catch (error) {
      console.error('Error analyzing answer:', error);
      // Simple fallback
      const similarity = openAnswer.toLowerCase().includes(currentConcept.concept_title.toLowerCase());
      setFeedback({
        isCorrect: similarity,
        message: similarity 
          ? 'Bonne réponse ! Tu as bien retenu ce concept.'
          : `La réponse attendue incluait : ${openData.expectedAnswer}`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
      setCurrentQuestion(null);
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
    setCurrentQuestion(null);
    setShowAnswer(false);
    setSessionComplete(false);
    setStats({ correct: 0, incorrect: 0 });
    setFeedback(null);
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

  // Render question based on type
  const renderQuestion = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Génération de la question...</p>
        </div>
      );
    }

    if (!currentQuestion) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Brain className="w-12 h-12 text-primary mb-4" />
          <p className="text-muted-foreground">Préparation...</p>
        </div>
      );
    }

    switch (currentQuestion.type) {
      case 'qcm': {
        const qcmData = currentQuestion.data as QCMData;
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              {qcmData.question}
            </h2>
            <div className="space-y-2">
              {qcmData.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const showResult = selectedOption !== null;
                
                let bgClass = 'bg-muted hover:bg-muted/80';
                if (showResult) {
                  if (option.isCorrect) {
                    bgClass = 'bg-success/20 border-success';
                  } else if (isSelected && !option.isCorrect) {
                    bgClass = 'bg-destructive/20 border-destructive';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleQCMSelect(option.id)}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${bgClass} ${
                      isSelected ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <span className="font-medium">{option.id.toUpperCase()}.</span> {option.text}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case 'open': {
        const openData = currentQuestion.data as OpenData;
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              {openData.question}
            </h2>
            
            {!feedback && (
              <>
                <Textarea
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  placeholder="Ta réponse..."
                  className="min-h-[120px]"
                />
                
                {showHint && openData.hints.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-xp/10 rounded-lg p-3 text-sm"
                  >
                    <p className="font-medium text-xp mb-1">💡 Indices :</p>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {openData.hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                
                <div className="flex gap-2">
                  {!showHint && (
                    <Button variant="outline" onClick={() => setShowHint(true)}>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Indice
                    </Button>
                  )}
                  <Button 
                    onClick={handleOpenSubmit} 
                    disabled={!openAnswer.trim() || isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Valider
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      }

      case 'flashcard':
      default: {
        const flashData = currentQuestion.data as FlashcardData;
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                {flashData.front}
              </h2>
              {!showAnswer && (
                <p className="text-muted-foreground text-sm">
                  Essaie de te rappeler la réponse...
                </p>
              )}
            </div>

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-foreground">{flashData.back}</p>
                </div>
                {flashData.tip && (
                  <div className="bg-primary/10 rounded-xl p-3 text-sm">
                    <p className="text-primary">💡 {flashData.tip}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        );
      }
    }
  };

  const canShowResponseButtons = () => {
    if (!currentQuestion) return false;
    
    switch (currentQuestion.type) {
      case 'qcm':
        return selectedOption !== null;
      case 'open':
        return feedback !== null;
      case 'flashcard':
        return showAnswer;
      default:
        return false;
    }
  };

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

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-card border border-border rounded-2xl p-6 min-h-[300px]"
        >
          {renderQuestion()}
          
          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl ${
                feedback.isCorrect ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'
              }`}
            >
              <div className="flex items-start gap-2">
                {feedback.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <p className={`text-sm whitespace-pre-wrap ${feedback.isCorrect ? 'text-success' : 'text-destructive'}`}>
                  {feedback.message}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-8 space-y-4">
        {currentQuestion?.type === 'flashcard' && !showAnswer ? (
          <Button
            onClick={() => setShowAnswer(true)}
            className="w-full py-6 text-lg"
          >
            Montrer la réponse
          </Button>
        ) : canShowResponseButtons() ? (
          <>
            <p className="text-center text-muted-foreground text-sm mb-4">
              Comment as-tu trouvé ?
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
        ) : null}
      </div>
    </div>
  );
};

export default SmartSession;
