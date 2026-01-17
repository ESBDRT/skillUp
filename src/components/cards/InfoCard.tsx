import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/data/mockData';

interface InfoCardProps {
  card: Card;
  slideNumber?: number;
  totalSlides?: number;
}

const InfoCard = ({ card, slideNumber, totalSlides }: InfoCardProps) => {
  // Support both 'image' and 'image_url' properties
  const originalImageUrl = card.image || (card as any).image_url;
  const [imageError, setImageError] = useState(false);
  
  // Generate a direct image URL based on card title
  const getImageUrl = () => {
    if (originalImageUrl && !imageError) {
      return originalImageUrl;
    }
    // Fallback to placeholder.com with theme color
    const keyword = encodeURIComponent(card.title.substring(0, 20));
    return `https://via.placeholder.com/800x600/6366f1/ffffff?text=${keyword}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get emoji based on card title or content for placeholder
  const getPlaceholderEmoji = () => {
    const title = card.title.toLowerCase();
    if (title.includes('cerveau') || title.includes('brain') || title.includes('neuron')) return '🧠';
    if (title.includes('coeur') || title.includes('heart')) return '❤️';
    if (title.includes('science') || title.includes('chimie')) return '🔬';
    if (title.includes('histoire') || title.includes('history')) return '📜';
    if (title.includes('tech') || title.includes('code') || title.includes('program')) return '💻';
    if (title.includes('art') || title.includes('peinture')) return '🎨';
    if (title.includes('musique') || title.includes('music')) return '🎵';
    if (title.includes('nature') || title.includes('plante')) return '🌿';
    if (title.includes('espace') || title.includes('space')) return '🚀';
    if (title.includes('math') || title.includes('calcul')) return '📐';
    if (title.includes('langue') || title.includes('language')) return '📝';
    if (title.includes('finance') || title.includes('argent')) return '💰';
    if (title.includes('santé') || title.includes('health')) return '🏥';
    if (title.includes('sport') || title.includes('exercice')) return '🏃';
    if (title.includes('cuisine') || title.includes('food')) return '🍳';
    if (title.includes('voiture') || title.includes('car') || title.includes('nos')) return '🚗';
    if (title.includes('moteur') || title.includes('engine')) return '⚙️';
    return '📚';
  };

  const imageUrl = getImageUrl();

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Slide indicator */}
      {slideNumber && totalSlides && (
        <div className="text-xs text-muted-foreground mb-2 text-center">
          {slideNumber} / {totalSlides}
        </div>
      )}

      {/* Image section - compact */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full rounded-2xl overflow-hidden mb-4 shadow-elevated bg-gradient-to-br from-primary/5 to-secondary/10"
        style={{ height: '160px' }}
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20">
            <span className="text-5xl">{getPlaceholderEmoji()}</span>
          </div>
        )}
        
        {/* Gradient overlay */}
        {!imageError && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        )}
      </motion.div>

      {/* Content section - takes remaining space */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 leading-tight">{card.title}</h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line flex-1">
          {card.content}
        </p>
      </motion.div>

      {/* Navigation hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-4 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Tapez à droite pour continuer →
        </p>
      </motion.div>
    </div>
  );
};

export default InfoCard;
