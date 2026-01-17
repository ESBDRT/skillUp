import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Flame, TrendingUp, BookOpen, Brain, Clock, 
  Calendar, Award, ChevronRight, Settings, LogOut,
  Trophy, Target
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { badges, isUnlocked } from '@/data/badges';
import BottomNav from '@/components/BottomNav';
import BadgeCard from '@/components/BadgeCard';
import LearningHistory from '@/components/LearningHistory';
import StatCard from '@/components/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [conceptsCount, setConceptsCount] = useState(0);
  const [coursesCompleted, setCoursesCompleted] = useState(0);
  const [coursesCreated, setCoursesCreated] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== 'undefined' 
    ? localStorage.getItem('odemon_user_id') || 'anonymous'
    : 'anonymous';

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  const fetchStats = async () => {
    try {
      // Get concepts count
      const { count: concepts } = await supabase
        .from('memory_concepts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      setConceptsCount(concepts || 0);

      // Get completed courses count
      const { count: completed } = await supabase
        .from('course_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true);

      setCoursesCompleted(completed || 0);

      // Get created courses count
      const { count: created } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      setCoursesCreated(created || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      // Fetch course progress for history
      const { data: progressData } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (progressData) {
        const historyItems = progressData.map(p => {
          const courseData = p.course_data as any;
          return {
            id: p.id,
            type: p.is_completed ? 'course_completed' : 'course_started' as const,
            title: courseData?.title || 'Cours',
            xp: p.earned_xp,
            timestamp: new Date(p.updated_at),
            icon: courseData?.icon || '📚',
          };
        });
        setHistory(historyItems);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    xp: user.xp,
    streak: user.streak,
    coursesCompleted,
    conceptsLearned: conceptsCount,
    coursesCreated,
  };

  const unlockedBadges = badges.filter(b => isUnlocked(b, stats));
  const lockedBadges = badges.filter(b => !isUnlocked(b, stats));

  // Calculate total learning time (mock for now)
  const totalMinutes = Math.floor(user.xp / 10); // Rough estimate based on XP

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background" />
        
        <div className="relative px-4 pt-8 pb-6 safe-top">
          {/* Settings button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 right-4 p-2 bg-card/50 backdrop-blur rounded-full"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Profile avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl shadow-lg">
                🧠
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                <span className="text-xs font-bold text-primary-foreground">{user.level}</span>
              </div>
            </div>

            <h1 className="text-xl font-bold text-foreground mt-4">Apprenant</h1>
            <p className="text-sm text-muted-foreground">Niveau {user.level} • {user.xp.toLocaleString()} XP</p>

            {/* Quick stats row */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-xp/10 rounded-full">
                <Zap className="w-4 h-4 text-xp fill-xp" />
                <span className="text-sm font-semibold text-foreground">{user.xp.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-streak/10 rounded-full">
                <Flame className="w-4 h-4 text-streak fill-streak" />
                <span className="text-sm font-semibold text-foreground">{user.streak}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-full">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{unlockedBadges.length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="px-4">
        {/* Stats grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <StatCard
            icon={Zap}
            label="XP Total"
            value={user.xp.toLocaleString()}
            color="text-xp"
            bgColor="bg-xp/10"
            index={0}
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={`${user.streak} jours`}
            color="text-streak"
            bgColor="bg-streak/10"
            index={1}
          />
          <StatCard
            icon={BookOpen}
            label="Cours terminés"
            value={coursesCompleted}
            color="text-success"
            bgColor="bg-success/10"
            index={2}
          />
          <StatCard
            icon={Brain}
            label="Concepts appris"
            value={conceptsCount}
            color="text-primary"
            bgColor="bg-primary/10"
            index={3}
          />
          <StatCard
            icon={Clock}
            label="Temps d'étude"
            value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
            color="text-muted-foreground"
            bgColor="bg-muted"
            index={4}
          />
          <StatCard
            icon={Target}
            label="Objectif quotidien"
            value={`${user.dailyGoalMinutes} min`}
            subValue={`${user.todayMinutes} min aujourd'hui`}
            color="text-primary"
            bgColor="bg-primary/10"
            index={5}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="mt-0">
            {/* Unlocked badges */}
            {unlockedBadges.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-foreground">
                    Débloqués ({unlockedBadges.length})
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {unlockedBadges.map((badge, i) => (
                    <BadgeCard 
                      key={badge.id} 
                      badge={badge} 
                      stats={stats} 
                      index={i} 
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Locked badges */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-foreground">
                  À débloquer ({lockedBadges.length})
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {lockedBadges.map((badge, i) => (
                  <BadgeCard 
                    key={badge.id} 
                    badge={badge} 
                    stats={stats} 
                    index={i} 
                  />
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <LearningHistory history={history} />
          </TabsContent>
        </Tabs>

        {/* Quick actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-2"
        >
          <button
            onClick={() => navigate('/brain')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-foreground">Mon Cerveau</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/create')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-foreground">Créer un cours</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
