import { motion } from 'framer-motion';
import { Flame, Target, Award, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewStreakProps {
  streakDays: number;
  lastActivityDate: string | null;
  dailyGoal: number;
  todayReviews: number;
  weeklyStats: {
    totalReviews: number;
    correctReviews: number;
  };
}

const ReviewStreak = ({
  streakDays,
  lastActivityDate,
  dailyGoal,
  todayReviews,
  weeklyStats,
}: ReviewStreakProps) => {
  const dailyProgress = Math.min((todayReviews / dailyGoal) * 100, 100);
  const weeklyAccuracy = weeklyStats.totalReviews > 0 
    ? Math.round((weeklyStats.correctReviews / weeklyStats.totalReviews) * 100) 
    : 0;

  const getStreakStatus = () => {
    if (streakDays >= 30) return { label: 'Légendaire', color: 'text-xp', bg: 'bg-xp/20' };
    if (streakDays >= 14) return { label: 'Expert', color: 'text-primary', bg: 'bg-primary/20' };
    if (streakDays >= 7) return { label: 'Régulier', color: 'text-success', bg: 'bg-success/20' };
    if (streakDays >= 3) return { label: 'Débutant', color: 'text-muted-foreground', bg: 'bg-muted' };
    return { label: 'Nouveau', color: 'text-muted-foreground', bg: 'bg-muted' };
  };

  const status = getStreakStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-4"
    >
      {/* Header with streak */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center"
          >
            <Flame className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{streakDays}</span>
              <span className="text-sm text-muted-foreground">jours</span>
            </div>
            <span className={`text-xs font-medium ${status.color} ${status.bg} px-2 py-0.5 rounded-full`}>
              {status.label}
            </span>
          </div>
        </div>
        
        {/* Last activity */}
        {lastActivityDate && (
          <div className="text-right text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 inline mr-1" />
            <span>
              {formatDistanceToNow(new Date(lastActivityDate), { addSuffix: true, locale: fr })}
            </span>
          </div>
        )}
      </div>

      {/* Daily Goal Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-foreground">Objectif du jour</span>
          </div>
          <span className="text-muted-foreground">
            {todayReviews}/{dailyGoal} révisions
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${dailyProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        {dailyProgress >= 100 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-success text-sm"
          >
            <Award className="w-4 h-4" />
            <span>Objectif atteint ! 🎉</span>
          </motion.div>
        )}
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{weeklyStats.totalReviews}</p>
          <p className="text-xs text-muted-foreground">Révisions cette semaine</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{weeklyAccuracy}%</p>
          <p className="text-xs text-muted-foreground">Précision</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewStreak;
