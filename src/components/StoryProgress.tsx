import { motion } from 'framer-motion';

interface StoryProgressProps {
  current: number;
  total: number;
}

const StoryProgress = ({ current, total }: StoryProgressProps) => {
  // For many cards, show a continuous progress bar instead of segments
  const useSegments = total <= 12;

  if (!useSegments) {
    const progress = ((current + 1) / total) * 100;
    return (
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex gap-1">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: index * 0.02 }}
          className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
            index < current
              ? 'bg-primary'
              : index === current
              ? 'bg-primary/60'
              : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
};

export default StoryProgress;
