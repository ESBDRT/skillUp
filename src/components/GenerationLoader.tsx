import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, BookOpen, Lightbulb, Puzzle } from 'lucide-react';

const loadingSteps = [
  { icon: Brain, text: "Analyse du thème..." },
  { icon: Lightbulb, text: "Génération des concepts clés..." },
  { icon: BookOpen, text: "Création du contenu pédagogique..." },
  { icon: Puzzle, text: "Préparation des quiz et exercices..." },
  { icon: Sparkles, text: "Finalisation du cours..." },
];

export function GenerationLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = loadingSteps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentIcon className="w-12 h-12 text-primary" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-primary/40"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `${40 + i * 15}px 0`,
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-medium text-foreground mb-2"
        >
          {loadingSteps[currentStep].text}
        </motion.p>
      </AnimatePresence>

      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Notre IA crée un cours personnalisé basé sur vos préférences. Cela prend généralement 10-20 secondes.
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {loadingSteps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentStep ? 'bg-primary' : 'bg-primary/20'
            }`}
            animate={index === currentStep ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}
