import { motion } from 'framer-motion';
import { Flame, Brain, AlertTriangle, RefreshCw, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrainSummaryCardProps {
  streakDays: number;
  memoryHealth: number;
  dangerCount: number;
  reviewCount: number;
  totalConcepts: number;
  onDangerClick?: () => void;
  onReviewClick?: () => void;
}

const BrainSummaryCard = ({
  streakDays,
  memoryHealth,
  dangerCount,
  reviewCount,
  totalConcepts,
  onDangerClick,
  onReviewClick,
}: BrainSummaryCardProps) => {
  const getHealthColor = () => {
    if (memoryHealth >= 70) return 'text-success';
    if (memoryHealth >= 40) return 'text-xp';
    return 'text-destructive';
  };

  const getHealthBg = () => {
    if (memoryHealth >= 70) return 'bg-success/20';
    if (memoryHealth >= 40) return 'bg-xp/20';
    return 'bg-destructive/20';
  };

  const getHealthLabel = () => {
    if (memoryHealth >= 70) return 'Excellent';
    if (memoryHealth >= 40) return 'À renforcer';
    return 'Attention';
  };

  const getStreakIcon = () => {
    if (streakDays >= 7) return '🔥';
    if (streakDays >= 3) return '✨';
    return '💪';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4"
      role="region"
      aria-label="Résumé de la santé mémoire"
    >
      {/* Main stats row - horizontal on mobile */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Streak */}
        <div 
          className="flex items-center gap-2 shrink-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl px-3 py-2"
          role="status"
          aria-label={`Série de ${streakDays} jours`}
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-lg"
          >
            {getStreakIcon()}
          </motion.span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">{streakDays}</span>
            <span className="text-xs text-muted-foreground">j</span>
          </div>
        </div>

        {/* Memory Health - Mini gauge */}
        <div 
          className={`flex items-center gap-2 shrink-0 ${getHealthBg()} rounded-xl px-3 py-2`}
          role="status"
          aria-label={`Santé mémoire: ${memoryHealth}%`}
        >
          <Brain className={`w-4 h-4 ${getHealthColor()}`} />
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${getHealthColor()}`}>{memoryHealth}%</span>
          </div>
          <span className={`text-xs font-medium ${getHealthColor()} hidden xs:inline`}>
            {getHealthLabel()}
          </span>
        </div>

        {/* Danger count - clickable */}
        {dangerCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDangerClick}
            className="flex items-center gap-2 shrink-0 bg-destructive/10 hover:bg-destructive/20 rounded-xl px-3 py-2 h-auto"
            aria-label={`${dangerCount} concepts en danger. Cliquer pour filtrer`}
            aria-pressed={false}
          >
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-lg font-bold text-destructive">{dangerCount}</span>
            <span className="text-xs text-destructive hidden xs:inline">danger</span>
          </Button>
        )}

        {/* Review count - clickable */}
        {reviewCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReviewClick}
            className="flex items-center gap-2 shrink-0 bg-xp/10 hover:bg-xp/20 rounded-xl px-3 py-2 h-auto"
            aria-label={`${reviewCount} concepts à réviser. Cliquer pour filtrer`}
            aria-pressed={false}
          >
            <RefreshCw className="w-4 h-4 text-xp" />
            <span className="text-lg font-bold text-xp">{reviewCount}</span>
            <span className="text-xs text-xp hidden xs:inline">à revoir</span>
          </Button>
        )}

        {/* Solid count indicator */}
        {totalConcepts > 0 && (
          <div 
            className="flex items-center gap-2 shrink-0 bg-success/10 rounded-xl px-3 py-2"
            role="status"
            aria-label={`${totalConcepts - dangerCount - reviewCount} concepts solides sur ${totalConcepts}`}
          >
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-lg font-bold text-success">
              {totalConcepts - dangerCount - (reviewCount - dangerCount > 0 ? reviewCount - dangerCount : 0)}
            </span>
            <span className="text-xs text-success hidden xs:inline">solides</span>
          </div>
        )}
      </div>

      {/* Concepts count footer */}
      <div className="flex items-center justify-center mt-3 pt-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{totalConcepts}</span> concepts en mémoire
        </p>
      </div>
    </motion.div>
  );
};

export default BrainSummaryCard;
