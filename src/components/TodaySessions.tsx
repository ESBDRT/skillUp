import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Zap, BookOpen } from 'lucide-react';
import { CourseSession } from '@/hooks/useCourseSessions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodaySessionsProps {
  sessions: CourseSession[];
  isLoading?: boolean;
}

export function TodaySessions({ sessions, isLoading }: TodaySessionsProps) {
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-40 bg-muted rounded animate-pulse" />
        <div className="h-24 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  const pendingSessions = sessions.filter(s => !s.is_completed);
  const completedSessions = sessions.filter(s => s.is_completed);

  if (sessions.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-5 border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-muted rounded-xl">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Sessions du jour</h3>
            <p className="text-sm text-muted-foreground">Aucune session prévue</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Créez un nouveau cours pour commencer à apprendre !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Sessions du jour
        </h3>
        <span className="text-sm text-muted-foreground">
          {completedSessions.length}/{sessions.length} terminées
        </span>
      </div>

      <div className="space-y-2">
        {pendingSessions.map((session, index) => {
          const cardsCount = session.cards_end_index - session.cards_start_index + 1;
          
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-4 border-2 border-primary/20 shadow-card"
            >
              <div className="flex items-center gap-3">
                {/* Course Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                  {session.course?.icon || '📚'}
                </div>

                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {session.course?.title || 'Cours'}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Jour {session.session_number}/{session.course?.duration_days || '?'}</span>
                    <span>•</span>
                    <span>{cardsCount} cartes</span>
                  </div>
                </div>

                {/* Start Button */}
                <Button 
                  size="sm"
                  onClick={() => handleStartSession(session)}
                  className="gap-1.5"
                >
                  <Play className="w-4 h-4" />
                  Go
                </Button>
              </div>
            </motion.div>
          );
        })}

        {/* Completed sessions summary */}
        {completedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-success/10 rounded-xl p-3 flex items-center gap-3"
          >
            <Zap className="w-5 h-5 text-success" />
            <span className="text-sm text-success font-medium">
              {completedSessions.length} session{completedSessions.length > 1 ? 's' : ''} terminée{completedSessions.length > 1 ? 's' : ''} aujourd'hui !
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
