import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  index?: number;
}

const FAQItem = ({ question, answer, index = 0 }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
      className={`group transition-colors ${isOpen ? 'bg-muted/30' : ''}`}
    >
      {/* Top divider (only for first item) */}
      {index === 0 && <div className="h-px bg-border" />}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-4 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Active indicator */}
          <div className={`w-1 h-6 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary' : 'bg-transparent'}`} />
          <span className={`font-medium transition-colors ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
            {question}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 shrink-0 transition-all duration-300 ${
            isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
          }`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-4 pl-8">
              <p 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: answer.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>') 
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom divider */}
      <div className="h-px bg-border" />
    </motion.div>
  );
};

export default FAQItem;
