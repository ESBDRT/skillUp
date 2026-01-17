import { motion } from 'framer-motion';
import { Clock, Sparkles, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExploreCourseCardProps {
  id: string;
  title: string;
  description?: string;
  icon: string;
  level: string;
  category: string;
  estimatedMinutes: number;
  totalXp: number;
  onClick?: () => void;
}

const ExploreCourseCard = ({
  title,
  description,
  icon,
  level,
  category,
  estimatedMinutes,
  totalXp,
  onClick,
}: ExploreCourseCardProps) => {
  const getLevelColor = () => {
    switch (level) {
      case 'débutant':
        return 'bg-level-beginner/20 text-level-beginner border-level-beginner/30';
      case 'intermédiaire':
        return 'bg-level-intermediate/20 text-level-intermediate border-level-intermediate/30';
      case 'avancé':
        return 'bg-level-advanced/20 text-level-advanced border-level-advanced/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200"
    >
      {/* Icon and Level */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{icon}</div>
        <Badge variant="outline" className={`text-xs ${getLevelColor()}`}>
          {level}
        </Badge>
      </div>

      {/* Title and Description */}
      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
      )}

      {/* Category */}
      <div className="flex items-center gap-1 mb-3">
        <BookOpen className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{category}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{estimatedMinutes} min</span>
        </div>
        <div className="flex items-center gap-1 text-xp">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">+{totalXp} XP</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExploreCourseCard;
