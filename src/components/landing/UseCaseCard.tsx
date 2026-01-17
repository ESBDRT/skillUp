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
}

export const UseCaseCard = ({ icon, title, tagline, description, examples, index }: UseCaseCardProps) => {
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
