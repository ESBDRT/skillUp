import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface MemoryHealthGaugeProps {
  percentage: number;
  conceptCount: number;
}

const MemoryHealthGauge = ({ percentage, conceptCount }: MemoryHealthGaugeProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return 'hsl(var(--success))';
    if (percentage >= 40) return 'hsl(var(--xp))';
    return 'hsl(var(--destructive))';
  };

  const getStatus = () => {
    if (percentage >= 70) return 'Excellent';
    if (percentage >= 40) return 'À renforcer';
    return 'Attention requise';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative w-40 h-40">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r="45"
            stroke={getColor()}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <Brain className="w-8 h-8 text-primary mb-1" />
          </motion.div>
          <motion.span
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ color: getColor() }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>

      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="text-lg font-semibold" style={{ color: getColor() }}>
          {getStatus()}
        </p>
        <p className="text-sm text-muted-foreground">
          {conceptCount} concept{conceptCount !== 1 ? 's' : ''} en mémoire
        </p>
      </motion.div>
    </div>
  );
};

export default MemoryHealthGauge;
