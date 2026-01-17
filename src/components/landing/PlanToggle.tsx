import { motion } from 'framer-motion';

interface PlanToggleProps {
  planType: 'individual' | 'company';
  onToggle: (type: 'individual' | 'company') => void;
}

const PlanToggle = ({ planType, onToggle }: PlanToggleProps) => {
  return (
    <div className="inline-flex bg-muted p-1 rounded-full">
      <button
        onClick={() => onToggle('individual')}
        className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
          planType === 'individual' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {planType === 'individual' && (
          <motion.div
            layoutId="toggle-bg"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Individual</span>
      </button>
      <button
        onClick={() => onToggle('company')}
        className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
          planType === 'company' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {planType === 'company' && (
          <motion.div
            layoutId="toggle-bg"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Company</span>
      </button>
    </div>
  );
};

export default PlanToggle;
