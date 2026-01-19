import { motion } from 'framer-motion';
import { Sparkles, Quote } from 'lucide-react';
import { useMemo } from 'react';

const quotes = [
  "Un petit pas chaque jour mène loin.",
  "La répétition est la mère de l'apprentissage.",
  "Apprendre, c'est grandir un peu chaque jour.",
  "La curiosité est le moteur du savoir.",
  "Chaque erreur est une leçon déguisée.",
  "La persévérance ouvre toutes les portes.",
  "Ton cerveau te remerciera demain.",
  "Le savoir est le seul bien qui s'enrichit en le partageant.",
  "Aujourd'hui, tu construis le toi de demain.",
  "Chaque minute compte dans ton parcours.",
];

export function MotivationWidget() {
  // Get a quote based on the day (changes daily)
  const quote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return quotes[dayOfYear % quotes.length];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/50 rounded-2xl p-4 flex items-start gap-3"
    >
      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm italic text-muted-foreground leading-relaxed">
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
}
