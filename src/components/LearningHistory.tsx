import { motion } from 'framer-motion';
import { Calendar, Zap, CheckCircle, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryItem {
  id: string;
  type: 'course_completed' | 'course_started' | 'smart_session' | 'concept_reviewed';
  title: string;
  xp: number;
  timestamp: Date;
  icon?: string;
}

interface LearningHistoryProps {
  history: HistoryItem[];
}

const LearningHistory = ({ history }: LearningHistoryProps) => {
  const getTypeIcon = (type: HistoryItem['type']) => {
    switch (type) {
      case 'course_completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'course_started':
        return <Clock className="w-4 h-4 text-primary" />;
      case 'smart_session':
        return <Zap className="w-4 h-4 text-xp" />;
      case 'concept_reviewed':
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: HistoryItem['type']) => {
    switch (type) {
      case 'course_completed':
        return 'Cours terminé';
      case 'course_started':
        return 'Cours commencé';
      case 'smart_session':
        return 'Smart Session';
      case 'concept_reviewed':
        return 'Révision';
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Aucune activité récente</p>
        <p className="text-sm text-muted-foreground mt-1">
          Commencez à apprendre pour voir votre historique
        </p>
      </div>
    );
  }

  // Group by date
  const groupedHistory = history.reduce((groups, item) => {
    const date = format(item.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedHistory).map(([date, items], groupIndex) => (
        <motion.div
          key={date}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: groupIndex * 0.1 }}
        >
          {/* Date header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground px-2">
              {format(new Date(date), 'EEEE d MMMM', { locale: fr })}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Items for this date */}
          <div className="space-y-2">
            {items.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: groupIndex * 0.1 + itemIndex * 0.05 }}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                  {item.icon || '📚'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-xs text-muted-foreground">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="font-medium text-foreground truncate">
                    {item.title}
                  </p>
                </div>

                {/* XP and time */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xp">
                    <Zap className="w-4 h-4 fill-xp" />
                    <span className="font-bold">+{item.xp}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: fr })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LearningHistory;
