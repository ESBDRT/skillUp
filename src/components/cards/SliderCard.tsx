import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/data/mockData';
import { Slider } from '@/components/ui/slider';

interface SliderCardProps {
  card: Card;
  onComplete: (xp: number) => void;
}

// Default slider config if not provided
const defaultConfig = {
  min: 0,
  max: 100,
  correct: 50,
  unit: '%',
  description: ''
};

const SliderCard = ({ card, onComplete }: SliderCardProps) => {
  // Handle both sliderConfig and slider_config property names
  const rawConfig = card.sliderConfig || (card as any).slider_config;
  
  // Parse config if it's a string (from DB)
  const parsedConfig = typeof rawConfig === 'string' 
    ? JSON.parse(rawConfig) 
    : rawConfig;
  
  // Merge with defaults to ensure all properties exist
  const config = { ...defaultConfig, ...parsedConfig };
  
  const [value, setValue] = useState([Math.floor((config.min + config.max) / 2)]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => {
        onComplete(card.xpReward);
      }, 1500);
    }
  };

  const getImpactText = () => {
    const current = value[0];
    const range = config.max - config.min;
    const percentage = ((current - config.min) / range) * 100;
    
    if (percentage <= 25) return "Niveau faible";
    if (percentage <= 50) return "Niveau modéré";
    if (percentage <= 75) return "Niveau élevé";
    return "Niveau très élevé";
  };

  const getImpactColor = () => {
    const current = value[0];
    const range = config.max - config.min;
    const percentage = ((current - config.min) / range) * 100;
    
    if (percentage <= 25) return "text-success";
    if (percentage <= 50) return "text-level-intermediate";
    if (percentage <= 75) return "text-level-intermediate";
    return "text-destructive";
  };

  return (
    <div className="flex-1 flex flex-col max-w-xl mx-auto w-full">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 sm:mb-6"
      >
        <div className="inline-block px-2.5 sm:px-3 py-1 bg-primary/10 rounded-full mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-medium text-primary">Estimation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2 leading-tight">{card.title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{card.content}</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-elevated border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-4xl sm:text-5xl font-bold text-foreground">
            {value[0]}
          </span>
          <span className="text-xl sm:text-2xl text-muted-foreground ml-1">{config.unit}</span>
        </div>

        <div className="mb-6 sm:mb-8">
          <Slider
            value={value}
            onValueChange={handleValueChange}
            min={config.min}
            max={config.max}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{config.min}{config.unit}</span>
            <span>{config.max}{config.unit}</span>
          </div>
        </div>

        <motion.div
          key={getImpactText()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted ${getImpactColor()}`}
        >
          <p className="font-medium text-sm sm:text-base">{getImpactText()}</p>
        </motion.div>
      </motion.div>

      {config.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground text-center"
        >
          {config.description}
        </motion.p>
      )}
    </div>
  );
};

export default SliderCard;
