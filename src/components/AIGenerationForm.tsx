import { useState, useEffect } from 'react';
import { Sparkles, Loader2, BookOpen, Clock, GraduationCap, AlertCircle, CheckCircle2, Lightbulb, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CoursePlanPreview } from './CoursePlanPreview';

interface AIGenerationFormProps {
  onGenerate: (theme: string, minutes: number, level: 'beginner' | 'intermediate' | 'expert', durationDays: number, knownKeywords?: string[], coursePlan?: CoursePlan) => void;
  isGenerating: boolean;
}

interface Keyword {
  id: string;
  label: string;
  description: string;
}

interface ThemeAnalysis {
  isValid: boolean;
  feedback: string;
  suggestedTheme: string | null;
  keywords: Keyword[];
}

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

const minutesOptions = [
  { value: 5, label: '5 min/jour', description: 'Cours express' },
  { value: 10, label: '10 min/jour', description: 'Cours standard' },
  { value: 15, label: '15 min/jour', description: 'Cours approfondi' },
  { value: 20, label: '20 min/jour', description: 'Cours complet' },
];

const durationOptions = [
  { value: 3, label: '3 jours', description: 'Introduction rapide' },
  { value: 5, label: '5 jours', description: 'Cours court' },
  { value: 7, label: '7 jours', description: 'Une semaine' },
  { value: 14, label: '14 jours', description: 'Approfondi' },
  { value: 30, label: '30 jours', description: 'Maîtrise complète' },
];

const levelOptions = [
  { value: 'beginner' as const, label: 'Notions', color: 'bg-emerald-500', description: 'Vocabulaire simple, concepts de base' },
  { value: 'intermediate' as const, label: 'Intermédiaire', color: 'bg-amber-500', description: 'Approfondissement, nuances' },
  { value: 'expert' as const, label: 'Expert', color: 'bg-rose-500', description: 'Analyse critique, complexité' },
];

export function AIGenerationForm({ onGenerate, isGenerating }: AIGenerationFormProps) {
  const [theme, setTheme] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [selectedDuration, setSelectedDuration] = useState(5);
  
  // Theme analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ThemeAnalysis | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [analyzeTimeout, setAnalyzeTimeout] = useState<NodeJS.Timeout | null>(null);

  // Course plan state (step 2)
  const [coursePlan, setCoursePlan] = useState<CoursePlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Debounced theme analysis when theme or level changes
  useEffect(() => {
    if (analyzeTimeout) {
      clearTimeout(analyzeTimeout);
    }

    if (theme.trim().length < 3) {
      setAnalysis(null);
      setSelectedKeywords(new Set());
      return;
    }

    const timeout = setTimeout(() => {
      analyzeTheme();
    }, 800);

    setAnalyzeTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [theme, selectedLevel]);

  const analyzeTheme = async () => {
    if (theme.trim().length < 3) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-theme', {
        body: { theme: theme.trim(), level: selectedLevel }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
      setSelectedKeywords(new Set());
    } catch (error) {
      console.error('Error analyzing theme:', error);
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleKeyword = (keywordId: string) => {
    setSelectedKeywords(prev => {
      const next = new Set(prev);
      if (next.has(keywordId)) {
        next.delete(keywordId);
      } else {
        next.add(keywordId);
      }
      return next;
    });
  };

  const useSuggestedTheme = () => {
    if (analysis?.suggestedTheme) {
      setTheme(analysis.suggestedTheme);
    }
  };

  // Step 1: Generate the course plan
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim() || isGeneratingPlan) return;

    setIsGeneratingPlan(true);
    try {
      const knownKeywords = analysis?.keywords
        .filter(k => selectedKeywords.has(k.id))
        .map(k => k.label) || [];

      const { data, error } = await supabase.functions.invoke('generate-course-plan', {
        body: {
          theme: theme.trim(),
          dailyMinutes: selectedMinutes,
          level: selectedLevel,
          durationDays: selectedDuration,
          knownKeywords
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setCoursePlan(data);
      toast.success('Planning généré ! Vérifiez et validez pour créer le contenu.');
    } catch (error) {
      console.error('Error generating course plan:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération du planning');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Step 2: Confirm and generate full content
  const handleConfirmPlan = (confirmedPlan: CoursePlan) => {
    const knownKeywords = analysis?.keywords
      .filter(k => selectedKeywords.has(k.id))
      .map(k => k.label) || [];
    
    onGenerate(
      theme.trim(),
      selectedMinutes,
      selectedLevel,
      selectedDuration,
      knownKeywords,
      confirmedPlan
    );
  };

  const handleCancelPlan = () => {
    setCoursePlan(null);
  };

  // If we have a plan, show the preview
  if (coursePlan) {
    return (
      <CoursePlanPreview
        plan={coursePlan}
        onConfirm={handleConfirmPlan}
        onCancel={handleCancelPlan}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <form onSubmit={handleGeneratePlan} className="space-y-6">
      {/* Theme Input */}
      <div className="space-y-2">
        <Label htmlFor="theme" className="flex items-center gap-2 text-base font-medium">
          <BookOpen className="w-4 h-4" />
          Thème du cours
        </Label>
        <div className="relative">
          <Input
            id="theme"
            placeholder="Ex: La méditation, Les bases de l'investissement, L'histoire de Rome..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={cn(
              "text-base h-12 pr-10",
              analysis && !analysis.isValid && "border-amber-500 focus-visible:ring-amber-500"
            )}
            disabled={isGenerating || isGeneratingPlan}
          />
          {isAnalyzing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isAnalyzing && analysis?.isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          )}
          {!isAnalyzing && analysis && !analysis.isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
          )}
        </div>

        {/* Theme Feedback */}
        {analysis && (
          <div className={cn(
            "p-3 rounded-lg text-sm",
            analysis.isValid ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
          )}>
            <p>{analysis.feedback}</p>
            {analysis.suggestedTheme && (
              <button
                type="button"
                onClick={useSuggestedTheme}
                className="mt-2 flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                Utiliser : "{analysis.suggestedTheme}"
              </button>
            )}
          </div>
        )}
      </div>

      {/* Daily Minutes */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Clock className="w-4 h-4" />
          Temps quotidien
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {minutesOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedMinutes(option.value)}
              disabled={isGenerating || isGeneratingPlan}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-left",
                selectedMinutes === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-semibold text-sm">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Course Duration */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <CalendarDays className="w-4 h-4" />
          Durée du cours
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedDuration(option.value)}
              disabled={isGenerating || isGeneratingPlan}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-left",
                selectedDuration === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-semibold text-sm">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          📅 Environ {Math.ceil((selectedMinutes * selectedDuration) / 5)} cartes réparties sur {selectedDuration} sessions
        </p>
      </div>

      {/* Difficulty Level */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <GraduationCap className="w-4 h-4" />
          Niveau de difficulté
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {levelOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedLevel(option.value)}
              disabled={isGenerating || isGeneratingPlan}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-left flex items-start gap-3",
                selectedLevel === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className={cn("w-3 h-3 rounded-full mt-1 flex-shrink-0", option.color)} />
              <div>
                <div className="font-semibold text-sm">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Selection */}
      {analysis?.isValid && analysis.keywords && analysis.keywords.length > 0 && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Concepts que vous connaissez déjà
            <span className="text-xs font-normal text-muted-foreground ml-1">
              (optionnel)
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword) => (
              <button
                key={keyword.id}
                type="button"
                onClick={() => toggleKeyword(keyword.id)}
                disabled={isGenerating || isGeneratingPlan}
                className={cn(
                  "group relative px-3 py-2 rounded-full text-sm transition-all",
                  selectedKeywords.has(keyword.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
                title={keyword.description}
              >
                <span className="flex items-center gap-1.5">
                  {selectedKeywords.has(keyword.id) && (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {keyword.label}
                </span>
              </button>
            ))}
          </div>
          {selectedKeywords.size > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedKeywords.size} concept{selectedKeywords.size > 1 ? 's' : ''} sélectionné{selectedKeywords.size > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Generate Plan Button */}
      <Button
        type="submit"
        size="lg"
        disabled={!theme.trim() || isGenerating || isGeneratingPlan || isAnalyzing}
        className="w-full h-14 text-lg gap-3"
      >
        {isGeneratingPlan ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Génération du planning...
          </>
        ) : (
          <>
            <CalendarDays className="w-5 h-5" />
            Voir le planning proposé
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        📋 Un planning avec les notions sera proposé avant la génération du contenu
      </p>
    </form>
  );
}
