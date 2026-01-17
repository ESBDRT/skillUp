import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Flame, Target, Plus, Brain, Settings, TrendingUp } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { mockLessons, categories } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import KnowledgeTree from '@/components/KnowledgeTree';
import BottomNav from '@/components/BottomNav';
import { SavedCourses } from '@/components/SavedCourses';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const dailyProgress = Math.min((user.todayMinutes / user.dailyGoalMinutes) * 100, 100);
  const isOnTrack = user.todayMinutes >= user.dailyGoalMinutes * 0.5;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* XP Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-xp/10 rounded-full"
            >
              <Zap className="w-5 h-5 text-xp fill-xp" />
              <span className="font-bold text-foreground">{user.xp.toLocaleString()}</span>
            </motion.div>

            {/* Streak Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 px-3 py-2 bg-streak/10 rounded-full"
            >
              <Flame className="w-5 h-5 text-streak fill-streak animate-streak-fire" />
              <span className="font-bold text-foreground">{user.streak}</span>
            </motion.div>

            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full"
            >
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Niv. {user.level}</span>
            </motion.div>

            {/* Settings */}
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6">
        {/* Daily Goal Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-5 shadow-card border border-border mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isOnTrack ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <Target className={`w-5 h-5 ${isOnTrack ? 'text-success' : 'text-destructive'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Objectif du jour</h3>
                <p className="text-sm text-muted-foreground">
                  {user.todayMinutes}/{user.dailyGoalMinutes} min
                </p>
              </div>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              isOnTrack 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {isOnTrack ? 'En bonne voie' : 'En retard'}
            </span>
          </div>
          <Progress value={dailyProgress} className="h-3 rounded-full" />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-card border border-border hover:border-primary transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-xl">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-foreground">Créer un cours</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-card border border-border hover:border-primary transition-colors">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-foreground">Mon Cerveau</span>
          </button>
        </motion.div>

        {/* Saved Courses */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <SavedCourses />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Catégories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((category, i) => (
              <motion.button
                key={category.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card border border-border hover:border-primary transition-colors min-w-[90px]"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs font-medium text-foreground">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Knowledge Tree */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Arbre de connaissances</h2>
          <KnowledgeTree lessons={mockLessons} />
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
