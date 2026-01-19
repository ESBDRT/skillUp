import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Flame, Target, Plus, Brain, Settings, TrendingUp } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { CourseList } from '@/components/CourseList';
import { TodaySessions } from '@/components/TodaySessions';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useCourseSessions } from '@/hooks/useCourseSessions';
import { DailyGoalWidget } from '@/components/DailyGoalWidget';
import { MotivationWidget } from '@/components/MotivationWidget';
import { NextSessionCard } from '@/components/NextSessionCard';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    profile,
    isLoading: isLoadingProfile,
    checkAndUpdateStreak
  } = useUserProgress();
  const {
    todaySessions,
    isLoading: isLoadingSessions
  } = useCourseSessions();

  // Check streak on mount
  React.useEffect(() => {
    if (profile) {
      checkAndUpdateStreak();
    }
  }, [profile?.id]);

  // Get greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour !';
    if (hour < 18) return 'Bon après-midi !';
    return 'Bonsoir !';
  }, []);

  const dailyGoalMinutes = profile?.daily_goal_minutes || 15;
  const todayMinutes = todaySessions.filter(s => s.is_completed).length * 5;
  
  // Get next pending session
  const nextSession = useMemo(() => {
    return todaySessions.find(s => !s.is_completed) || null;
  }, [todaySessions]);

  // Get remaining sessions (excluding the first one shown in NextSessionCard)
  const remainingSessions = useMemo(() => {
    const pending = todaySessions.filter(s => !s.is_completed);
    return pending.length > 1 ? pending.slice(1) : [];
  }, [todaySessions]);

  const completedSessionsCount = todaySessions.filter(s => s.is_completed).length;

  const isLoading = isLoadingProfile || isLoadingSessions;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <DashboardSkeleton />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header - Redesigned for mobile */}
      <header className="sticky top-0 z-50 glass border-b border-border safe-top">
        <div className="px-4 py-4">
          {/* Row 1: Greeting + Settings */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">{greeting}</p>
              <h1 className="text-lg font-bold text-foreground">Prêt à apprendre ?</h1>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Row 2: Stats badges - horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {/* XP Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-xp/10 rounded-full flex-shrink-0"
            >
              <Zap className="w-4 h-4 text-xp fill-xp" />
              <span className="font-bold text-sm text-foreground">
                {(profile?.xp || 0).toLocaleString()} XP
              </span>
            </motion.div>

            {/* Streak Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-2 px-3 py-2 bg-streak/10 rounded-full flex-shrink-0"
            >
              <Flame className="w-4 h-4 text-streak fill-streak animate-streak-fire" />
              <span className="font-bold text-sm text-foreground">
                {profile?.streak_count || 0} jours
              </span>
            </motion.div>

            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full flex-shrink-0"
            >
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm text-foreground">
                Niveau {profile?.level || 1}
              </span>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-5">
        {/* Next Session - Priority widget */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <NextSessionCard session={nextSession} isLoading={isLoadingSessions} />
        </motion.div>

        {/* Daily Goal Widget - Compact with circular progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <DailyGoalWidget
            currentMinutes={todayMinutes}
            goalMinutes={dailyGoalMinutes}
            isLoading={isLoadingProfile}
          />
        </motion.div>

        {/* Quick Actions - Enhanced cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20 text-left group"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Plus className="w-20 h-20 text-primary" />
            </div>
            <div className="relative">
              <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-2">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Créer</p>
              <p className="text-xs text-muted-foreground">Nouveau cours</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/brain')}
            className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-4 border border-purple-500/20 text-left group"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain className="w-20 h-20 text-purple-500" />
            </div>
            <div className="relative">
              <div className="p-2.5 bg-purple-500/10 rounded-xl w-fit mb-2">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <p className="font-semibold text-foreground">Cerveau</p>
              <p className="text-xs text-muted-foreground">Ma mémoire</p>
            </div>
          </motion.button>
        </motion.div>

        {/* Motivation Widget */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <MotivationWidget />
        </motion.div>

        {/* Remaining Today's Sessions (if any) */}
        {(remainingSessions.length > 0 || completedSessionsCount > 0) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TodaySessions 
              sessions={[...remainingSessions, ...todaySessions.filter(s => s.is_completed)]} 
              isLoading={isLoadingSessions} 
            />
          </motion.div>
        )}

        {/* My Created Courses */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <CourseList mode="created" />
        </motion.div>

        {/* Saved Courses (In Progress) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <CourseList mode="in-progress" />
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
