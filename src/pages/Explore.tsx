import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Sparkles, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import ExploreCourseCard from '@/components/ExploreCourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Course {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  level: string;
  category: string;
  estimated_minutes: number;
  total_xp: number;
  created_at: string;
}

const categories = [
  { id: 'all', label: 'Tous', icon: '🌟' },
  { id: 'sciences', label: 'Sciences', icon: '🔬' },
  { id: 'histoire', label: 'Histoire', icon: '📜' },
  { id: 'langues', label: 'Langues', icon: '🌍' },
  { id: 'technologie', label: 'Tech', icon: '💻' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'philosophie', label: 'Philo', icon: '🤔' },
  { id: 'musique', label: 'Musique', icon: '🎵' },
];

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      course.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const trendingCourses = [...courses]
    .sort((a, b) => b.total_xp - a.total_xp)
    .slice(0, 5);

  const newCourses = [...courses]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Explorer</h1>
            <p className="text-sm text-muted-foreground">Découvre de nouveaux savoirs</p>
          </div>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher un cours..."
        />
      </motion.header>

      <div className="px-4 py-6 space-y-6">
        {/* Category Chips */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : searchQuery || selectedCategory !== 'all' ? (
          /* Search/Filter Results */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Résultats ({filteredCourses.length})
            </h2>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <Compass className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Aucun cours trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredCourses.map((course) => (
                  <motion.div key={course.id} variants={itemVariants}>
                    <ExploreCourseCard
                      id={course.id}
                      title={course.title}
                      description={course.description || undefined}
                      icon={course.icon || '📚'}
                      level={course.level}
                      category={course.category}
                      estimatedMinutes={course.estimated_minutes}
                      totalXp={course.total_xp}
                      onClick={() => handleCourseClick(course.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* Default View with Sections */
          <>
            {/* Trending Section */}
            {trendingCourses.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-xp" />
                  Tendances
                </h2>
                <ScrollArea className="w-full">
                  <div className="flex gap-3 pb-2">
                    {trendingCourses.map((course) => (
                      <div key={course.id} className="w-[200px] shrink-0">
                        <ExploreCourseCard
                          id={course.id}
                          title={course.title}
                          description={course.description || undefined}
                          icon={course.icon || '📚'}
                          level={course.level}
                          category={course.category}
                          estimatedMinutes={course.estimated_minutes}
                          totalXp={course.total_xp}
                          onClick={() => handleCourseClick(course.id)}
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </motion.section>
            )}

            {/* New Courses Section */}
            {newCourses.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Nouveautés
                </h2>
                <ScrollArea className="w-full">
                  <div className="flex gap-3 pb-2">
                    {newCourses.map((course) => (
                      <div key={course.id} className="w-[200px] shrink-0">
                        <ExploreCourseCard
                          id={course.id}
                          title={course.title}
                          description={course.description || undefined}
                          icon={course.icon || '📚'}
                          level={course.level}
                          category={course.category}
                          estimatedMinutes={course.estimated_minutes}
                          totalXp={course.total_xp}
                          onClick={() => handleCourseClick(course.id)}
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </motion.section>
            )}

            {/* All Courses Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-success" />
                Tous les cours
              </h2>
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <Compass className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Aucun cours publié pour l'instant.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Crée ton premier cours depuis le studio !
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <ExploreCourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description || undefined}
                      icon={course.icon || '📚'}
                      level={course.level}
                      category={course.category}
                      estimatedMinutes={course.estimated_minutes}
                      totalXp={course.total_xp}
                      onClick={() => handleCourseClick(course.id)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Explore;
