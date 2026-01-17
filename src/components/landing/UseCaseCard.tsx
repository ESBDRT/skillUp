import { motion } from "framer-motion";
import { GraduationCap, Target, Globe, Users, Shield, Compass, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Target,
  Globe,
  Users,
  Shield,
  Compass,
};

interface UseCaseCardProps {
  icon: string;
  title: string;
  tagline: string;
  description: string;
  examples: string[];
  index: number;
  variant?: 'default' | 'featured' | 'compact';
}

export const UseCaseCard = ({ icon, title, tagline, description, examples, index, variant = 'default' }: UseCaseCardProps) => {
  const Icon = iconMap[icon] || Target;
  
  // Parse title to render **bold** parts
  const renderTitle = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/);
    return parts.map((part, i) => 
      i % 2 === 1 ? (
        <span key={i} className="text-primary font-bold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="relative h-full"
      >
        {/* Decorative accent line */}
        <div className="absolute -left-4 top-8 bottom-8 w-1 bg-gradient-to-b from-primary via-purple-500 to-primary/30 rounded-full" />
        
        <div className="pl-6 h-full flex flex-col">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 flex-1">
            <h3 className="text-2xl font-bold text-foreground">
              {renderTitle(title)}
            </h3>
            
            <p className="text-lg font-medium text-primary/80 italic">
              "{tagline}"
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* Examples */}
            <div className="flex flex-wrap gap-2 pt-4">
              {examples.map((example, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ x: -4 }}
        className="group relative flex gap-4 p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300"
      >
        {/* Icon */}
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">
            {renderTitle(title)}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Examples - fewer shown */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {examples.slice(0, 2).map((example, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-secondary/80 text-secondary-foreground"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant (keep original for backward compatibility)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon */}
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="relative space-y-3">
        <h3 className="text-xl font-semibold text-foreground">
          {renderTitle(title)}
        </h3>
        
        <p className="text-base font-medium text-primary/80 italic">
          "{tagline}"
        </p>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Examples */}
        <div className="flex flex-wrap gap-2 pt-2">
          {examples.map((example, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary/80 text-secondary-foreground border border-border/50"
            >
              {example}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};