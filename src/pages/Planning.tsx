import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionPlanner } from '@/components/SessionPlanner';
import { useCourseSessions } from '@/hooks/useCourseSessions';
import { useUserProgress } from '@/hooks/useUserProgress';
import BottomNav from '@/components/BottomNav';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'calendar';

export default function Planning() {
  const { sessions, isLoading } = useCourseSessions();
  const { profile } = useUserProgress();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);

  const getWeekDates = (offset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + offset * 7); // Monday

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedWeekOffset);
  const today = new Date().toISOString().split('T')[0];

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(s => s.scheduled_date === dateStr);
  };

  const formatWeekHeader = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const monthStart = start.toLocaleDateString('fr-FR', { month: 'short' });
    const monthEnd = end.toLocaleDateString('fr-FR', { month: 'short' });
    
    if (monthStart === monthEnd) {
      return `${start.getDate()} - ${end.getDate()} ${monthStart}`;
    }
    return `${start.getDate()} ${monthStart} - ${end.getDate()} ${monthEnd}`;
  };

  // Stats
  const completedSessions = sessions.filter(s => s.is_completed).length;
  const totalSessions = sessions.length;
  const upcomingSessions = sessions.filter(s => !s.is_completed && s.scheduled_date >= today).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mon Planning</h1>
                <p className="text-sm text-muted-foreground">
                  {upcomingSessions} session{upcomingSessions !== 1 ? 's' : ''} à venir
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Liste
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                Calendrier
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{completedSessions}</p>
            <p className="text-xs text-muted-foreground">Terminées</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-primary">{upcomingSessions}</p>
            <p className="text-xs text-muted-foreground">À venir</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-streak">{profile?.streak_count || 0}</p>
            <p className="text-xs text-muted-foreground">Streak 🔥</p>
          </div>
        </motion.div>

        {viewMode === 'calendar' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedWeekOffset(prev => prev - 1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="font-semibold text-foreground">{formatWeekHeader()}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedWeekOffset(prev => prev + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground py-1">
                  {day}
                </div>
              ))}
              {weekDates.map((date, i) => {
                const dateStr = date.toISOString().split('T')[0];
                const daySessions = getSessionsForDate(date);
                const isToday = dateStr === today;
                const hasCompleted = daySessions.some(s => s.is_completed);
                const hasPending = daySessions.some(s => !s.is_completed);
                
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center gap-1 text-sm transition-all",
                      isToday && "ring-2 ring-primary",
                      hasCompleted && !hasPending && "bg-success/20",
                      hasPending && "bg-primary/10"
                    )}
                  >
                    <span className={cn(
                      "font-medium",
                      isToday && "text-primary"
                    )}>
                      {date.getDate()}
                    </span>
                    {daySessions.length > 0 && (
                      <div className="flex gap-0.5">
                        {daySessions.map((session, j) => (
                          <div
                            key={j}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              session.is_completed ? "bg-success" : "bg-primary"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Sessions List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <SessionPlanner sessions={sessions} showHeader={viewMode !== 'calendar'} />
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
