import { motion } from 'framer-motion';
import { Trophy, Zap, Clock, ArrowRight } from 'lucide-react';
import { Lesson } from '@/data/mockData';
import { Button } from '@/components/ui/button';

interface VictoryScreenProps {
  lesson: Lesson;
  earnedXP: number;
  onClose: () => void;
}

const VictoryScreen = ({ lesson, earnedXP, onClose }: VictoryScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <div className="w-32 h-32 rounded-full gradient-success flex items-center justify-center shadow-glow">
          <Trophy className="w-16 h-16 text-success-foreground" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-foreground text-center mb-2"
      >
        Félicitations ! 🎉
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-center mb-8"
      >
        Vous avez terminé "{lesson.title}"
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm bg-card rounded-3xl p-6 shadow-elevated border border-border mb-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 text-center">Récapitulatif</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-xp/10 rounded-2xl">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-xp fill-xp" />
              <span className="font-medium text-foreground">XP gagnés</span>
            </div>
            <span className="text-xl font-bold text-xp">+{earnedXP}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-2xl">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Temps</span>
            </div>
            <span className="text-xl font-bold text-primary">{lesson.estimatedMinutes} min</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm"
      >
        <Button
          onClick={onClose}
          className="w-full h-14 text-lg font-semibold rounded-2xl gradient-primary"
        >
          Continuer
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default VictoryScreen;
