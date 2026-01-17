import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, Play, ChevronRight } from 'lucide-react';
import { CourseSession } from '@/hooks/useCourseSessions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SessionPlannerProps {
  sessions: CourseSession[];
  courseTitle?: string;
  showHeader?: boolean;
}

export function SessionPlanner({ sessions, courseTitle, showHeader = true }: SessionPlannerProps) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const getSessionStatus = (session: CourseSession) => {
    if (session.is_completed) return 'completed';
    if (session.scheduled_date === today) return 'today';
    if (session.scheduled_date < today) return 'missed';
    return 'upcoming';
  };

  const statusConfig = {
    completed: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      text: 'text-success',
      icon: CheckCircle2,
      label: 'Terminée'
    },
    today: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      text: 'text-primary',
      icon: Play,
      label: "Aujourd'hui"
    },
    missed: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      text: 'text-destructive',
      icon: Clock,
      label: 'Manquée'
    },
    upcoming: {
      bg: 'bg-muted/50',
      border: 'border-border',
      text: 'text-muted-foreground',
      icon: Calendar,
      label: 'À venir'
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleStartSession = (session: CourseSession) => {
    if (!session.course) return;
    
    navigate(`/course/${session.course_id}`, {
      state: {
        sessionId: session.id,
        sessionNumber: session.session_number,
        cardsStartIndex: session.cards_start_index,
        cardsEndIndex: session.cards_end_index
      }
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Aucune session programmée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {courseTitle ? `Planning - ${courseTitle}` : 'Planning des sessions'}
          </h3>
        </div>
      )}

      <div className="space-y-2">
        {sessions.map((session, index) => {
          const status = getSessionStatus(session);
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const cardsCount = session.cards_end_index - session.cards_start_index + 1;

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                config.bg,
                config.border,
                status === 'today' && "ring-2 ring-primary/20"
              )}
            >
              {/* Session Number */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                status === 'completed' ? 'bg-success text-success-foreground' :
                status === 'today' ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              )}>
                {session.session_number}
              </div>

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    Jour {session.session_number}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", config.bg, config.text)}>
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{formatDate(session.scheduled_date)}</span>
                  <span>•</span>
                  <span>{cardsCount} cartes</span>
                  {session.earned_xp > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-xp">+{session.earned_xp} XP</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {status === 'today' && !session.is_completed && (
                <Button 
                  size="sm" 
                  onClick={() => handleStartSession(session)}
                  className="gap-1"
                >
                  <Play className="w-4 h-4" />
                  Commencer
                </Button>
              )}
              {status === 'missed' && !session.is_completed && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStartSession(session)}
                  className="gap-1"
                >
                  Rattraper
                </Button>
              )}
              {status === 'completed' && (
                <StatusIcon className={cn("w-5 h-5", config.text)} />
              )}
              {status === 'upcoming' && (
                <StatusIcon className={cn("w-5 h-5", config.text)} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
