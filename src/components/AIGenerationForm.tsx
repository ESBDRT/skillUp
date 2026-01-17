import { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AIGenerationFormProps {
  onGenerate: (theme: string, minutes: number, level: 'beginner' | 'intermediate' | 'expert') => void;
  isGenerating: boolean;
}

const minutesOptions = [
  { value: 5, label: '5 min/jour', description: 'Cours express' },
  { value: 10, label: '10 min/jour', description: 'Cours standard' },
  { value: 15, label: '15 min/jour', description: 'Cours approfondi' },
  { value: 20, label: '20 min/jour', description: 'Cours complet' },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim() && !isGenerating) {
      onGenerate(theme.trim(), selectedMinutes, selectedLevel);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Theme Input */}
      <div className="space-y-2">
        <Label htmlFor="theme" className="flex items-center gap-2 text-base font-medium">
          <BookOpen className="w-4 h-4" />
          Thème du cours
        </Label>
        <Input
          id="theme"
          placeholder="Ex: La méditation, Les bases de l'investissement, L'histoire de Rome..."
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="text-base h-12"
          disabled={isGenerating}
        />
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
              disabled={isGenerating}
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
              disabled={isGenerating}
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

      {/* Generate Button */}
      <Button
        type="submit"
        size="lg"
        disabled={!theme.trim() || isGenerating}
        className="w-full h-14 text-lg gap-3"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Générer avec l'IA
          </>
        )}
      </Button>
    </form>
  );
}
