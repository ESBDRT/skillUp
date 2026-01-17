import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/data/mockData';
import { ImageOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface InfoCardProps {
  card: Card;
  slideNumber?: number;
  totalSlides?: number;
}

const InfoCard = ({ card, slideNumber, totalSlides }: InfoCardProps) => {
  // Support both 'image' and 'image_url' properties
  const originalImageUrl = card.image || (card as any).image_url;
  const [imageUrl, setImageUrl] = useState<string | null>(originalImageUrl);
  const [imageError, setImageError] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Generate a fallback image if original fails
  const generateFallbackImage = async () => {
    if (isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          keyword: card.title,
          theme: card.content?.substring(0, 100)
        }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        setImageError(false);
      }
    } catch (error) {
      console.error('Error generating fallback image:', error);
      // Keep showing placeholder
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    // Try to generate an AI image as fallback
    generateFallbackImage();
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
    return '📚';
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Slide indicator */}
      {slideNumber && totalSlides && (
        <div className="text-xs text-muted-foreground mb-2 text-center">
          {slideNumber} / {totalSlides}
        </div>
      )}

      {/* Image section - takes up to 40% of height */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full rounded-2xl overflow-hidden mb-4 shadow-elevated bg-gradient-to-br from-primary/5 to-secondary/10"
        style={{ minHeight: '180px', maxHeight: '280px' }}
      >
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
            style={{ minHeight: '180px', maxHeight: '280px' }}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center py-8" style={{ minHeight: '180px' }}>
            {isGeneratingImage ? (
              <>
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                <span className="text-sm text-muted-foreground">Génération de l'image...</span>
              </>
            ) : (
              <>
                <span className="text-6xl mb-2">{getPlaceholderEmoji()}</span>
                <span className="text-sm text-muted-foreground">Image en cours de chargement</span>
              </>
            )}
          </div>
        )}
        
        {/* Gradient overlay */}
        {imageUrl && !imageError && (
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
