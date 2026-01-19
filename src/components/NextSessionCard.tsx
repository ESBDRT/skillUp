import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen } from 'lucide-react';
import { CourseSession } from '@/hooks/useCourseSessions';
import { Button } from '@/components/ui/button';

interface NextSessionCardProps {
  session: CourseSession | null;
  isLoading?: boolean;
}

export function NextSessionCard({ session, isLoading }: NextSessionCardProps) {
  const navigate = useNavigate();

  const handleStartSession = () => {
    if (!session?.course) return;
    
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
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-5 border border-primary/30 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-5 w-36 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
        </div>
        <div className="h-11 w-full bg-muted rounded-xl mt-4" />
      </div>
    );
  }

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 rounded-3xl p-5 border border-border"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Aucune session
            </p>
            <h3 className="font-bold text-lg text-foreground">
              Crée ton premier cours
            </h3>
            <p className="text-sm text-muted-foreground">
              Commence ton parcours d'apprentissage
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          size="lg"
          onClick={() => navigate('/create')}
        >
          Créer un cours
        </Button>
      </motion.div>
    );
  }

  const cardsCount = session.cards_end_index - session.cards_start_index + 1;
  const estimatedMinutes = Math.ceil(cardsCount * 1.5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/10 rounded-3xl p-5 border border-primary/30 shadow-lg"
    >
      {/* Decorative background element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      
      <div className="relative flex items-center gap-4">
        {/* Course Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-14 h-14 rounded-2xl bg-card/80 backdrop-blur flex items-center justify-center text-3xl shadow-md"
        >
          {session.course?.icon || '📚'}
        </motion.div>

        {/* Session Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary font-medium uppercase tracking-wide">
            Prochaine session
          </p>
          <h3 className="font-bold text-lg text-foreground truncate">
            {session.course?.title || 'Cours'}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Jour {session.session_number}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{estimatedMinutes} min
            </span>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <Button
        className="w-full mt-4 gap-2 text-base h-12"
        size="lg"
        onClick={handleStartSession}
      >
        <Play className="w-5 h-5" />
        Commencer maintenant
      </Button>

      {/* Cards count badge */}
      <div className="absolute top-4 right-4 px-2.5 py-1 bg-card/80 backdrop-blur rounded-full text-xs font-medium text-foreground">
        {cardsCount} cartes
      </div>
    </motion.div>
  );
}
