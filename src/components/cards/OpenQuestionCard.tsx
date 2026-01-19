import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Card } from '@/data/mockData';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface OpenQuestionCardProps {
  card: Card;
  onComplete: (xp: number) => void;
  onNext?: () => void;
}

const OpenQuestionCard = ({ card, onComplete, onNext }: OpenQuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{
    isValid: boolean;
    message: string;
    additions: string[];
  } | null>(null);

  const analyzeAnswer = async (userAnswer: string): Promise<{ isValid: boolean; message: string; additions: string[] }> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-response', {
        body: {
          question: card.content,
          expectedAnswer: (card as any).expectedAnswer || card.flashcardBack || '',
          userAnswer: userAnswer,
          cardTitle: card.title
        }
      });

      if (error || !data) {
        // Fallback: basic validation
        const hasMinLength = userAnswer.length >= 20;
        const hasSomeKeywords = (card.content + (card as any).expectedAnswer).toLowerCase()
          .split(' ')
          .filter(w => w.length > 4)
          .some(keyword => userAnswer.toLowerCase().includes(keyword.toLowerCase()));
        
        return {
          isValid: hasMinLength && hasSomeKeywords,
          message: hasMinLength 
            ? "Bonne réflexion ! Votre réponse montre une compréhension du sujet."
            : "Essayez de développer davantage votre réponse.",
          additions: []
        };
      }

      return data;
    } catch (error) {
      console.error('Error analyzing answer:', error);
      return {
        isValid: true,
        message: "Merci pour votre réponse ! Continuez à explorer ce sujet.",
        additions: []
      };
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (answer.trim().length === 0) return;

    setIsSubmitting(true);
    
    const result = await analyzeAnswer(answer);
    setFeedback(result);
    setIsSubmitting(false);
    
    // Award XP immediately
    if (!hasCompleted) {
      setHasCompleted(true);
      onComplete(result.isValid ? card.xpReward : Math.floor(card.xpReward / 2));
    }
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-xl mx-auto w-full">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 sm:mb-6"
      >
        <div className="inline-block px-2.5 sm:px-3 py-1 bg-primary/10 rounded-full mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-medium text-primary">Question ouverte</span>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1.5 sm:mb-2 leading-tight">{card.title}</h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{card.content}</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {!feedback ? (
          <>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              className="flex-1 min-h-[100px] sm:min-h-[120px] md:min-h-[150px] rounded-xl sm:rounded-2xl resize-none text-sm sm:text-base"
              autoFocus
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 text-center sm:text-left">
                {answer.length > 0 && `${answer.length} caractères`}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={answer.trim().length === 0 || isSubmitting}
                className="gradient-primary rounded-xl px-4 sm:px-6 py-3 sm:py-2 text-sm sm:text-base order-1 sm:order-2 touch-target"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Valider
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                feedback.isValid 
                  ? 'bg-success/10 border-success/20' 
                  : 'bg-warning/10 border-warning/20'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                {feedback.isValid ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-warning flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <h3 className={`font-semibold mb-1 text-sm sm:text-base ${feedback.isValid ? 'text-success' : 'text-warning'}`}>
                    {feedback.isValid ? 'Bonne réponse !' : 'À améliorer'}
                  </h3>
                  <p className="text-sm sm:text-base text-foreground">{feedback.message}</p>
                </div>
              </div>
              
              {feedback.additions && feedback.additions.length > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-xs sm:text-sm font-medium text-primary">Pour aller plus loin</span>
                  </div>
                  <ul className="space-y-1">
                    {feedback.additions.map((addition, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary flex-shrink-0">•</span>
                        <span>{addition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 sm:mt-6 flex justify-center"
            >
              <Button
                onClick={handleContinue}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-3 bg-primary text-primary-foreground rounded-xl sm:rounded-full font-medium hover:bg-primary/90 transition-colors touch-target"
              >
                Continuer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OpenQuestionCard;
