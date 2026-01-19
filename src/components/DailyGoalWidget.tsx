import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyGoalWidgetProps {
  currentMinutes: number;
  goalMinutes: number;
  isLoading?: boolean;
}

export function DailyGoalWidget({ currentMinutes, goalMinutes, isLoading }: DailyGoalWidgetProps) {
  const progress = Math.min((currentMinutes / goalMinutes) * 100, 100);
  const isOnTrack = currentMinutes >= goalMinutes * 0.5;
  const isComplete = currentMinutes >= goalMinutes;

  // Circular progress calculation
  const size = 56;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border animate-pulse">
        <div className="w-14 h-14 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border shadow-card"
    >
      {/* Circular Progress */}
      <div className="relative flex-shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className={cn(
              isComplete ? 'text-success' : isOnTrack ? 'text-primary' : 'text-warning'
            )}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Target className={cn(
            'w-5 h-5',
            isComplete ? 'text-success' : isOnTrack ? 'text-primary' : 'text-warning'
          )} />
        </div>
      </div>

      {/* Text info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">
          {currentMinutes}/{goalMinutes} min
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {isComplete 
            ? 'Objectif atteint ! 🎉' 
            : isOnTrack 
              ? 'Continue comme ça !' 
              : 'Encore un petit effort !'}
        </p>
      </div>

      {/* Status badge */}
      <span className={cn(
        'text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0',
        isComplete 
          ? 'bg-success/10 text-success' 
          : isOnTrack 
            ? 'bg-primary/10 text-primary' 
            : 'bg-warning/10 text-warning'
      )}>
        {isComplete ? '✓ Complet' : isOnTrack ? 'En forme' : 'En retard'}
      </span>
    </motion.div>
  );
}
