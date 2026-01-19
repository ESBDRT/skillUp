import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain as BrainIcon, Zap, RefreshCw, Trash2, Filter, ChevronDown, ChevronUp, BookOpen, Network, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import MemoryHealthGauge from '@/components/MemoryHealthGauge';
import MemoryStats from '@/components/MemoryStats';
import ConceptCard from '@/components/ConceptCard';
import ConceptSearch, { SortOption } from '@/components/ConceptSearch';
import ReviewStreak from '@/components/ReviewStreak';
import TargetedSessionModal from '@/components/TargetedSessionModal';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { useMemoryConcepts, MemoryConcept } from '@/hooks/useMemoryConcepts';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FilterType = 'all' | 'danger' | 'warning' | 'solid';

const Brain = () => {
  const navigate = useNavigate();
  const {
    concepts,
    loading,
    getAverageMemoryStrength,
    getAtRiskConcepts,
    getConceptsForReview,
    getConceptsByCourse,
    getWeeklyStats,
    deleteConcept,
    refetch,
  } = useMemoryConcepts();
  
  const { profile } = useUserProgress();

  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [weeklyStats, setWeeklyStats] = useState({ totalReviews: 0, correctReviews: 0 });
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');
  const [mainView, setMainView] = useState<'list' | 'graph'>('list');
  
  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('next-review');

  const averageStrength = getAverageMemoryStrength();
  const atRiskCount = getAtRiskConcepts().length;
  const reviewCount = getConceptsForReview().length;
  const conceptsByCourse = getConceptsByCourse();

  // Fetch weekly stats
  useEffect(() => {
    if (!loading) {
      getWeeklyStats().then(setWeeklyStats);
    }
  }, [loading, getWeeklyStats]);

  // Auto-expand courses with at-risk concepts
  useEffect(() => {
    const coursesWithRisk = new Set<string>();
    concepts.forEach(c => {
      if (c.memory_strength < 50) {
        coursesWithRisk.add(c.course_id);
      }
    });
    setExpandedCourses(coursesWithRisk);
  }, [concepts]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  // Filter, search, and sort concepts
  const processedConcepts = useMemo(() => {
    let result = [...concepts];

    // Apply filter
    result = result.filter((concept) => {
      switch (filter) {
        case 'danger':
          return concept.memory_strength < 40;
        case 'warning':
          return concept.memory_strength >= 40 && concept.memory_strength < 70;
        case 'solid':
          return concept.memory_strength >= 70;
        default:
          return true;
      }
    });

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.concept_title.toLowerCase().includes(query) ||
        c.concept_content?.toLowerCase().includes(query) ||
        c.course_title?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'strength-asc':
          return a.memory_strength - b.memory_strength;
        case 'strength-desc':
          return b.memory_strength - a.memory_strength;
        case 'next-review':
          return new Date(a.next_review_at).getTime() - new Date(b.next_review_at).getTime();
        case 'name':
          return a.concept_title.localeCompare(b.concept_title);
        default:
          return 0;
      }
    });

    return result;
  }, [concepts, filter, searchQuery, sortBy]);

  const filterConceptsInCourse = (courseConcepts: MemoryConcept[]) => {
    let result = courseConcepts.filter((concept) => {
      switch (filter) {
        case 'danger':
          return concept.memory_strength < 40;
        case 'warning':
          return concept.memory_strength >= 40 && concept.memory_strength < 70;
        case 'solid':
          return concept.memory_strength >= 70;
        default:
          return true;
      }
    });

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.concept_title.toLowerCase().includes(query) ||
        c.concept_content?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'strength-asc':
          return a.memory_strength - b.memory_strength;
        case 'strength-desc':
          return b.memory_strength - a.memory_strength;
        case 'next-review':
          return new Date(a.next_review_at).getTime() - new Date(b.next_review_at).getTime();
        case 'name':
          return a.concept_title.localeCompare(b.concept_title);
        default:
          return 0;
      }
    });

    return result;
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteConcept(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleStartSmartSession = () => {
    navigate('/smart-session');
  };

  const handleStartTargetedSession = (conceptIds: string[]) => {
    // Store targeted concept IDs in sessionStorage for SmartSession to use
    sessionStorage.setItem('targetedConceptIds', JSON.stringify(conceptIds));
    navigate('/smart-session?targeted=true');
  };

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'Tous', color: 'bg-primary' },
    { key: 'danger', label: 'En danger', color: 'bg-destructive' },
    { key: 'warning', label: 'À revoir', color: 'bg-xp' },
    { key: 'solid', label: 'Solides', color: 'bg-success' },
  ];

  const getCourseStats = (courseConcepts: MemoryConcept[]) => {
    const danger = courseConcepts.filter(c => c.memory_strength < 40).length;
    const warning = courseConcepts.filter(c => c.memory_strength >= 40 && c.memory_strength < 70).length;
    return { danger, warning, total: courseConcepts.length };
  };

  // Calculate today's reviews count
  const todayReviews = weeklyStats.totalReviews; // Simplified - you could filter by today only

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <BrainIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mon Cerveau</h1>
              <p className="text-sm text-muted-foreground">Système de mémorisation</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      <div className="px-4 py-6 space-y-6">
        {/* Streak Widget */}
        {!loading && profile && (
          <ReviewStreak
            streakDays={profile.streak_count}
            lastActivityDate={profile.last_activity_date}
            dailyGoal={profile.daily_goal_minutes}
            todayReviews={todayReviews}
            weeklyStats={weeklyStats}
          />
        )}

        {/* Memory Health Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl"
        >
          {loading ? (
            <div className="p-6 flex flex-col items-center">
              <Skeleton className="w-40 h-40 rounded-full" />
              <Skeleton className="w-32 h-6 mt-4" />
              <Skeleton className="w-24 h-4 mt-2" />
            </div>
          ) : (
            <MemoryHealthGauge
              percentage={averageStrength}
              conceptCount={concepts.length}
            />
          )}
        </motion.div>

        {/* Stats Component */}
        {!loading && concepts.length > 0 && (
          <MemoryStats concepts={concepts} weeklyStats={weeklyStats} />
        )}

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">En danger</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{atRiskCount}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-xp/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-xp" />
              </div>
              <span className="text-sm text-muted-foreground">À réviser</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{reviewCount}</p>
          </div>
        </motion.div>

        {/* Session Buttons */}
        {reviewCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Button
              onClick={handleStartSmartSession}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80"
            >
              <Zap className="w-5 h-5 mr-2" />
              Smart Session ({reviewCount})
            </Button>
            
            <TargetedSessionModal
              concepts={concepts}
              conceptsByCourse={conceptsByCourse}
              onStartSession={handleStartTargetedSession}
            />
          </motion.div>
        )}

        {/* View Toggle Tabs */}
        <Tabs value={mainView} onValueChange={(v) => setMainView(v as 'list' | 'graph')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Graphe
            </TabsTrigger>
          </TabsList>

          {/* Graph View */}
          <TabsContent value="graph" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Filter for graph */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      filter === f.key
                        ? `${f.color} text-white`
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <Skeleton className="h-[400px] rounded-xl" />
              ) : concepts.length === 0 ? (
                <div className="text-center py-12">
                  <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Aucun concept en mémoire. Complète des cours pour voir ton graphe de connaissances !
                  </p>
                </div>
              ) : (
                <KnowledgeGraph
                  concepts={concepts}
                  filter={filter}
                />
              )}
            </motion.div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="mt-0 space-y-4">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <ConceptSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </motion.div>

        {/* Filter Chips + View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === f.key
                      ? `${f.color} text-white`
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(v => v === 'flat' ? 'grouped' : 'flat')}
              className="shrink-0"
            >
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Concepts List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Concepts ({processedConcepts.length})
            {searchQuery && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                pour "{searchQuery}"
              </span>
            )}
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : processedConcepts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {concepts.length === 0
                  ? 'Aucun concept en mémoire. Complète des cours pour commencer !'
                  : searchQuery
                  ? 'Aucun concept ne correspond à ta recherche.'
                  : 'Aucun concept dans cette catégorie.'}
              </p>
            </motion.div>
          ) : viewMode === 'grouped' ? (
            // Grouped by course view
            <div className="space-y-4">
              {Object.entries(conceptsByCourse).map(([courseId, { courseTitle, concepts: courseConcepts }]) => {
                const filtered = filterConceptsInCourse(courseConcepts);
                if (filtered.length === 0) return null;
                
                const stats = getCourseStats(courseConcepts);
                const isExpanded = expandedCourses.has(courseId);

                return (
                  <Collapsible
                    key={courseId}
                    open={isExpanded}
                    onOpenChange={() => toggleCourse(courseId)}
                  >
                    <CollapsibleTrigger asChild>
                      <motion.div
                        layout
                        className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{courseTitle}</h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{filtered.length} concepts</span>
                                {stats.danger > 0 && (
                                  <span className="text-destructive">• {stats.danger} en danger</span>
                                )}
                                {stats.warning > 0 && (
                                  <span className="text-xp">• {stats.warning} à revoir</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <AnimatePresence mode="popLayout">
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-primary/20">
                          {filtered.map((concept) => (
                            <ConceptCard
                              key={concept.id}
                              id={concept.id}
                              title={concept.concept_title}
                              content={concept.concept_content}
                              memoryStrength={concept.memory_strength}
                              lastReviewed={concept.last_reviewed_at}
                              nextReview={concept.next_review_at}
                              onDelete={(id) => setDeleteConfirm(id)}
                              onReview={() => navigate('/smart-session')}
                            />
                          ))}
                        </div>
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          ) : (
            // Flat view
            <AnimatePresence mode="popLayout">
              {processedConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  id={concept.id}
                  title={concept.concept_title}
                  content={concept.concept_content}
                  memoryStrength={concept.memory_strength}
                  lastReviewed={concept.last_reviewed_at}
                  nextReview={concept.next_review_at}
                  courseName={concept.course_title || undefined}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onReview={() => navigate('/smart-session')}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce concept ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le concept sera définitivement supprimé de votre mémoire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default Brain;
