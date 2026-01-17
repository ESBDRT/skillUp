import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain as BrainIcon, Zap, RefreshCw, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import MemoryHealthGauge from '@/components/MemoryHealthGauge';
import ConceptCard from '@/components/ConceptCard';
import { useMemoryConcepts } from '@/hooks/useMemoryConcepts';
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

type FilterType = 'all' | 'danger' | 'warning' | 'solid';

const Brain = () => {
  const navigate = useNavigate();
  const {
    concepts,
    loading,
    getAverageMemoryStrength,
    getAtRiskConcepts,
    getConceptsForReview,
    deleteConcept,
    refetch,
  } = useMemoryConcepts();

  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const averageStrength = getAverageMemoryStrength();
  const atRiskCount = getAtRiskConcepts().length;
  const reviewCount = getConceptsForReview().length;

  const filteredConcepts = concepts.filter((concept) => {
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

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteConcept(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleStartSmartSession = () => {
    navigate('/smart-session');
  };

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'Tous', color: 'bg-primary' },
    { key: 'danger', label: 'En danger', color: 'bg-destructive' },
    { key: 'warning', label: 'À revoir', color: 'bg-xp' },
    { key: 'solid', label: 'Solides', color: 'bg-success' },
  ];

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

        {/* Stats Cards */}
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

        {/* Smart Session Button */}
        {reviewCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleStartSmartSession}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80"
            >
              <Zap className="w-5 h-5 mr-2" />
              Lancer une Smart Session ({reviewCount})
            </Button>
          </motion.div>
        )}

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 overflow-x-auto pb-2"
        >
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
        </motion.div>

        {/* Concepts List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Concepts ({filteredConcepts.length})
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : filteredConcepts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {concepts.length === 0
                  ? 'Aucun concept en mémoire. Complète des cours pour commencer !'
                  : 'Aucun concept dans cette catégorie.'}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredConcepts.map((concept) => (
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
            </AnimatePresence>
          )}
        </div>
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
