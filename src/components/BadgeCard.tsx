import { motion } from 'framer-motion';
import { Badge, getBadgeProgress, isUnlocked } from '@/data/badges';
import { Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BadgeCardProps {
  badge: Badge;
  stats: {
    xp: number;
    streak: number;
    coursesCompleted: number;
    conceptsLearned: number;
    coursesCreated: number;
  };
  index?: number;
}

const BadgeCard = ({ badge, stats, index = 0 }: BadgeCardProps) => {
  const unlocked = isUnlocked(badge, stats);
  const progress = getBadgeProgress(badge, stats);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all ${
        unlocked
          ? 'bg-card border-primary/30 shadow-lg'
          : 'bg-muted/30 border-border opacity-60'
      }`}
    >
      {/* Badge Icon */}
      <div
        className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
          unlocked ? `bg-gradient-to-br ${badge.color}` : 'bg-muted'
        }`}
      >
        {unlocked ? (
          <span className="text-3xl">{badge.icon}</span>
        ) : (
          <Lock className="w-6 h-6 text-muted-foreground" />
        )}
        
        {/* Shine effect for unlocked badges */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.1, 1.2] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}
      </div>

      {/* Badge Name */}
      <h3 className={`text-sm font-semibold text-center ${
        unlocked ? 'text-foreground' : 'text-muted-foreground'
      }`}>
        {badge.name}
      </h3>

      {/* Badge Description */}
      <p className="text-xs text-muted-foreground text-center mt-1">
        {badge.description}
      </p>

      {/* Progress bar for locked badges */}
      {!unlocked && progress > 0 && (
        <div className="w-full mt-2">
          <Progress value={progress} className="h-1.5" />
          <p className="text-[10px] text-muted-foreground text-center mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Unlocked indicator */}
      {unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center"
        >
          <span className="text-xs">✓</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BadgeCard;
