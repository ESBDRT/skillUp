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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border group"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left transition-colors"
      >
        <span className="font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">
          {question}
        </span>
        <div className={`p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary/10' : 'bg-transparent group-hover:bg-muted'}`}>
          <ChevronDown 
            className={`w-5 h-5 shrink-0 transition-all duration-300 ${
              isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
            }`} 
          />
        </div>
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
            <div className="pb-5 pl-0">
              <div className="p-4 bg-muted/30 rounded-xl border-l-4 border-primary/30">
                <p 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: answer.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold">$1</strong>') 
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;
