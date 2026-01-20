import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain as BrainIcon, Zap, RefreshCw, Trash2, Filter, ChevronDown, ChevronUp, BookOpen, Network, List, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import BrainSummaryCard from '@/components/BrainSummaryCard';
import ConceptCard from '@/components/ConceptCard';
import ConceptSearch, { SortOption } from '@/components/ConceptSearch';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    deleteConcept,
    refetch,
  } = useMemoryConcepts();
  
  const { profile } = useUserProgress();

  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('flat');
  const [mainView, setMainView] = useState<'list' | 'graph'>('list');
  
  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('next-review');

  const averageStrength = getAverageMemoryStrength();
  const atRiskConcepts = getAtRiskConcepts();
  const reviewConcepts = getConceptsForReview();
  const conceptsByCourse = getConceptsByCourse();

  // Calculate warning count (concepts at 40-70% that need review, excluding those already in danger)
  const warningCount = useMemo(() => {
    return concepts.filter(c => c.memory_strength >= 40 && c.memory_strength < 70).length;
  }, [concepts]);

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
    sessionStorage.setItem('targetedConceptIds', JSON.stringify(conceptIds));
    navigate('/smart-session?targeted=true');
  };

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'Tous', color: 'bg-primary' },
    { key: 'danger', label: 'Danger', color: 'bg-destructive' },
    { key: 'warning', label: 'À revoir', color: 'bg-xp' },
    { key: 'solid', label: 'Solides', color: 'bg-success' },
  ];

  const getCourseStats = (courseConcepts: MemoryConcept[]) => {
    const danger = courseConcepts.filter(c => c.memory_strength < 40).length;
    const warning = courseConcepts.filter(c => c.memory_strength >= 40 && c.memory_strength < 70).length;
    return { danger, warning, total: courseConcepts.length };
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header - Sticky */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <BrainIcon className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Mon Cerveau</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refetch()}
            aria-label="Rafraîchir les données"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </motion.header>

      <div className="px-4 py-4 space-y-4">
        {/* Summary Card - Compact horizontal */}
        {!loading && (
          <BrainSummaryCard
            streakDays={profile?.streak_count ?? 0}
            memoryHealth={averageStrength}
            dangerCount={atRiskConcepts.length}
            reviewCount={warningCount}
            totalConcepts={concepts.length}
            onDangerClick={() => setFilter('danger')}
            onReviewClick={() => setFilter('warning')}
          />
        )}

        {loading && (
          <Skeleton className="h-24 rounded-2xl" />
        )}

        {/* Action Buttons - Prominent position */}
        {reviewConcepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <Button
              onClick={handleStartSmartSession}
              className="flex-1 py-5 text-base font-semibold bg-gradient-to-r from-primary to-primary/80"
              aria-label={`Démarrer une Smart Session avec ${reviewConcepts.length} concepts`}
            >
              <Zap className="w-5 h-5 mr-2" aria-hidden="true" />
              Smart Session ({reviewConcepts.length})
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2" aria-label="Vue liste">
              <List className="w-4 h-4" aria-hidden="true" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-2" aria-label="Vue graphe">
              <Network className="w-4 h-4" aria-hidden="true" />
              Graphe
            </TabsTrigger>
          </TabsList>

          {/* Graph View */}
          <TabsContent value="graph" className="mt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              {/* Filter pills for graph */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" role="group" aria-label="Filtres">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[36px] ${
                      filter === f.key
                        ? `${f.color} text-white`
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    aria-pressed={filter === f.key}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <Skeleton className="h-[300px] rounded-xl" />
              ) : concepts.length === 0 ? (
                <div className="text-center py-12" role="status">
                  <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p className="text-muted-foreground">
                    Aucun concept en mémoire. Complète des cours pour voir ton graphe !
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
          <TabsContent value="list" className="mt-4 space-y-3">
            {/* Search + Filter row - Combined */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ConceptSearch
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
              
              {/* Filter dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0"
                    aria-label="Filtrer les concepts"
                  >
                    <Filter className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {filters.map((f) => (
                    <DropdownMenuItem
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className={filter === f.key ? 'bg-primary/10' : ''}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mr-2 ${f.color}`} aria-hidden="true" />
                      {f.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View mode toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(v => v === 'flat' ? 'grouped' : 'flat')}
                className="shrink-0"
                aria-label={viewMode === 'flat' ? 'Grouper par cours' : 'Vue plate'}
                aria-pressed={viewMode === 'grouped'}
              >
                {viewMode === 'flat' ? (
                  <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <List className="w-4 h-4" aria-hidden="true" />
                )}
              </Button>
            </div>

            {/* Active filter indicator */}
            {filter !== 'all' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Filtre actif:</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => setFilter('all')}
                >
                  {filters.find(f => f.key === filter)?.label}
                  <span className="ml-1">×</span>
                </Button>
              </div>
            )}

            {/* Concepts List */}
            <div className="space-y-2" role="list" aria-label="Liste des concepts">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 rounded-xl" />
                  ))}
                </div>
              ) : processedConcepts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                  role="status"
                >
                  <BrainIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p className="text-muted-foreground text-sm">
                    {concepts.length === 0
                      ? 'Aucun concept en mémoire. Complète des cours pour commencer !'
                      : searchQuery
                      ? 'Aucun concept ne correspond à ta recherche.'
                      : 'Aucun concept dans cette catégorie.'}
                  </p>
                </motion.div>
              ) : viewMode === 'grouped' ? (
                // Grouped by course view
                <div className="space-y-3">
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
                            className="bg-card border border-border rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            role="button"
                            aria-expanded={isExpanded}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                  <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-foreground text-sm truncate">{courseTitle}</h3>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{filtered.length} concept{filtered.length > 1 ? 's' : ''}</span>
                                    {stats.danger > 0 && (
                                      <span className="text-destructive">• {stats.danger} danger</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                              )}
                            </div>
                          </motion.div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <AnimatePresence mode="popLayout">
                            <div className="pl-3 mt-2 space-y-2 border-l-2 border-primary/20">
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
                                  compact
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
                // Flat view with compact cards
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
                      compact
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
              Cette action est irréversible. Le concept sera définitivement supprimé de ta mémoire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
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
