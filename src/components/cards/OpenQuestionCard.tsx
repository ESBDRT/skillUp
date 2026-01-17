import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Card } from '@/data/mockData';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface OpenQuestionCardProps {
  card: Card;
  onComplete: (xp: number) => void;
}

const OpenQuestionCard = ({ card, onComplete }: OpenQuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (answer.length < 10) return;

    setIsSubmitting(true);
    
    // Simulate AI verification
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback("Excellente réflexion ! Vous avez bien identifié les points clés. Continuez à appliquer ces concepts dans votre quotidien.");
      onComplete(card.xpReward);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
          <span className="text-sm font-medium text-primary">Question ouverte</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{card.title}</h2>
        <p className="text-lg text-muted-foreground">{card.content}</p>
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
              className="flex-1 min-h-[150px] rounded-2xl resize-none text-base"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                {answer.length}/10 caractères minimum
              </span>
              <Button
                onClick={handleSubmit}
                disabled={answer.length < 10 || isSubmitting}
                className="gradient-primary rounded-xl px-6"
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
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-success/10 rounded-2xl p-6 border border-success/20"
          >
            <h3 className="font-semibold text-success mb-2">Feedback IA</h3>
            <p className="text-foreground">{feedback}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OpenQuestionCard;
