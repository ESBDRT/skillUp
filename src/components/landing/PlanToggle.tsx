import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';

interface PlanToggleProps {
  planType: 'individual' | 'company';
  onToggle: (type: 'individual' | 'company') => void;
  labels?: {
    individual: string;
    company: string;
  };
}

const PlanToggle = ({ 
  planType, 
  onToggle, 
  labels = { individual: 'Individual', company: 'Company' } 
}: PlanToggleProps) => {
  return (
    <div className="inline-flex items-center gap-1 p-1.5 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm">
      <motion.button
        onClick={() => onToggle('individual')}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
          planType === 'individual' 
            ? 'text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {planType === 'individual' && (
          <motion.div
            layoutId="toggle-bg"
            className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-full shadow-lg"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          />
        )}
        <User className="w-4 h-4 relative z-10" />
        <span className="relative z-10">{labels.individual}</span>
      </motion.button>
      
      <motion.button
        onClick={() => onToggle('company')}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
          planType === 'company' 
            ? 'text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {planType === 'company' && (
          <motion.div
            layoutId="toggle-bg"
            className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-full shadow-lg"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          />
        )}
        <Building2 className="w-4 h-4 relative z-10" />
        <span className="relative z-10">{labels.company}</span>
      </motion.button>
    </div>
  );
};

export default PlanToggle;
