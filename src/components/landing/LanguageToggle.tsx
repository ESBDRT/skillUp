import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  language: 'en' | 'fr';
  onToggle: (language: 'en' | 'fr') => void;
}

const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  return (
    <motion.button
      onClick={() => onToggle(language === 'en' ? 'fr' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted border border-border/50 transition-all duration-200 group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-sm font-medium text-foreground uppercase tracking-wide">
        {language}
      </span>
    </motion.button>
  );
};

export default LanguageToggle;
