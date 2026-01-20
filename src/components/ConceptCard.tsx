import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, AlertTriangle, CheckCircle, AlertCircle, BookOpen, ChevronDown } from 'lucide-react';
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
  courseName?: string;
  onDelete?: (id: string) => void;
  onReview?: (id: string) => void;
  compact?: boolean;
}

const ConceptCard = ({
  id,
  title,
  content,
  memoryStrength,
  lastReviewed,
  nextReview,
  courseName,
  onDelete,
  onReview,
  compact = false,
}: ConceptCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = () => {
    if (memoryStrength >= 70) return 'bg-success';
    if (memoryStrength >= 40) return 'bg-xp';
    return 'bg-destructive';
  };

  const getStatusIcon = () => {
    if (memoryStrength >= 70) return <CheckCircle className="w-4 h-4 text-success" aria-hidden="true" />;
    if (memoryStrength >= 40) return <AlertCircle className="w-4 h-4 text-xp" aria-hidden="true" />;
    return <AlertTriangle className="w-4 h-4 text-destructive" aria-hidden="true" />;
  };

  const getStatusText = () => {
    if (memoryStrength >= 70) return 'Solide';
    if (memoryStrength >= 40) return 'À revoir';
    return 'En danger';
  };

  const isOverdue = new Date(nextReview) <= new Date();

  const getNextReviewText = () => {
    if (isOverdue) return 'Maintenant';
    return formatDistanceToNow(new Date(nextReview), { addSuffix: false, locale: fr });
  };

  // Compact mode - single line expandable
  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Compact header - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors min-h-[56px]"
          aria-expanded={isExpanded}
          aria-controls={`concept-details-${id}`}
          aria-label={`${title}, ${getStatusText()}, prochaine révision ${getNextReviewText()}`}
        >
          {/* Status indicator dot */}
          <div className={`w-3 h-3 rounded-full shrink-0 ${getStatusColor()}`} aria-hidden="true" />
          
          {/* Title */}
          <span className="flex-1 font-medium text-foreground truncate text-sm">
            {title}
          </span>

          {/* Next review badge */}
          <span className={`text-xs shrink-0 px-2 py-1 rounded-full ${
            isOverdue 
              ? 'bg-destructive/20 text-destructive font-medium' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {getNextReviewText()}
          </span>

          {/* Expand icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          </motion.div>
        </button>

        {/* Expandable details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`concept-details-${id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
                {/* Course name */}
                {courseName && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                    <span>{courseName}</span>
                  </div>
                )}

                {/* Content */}
                {content && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{content}</p>
                )}

                {/* Memory strength bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Force de mémoire</span>
                    <span>{memoryStrength}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={memoryStrength} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className={`h-full ${getStatusColor()} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${memoryStrength}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Last reviewed */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {lastReviewed ? (
                    <span>Revu {formatDistanceToNow(new Date(lastReviewed), { addSuffix: true, locale: fr })}</span>
                  ) : (
                    <span>Jamais revu</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {isOverdue && onReview && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReview(id);
                      }}
                      aria-label={`Réviser ${title} maintenant`}
                    >
                      Réviser
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                      }}
                      aria-label={`Supprimer ${title}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Full mode - original design (for grouped view)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-card border border-border rounded-xl p-4 space-y-3"
      role="article"
      aria-label={`Concept: ${title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Course name badge */}
          {courseName && (
            <div className="flex items-center gap-1 mb-2">
              <BookOpen className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs text-muted-foreground truncate">{courseName}</span>
            </div>
          )}
          
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
          <h3 className="font-semibold text-foreground line-clamp-2 hyphens-auto">{title}</h3>
          {content && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{content}</p>
          )}
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive min-w-[44px] min-h-[44px]"
            onClick={() => onDelete(id)}
            aria-label={`Supprimer ${title}`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Memory strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Force de mémoire</span>
          <span>{memoryStrength}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={memoryStrength} aria-valuemin={0} aria-valuemax={100}>
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
          <Clock className="w-3 h-3" aria-hidden="true" />
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
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px]"
          onClick={() => onReview(id)}
          aria-label={`Réviser ${title} maintenant`}
        >
          Réviser maintenant
        </Button>
      )}
    </motion.div>
  );
};

export default ConceptCard;
