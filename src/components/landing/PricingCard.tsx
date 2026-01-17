import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
}

const PricingCard = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  highlighted = false,
  ctaText = "Get Started"
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative rounded-2xl p-6 ${
        highlighted 
          ? 'bg-primary text-primary-foreground ring-2 ring-primary shadow-xl' 
          : 'bg-card border border-border'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      
      <h3 className={`text-xl font-bold mb-2 ${highlighted ? '' : 'text-foreground'}`}>
        {name}
      </h3>
      
      <div className="mb-4">
        <span className={`text-4xl font-extrabold ${highlighted ? '' : 'text-foreground'}`}>
          {price}
        </span>
        {period && (
          <span className={`text-sm ml-1 ${highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {period}
          </span>
        )}
      </div>
      
      <p className={`text-sm mb-6 ${highlighted ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
        {description}
      </p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`w-5 h-5 shrink-0 mt-0.5 ${highlighted ? '' : 'text-primary'}`} />
            <span 
              className={`text-sm ${highlighted ? 'text-primary-foreground/90' : 'text-foreground'}`}
              dangerouslySetInnerHTML={{ 
                __html: feature.replace(/\*\*(.*?)\*\*/g, `<strong class="${highlighted ? 'font-bold' : 'font-bold text-primary'}">$1</strong>`) 
              }}
            />
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${highlighted ? 'bg-background text-foreground hover:bg-background/90' : ''}`}
        variant={highlighted ? 'secondary' : 'default'}
      >
        {ctaText}
      </Button>
    </motion.div>
  );
};

export default PricingCard;
