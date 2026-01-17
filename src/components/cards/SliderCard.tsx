import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/data/mockData';
import { Slider } from '@/components/ui/slider';

interface SliderCardProps {
  card: Card;
  onComplete: (xp: number) => void;
}

const SliderCard = ({ card, onComplete }: SliderCardProps) => {
  const config = card.sliderConfig!;
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
    const hour = value[0];
    if (hour <= 12) return "Impact minimal sur le sommeil";
    if (hour <= 15) return "Impact modéré - peut retarder l'endormissement de 20 min";
    if (hour <= 18) return "Impact significatif - retard de 40 min en moyenne";
    return "Impact majeur - peut réduire le sommeil profond de 20%";
  };

  const getImpactColor = () => {
    const hour = value[0];
    if (hour <= 12) return "text-success";
    if (hour <= 15) return "text-level-intermediate";
    if (hour <= 18) return "text-level-intermediate";
    return "text-destructive";
  };

  return (
    <div className="flex-1 flex flex-col">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
          <span className="text-sm font-medium text-primary">Interactif</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{card.title}</h2>
        <p className="text-muted-foreground">{card.content}</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-6 shadow-elevated border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <span className="text-5xl font-bold text-foreground">
            {value[0]}
          </span>
          <span className="text-2xl text-muted-foreground">{config.unit}</span>
        </div>

        <div className="mb-8">
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
          className={`text-center p-4 rounded-2xl bg-muted ${getImpactColor()}`}
        >
          <p className="font-medium">{getImpactText()}</p>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-sm text-muted-foreground text-center"
      >
        {config.description}
      </motion.p>
    </div>
  );
};

export default SliderCard;
