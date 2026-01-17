import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = 'Rechercher...' }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={`relative flex items-center transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
      } bg-muted rounded-xl`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-12 pr-10 py-6 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute right-4 p-1 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
