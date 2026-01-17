import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPPopupProps {
  amount: number;
}

const XPPopup = ({ amount }: XPPopupProps) => {
  return (
    <motion.div
      initial={{ scale: 0, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0, y: -20, opacity: 0 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="flex items-center gap-2 px-6 py-3 bg-xp rounded-full shadow-glow animate-xp-pop">
        <Zap className="w-6 h-6 text-foreground fill-foreground" />
        <span className="text-2xl font-bold text-foreground">+{amount} XP</span>
      </div>
    </motion.div>
  );
};

export default XPPopup;
