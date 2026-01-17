import { motion } from 'framer-motion';

interface StoryProgressProps {
  current: number;
  total: number;
}

const StoryProgress = ({ current, total }: StoryProgressProps) => {
  return (
    <div className="flex-1 flex gap-1">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            index < current
              ? 'bg-primary'
              : index === current
              ? 'bg-primary/50'
              : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
};

export default StoryProgress;
