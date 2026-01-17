import { motion } from 'framer-motion';
import { Clock, Trash2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface ConceptCardProps {
  id: string;
  title: string;
  content?: string | null;
  memoryStrength: number;
  lastReviewed: string | null;
  nextReview: string;
  onDelete?: (id: string) => void;
  onReview?: (id: string) => void;
}

const ConceptCard = ({
  id,
  title,
  content,
  memoryStrength,
  lastReviewed,
  nextReview,
  onDelete,
  onReview,
}: ConceptCardProps) => {
  const getStatusColor = () => {
    if (memoryStrength >= 70) return 'bg-success';
    if (memoryStrength >= 40) return 'bg-xp';
    return 'bg-destructive';
  };

  const getStatusIcon = () => {
    if (memoryStrength >= 70) return <CheckCircle className="w-4 h-4 text-success" />;
    if (memoryStrength >= 40) return <AlertCircle className="w-4 h-4 text-xp" />;
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  };

  const getStatusText = () => {
    if (memoryStrength >= 70) return 'Solide';
    if (memoryStrength >= 40) return 'À revoir';
    return 'En danger';
  };

  const isOverdue = new Date(nextReview) <= new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-card border border-border rounded-xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon()}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              memoryStrength >= 70 ? 'bg-success/20 text-success' :
              memoryStrength >= 40 ? 'bg-xp/20 text-xp' :
              'bg-destructive/20 text-destructive'
            }`}>
              {getStatusText()}
            </span>
          </div>
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          {content && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{content}</p>
          )}
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Memory strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Force de mémoire</span>
          <span>{memoryStrength}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getStatusColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${memoryStrength}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Review info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {lastReviewed ? (
            <span>Revu {formatDistanceToNow(new Date(lastReviewed), { addSuffix: true, locale: fr })}</span>
          ) : (
            <span>Jamais revu</span>
          )}
        </div>
        
        {isOverdue ? (
          <span className="text-destructive font-medium">Révision requise</span>
        ) : (
          <span>Prochaine: {formatDistanceToNow(new Date(nextReview), { addSuffix: true, locale: fr })}</span>
        )}
      </div>

      {/* Review button for overdue concepts */}
      {isOverdue && onReview && (
        <Button
          variant="outline"
          size="sm"
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => onReview(id)}
        >
          Réviser maintenant
        </Button>
      )}
    </motion.div>
  );
};

export default ConceptCard;
