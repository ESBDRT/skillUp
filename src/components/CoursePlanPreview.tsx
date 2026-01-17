import { useState } from 'react';
import { Check, X, Calendar, Clock, BookOpen, ChevronDown, ChevronUp, Sparkles, Loader2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DayPlan {
  day: number;
  title: string;
  concepts: string[];
  estimatedMinutes: number;
}

interface CoursePlan {
  courseTitle: string;
  courseDescription: string;
  category: string;
  icon: string;
  level: string;
  dailyMinutes: number;
  durationDays: number;
  days: DayPlan[];
  totalConcepts: number;
}

interface CoursePlanPreviewProps {
  plan: CoursePlan;
  onConfirm: (plan: CoursePlan) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export function CoursePlanPreview({ plan, onConfirm, onCancel, isGenerating }: CoursePlanPreviewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1, 2]));
  const [editingTitle, setEditingTitle] = useState(false);
  const [courseTitle, setCourseTitle] = useState(plan.courseTitle);
  const [editedConcepts, setEditedConcepts] = useState<Map<string, string[]>>(new Map());

  const toggleDay = (day: number) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const updatedPlan = {
      ...plan,
      courseTitle,
      days: plan.days.map(day => ({
        ...day,
        concepts: editedConcepts.get(`day-${day.day}`) || day.concepts
      }))
    };
    onConfirm(updatedPlan);
  };

  const updateConcept = (dayNum: number, index: number, value: string) => {
    const key = `day-${dayNum}`;
    const currentConcepts = editedConcepts.get(key) || plan.days.find(d => d.day === dayNum)?.concepts || [];
    const newConcepts = [...currentConcepts];
    newConcepts[index] = value;
    setEditedConcepts(new Map(editedConcepts.set(key, newConcepts)));
  };

  const getConcepts = (day: DayPlan) => {
    return editedConcepts.get(`day-${day.day}`) || day.concepts;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with course info */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{plan.icon}</div>
          <div className="flex-1">
            {editingTitle ? (
              <Input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="text-xl font-bold"
                autoFocus
              />
            ) : (
              <h2 
                className="text-xl font-bold flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setEditingTitle(true)}
              >
                {courseTitle}
                <Edit3 className="w-4 h-4 opacity-50" />
              </h2>
            )}
            <p className="text-muted-foreground mt-1">{plan.courseDescription}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{plan.durationDays} jours</span>
          </div>
          <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-primary" />
            <span>{plan.dailyMinutes} min/jour</span>
          </div>
          <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>{plan.totalConcepts} concepts</span>
          </div>
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Planning détaillé
        </h3>
        
        <div className="space-y-2">
          {plan.days.map((day) => (
            <motion.div
              key={day.day}
              className="border rounded-xl overflow-hidden bg-card"
              initial={false}
            >
              <button
                onClick={() => toggleDay(day.day)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {day.day}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{day.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {getConcepts(day).length} concepts • {day.estimatedMinutes} min
                    </div>
                  </div>
                </div>
                {expandedDays.has(day.day) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {expandedDays.has(day.day) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {getConcepts(day).map((concept, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <Input
                            value={concept}
                            onChange={(e) => updateConcept(day.day, idx, e.target.value)}
                            className="h-8 text-sm bg-muted/30 border-0"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isGenerating}
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Modifier les paramètres
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Générer le contenu
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        💡 Vous pouvez modifier le titre du cours et les concepts avant de générer le contenu
      </p>
    </motion.div>
  );
}
