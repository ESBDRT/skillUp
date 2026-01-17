import { motion } from 'framer-motion';
import { Card } from '@/data/mockData';

interface InfoCardProps {
  card: Card;
}

const InfoCard = ({ card }: InfoCardProps) => {
  // Support both 'image' and 'image_url' properties
  const imageUrl = card.image || (card as any).image_url;
  
  return (
    <div className="flex-1 flex flex-col">
      {imageUrl && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-elevated"
        >
          <img
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
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
