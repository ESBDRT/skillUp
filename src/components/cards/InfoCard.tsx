import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/data/mockData';
import { ImageOff } from 'lucide-react';

interface InfoCardProps {
  card: Card;
  slideNumber?: number;
  totalSlides?: number;
}

const InfoCard = ({ card, slideNumber, totalSlides }: InfoCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Support both 'image' and 'image_url' properties
  const imageUrl = card.image || (card as any).image_url;
  
  // Get slide info from card if not passed as props
  const currentSlide = slideNumber || (card as any).slideNumber;
  const slides = totalSlides || (card as any).totalSlides;
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Slide indicator */}
      {currentSlide && slides && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            Slide {currentSlide} / {slides}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: slides }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i + 1 === currentSlide 
                    ? 'bg-primary' 
                    : i + 1 < currentSlide 
                      ? 'bg-primary/40' 
                      : 'bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Image or placeholder */}
      {imageUrl && !imageError ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-elevated"
        >
          <img
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center"
        >
          {imageError ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageOff className="w-8 h-8" />
              <span className="text-xs">Image non disponible</span>
            </div>
          ) : (
            <span className="text-6xl">{(card as any).icon || '📚'}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">{card.title}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{card.content}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-auto pt-6 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Tapez à droite pour continuer →
        </p>
      </motion.div>
    </div>
  );
};

export default InfoCard;
