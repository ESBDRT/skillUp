import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  index?: number;
  isMiddle?: boolean;
}

const PricingCard = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  highlighted = false,
  ctaText = "Get Started",
  index = 0,
  isMiddle = false
}: PricingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Show as highlighted if it's the middle card OR if it's being hovered
  const showHighlighted = isHovered || (highlighted && !isHovered);
  const isActive = isHovered || (isMiddle && !isHovered);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl p-6 overflow-hidden group transition-all duration-300 h-full flex flex-col ${
        isActive 
          ? 'bg-gradient-to-br from-primary via-primary to-purple-600 text-primary-foreground shadow-glow scale-[1.02] z-10' 
          : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg'
      }`}
    >
      {/* Shine effect for active card */}
      {isActive && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="absolute top-4 right-4">
            <Sparkles className="w-5 h-5 text-primary-foreground/80" />
          </div>
        </>
      )}
      
      {/* Corner decoration */}
      {!isActive && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      )}
      
      {/* Most Popular badge - only show on middle card */}
      {isMiddle && (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full shadow-lg border-2 transition-all duration-300 ${
            isActive 
              ? 'bg-background text-foreground border-background' 
              : 'bg-primary text-primary-foreground border-primary'
          }`}>
            ✨ Most Popular
          </div>
        </div>
      )}
      
      <div className={`relative z-10 flex-1 flex flex-col ${isMiddle ? 'pt-4' : ''}`}>
        <h3 className={`text-xl font-bold mb-2 ${isActive ? '' : 'text-foreground'}`}>
          {name}
        </h3>
        
        <div className="mb-4">
          <span className={`text-5xl font-extrabold tracking-tight ${isActive ? '' : 'text-foreground'}`}>
            {price}
          </span>
          {period && (
            <span className={`text-sm ml-1 ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {period}
            </span>
          )}
        </div>
        
        <p className={`text-sm mb-6 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {description}
        </p>
        
        <ul className="space-y-3 mb-6 flex-1">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className={`rounded-full p-0.5 ${isActive ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
                <Check className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>
              <span 
                className={`text-sm ${isActive ? 'text-primary-foreground/90' : 'text-foreground'}`}
                dangerouslySetInnerHTML={{ 
                  __html: feature.replace(/\*\*(.*?)\*\*/g, `<strong class="${isActive ? 'font-bold text-primary-foreground' : 'font-bold text-primary'}">$1</strong>`) 
                }}
              />
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full font-semibold mt-auto ${isActive ? 'bg-background text-primary hover:bg-background/90 shadow-lg' : ''}`}
          variant={isActive ? 'secondary' : 'default'}
          size="lg"
        >
          {ctaText}
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingCard;