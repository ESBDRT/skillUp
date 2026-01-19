import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { AIGenerationForm } from "@/components/AIGenerationForm";
import { GenerationLoader } from "@/components/GenerationLoader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

export default function CreatorStudio() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async (
    theme: string,
    minutes: number,
    level: 'beginner' | 'intermediate' | 'expert',
    durationDays: number,
    knownKeywords?: string[],
    coursePlan?: CoursePlan
  ) => {
    setIsGenerating(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          theme, 
          dailyMinutes: minutes, 
          level, 
          durationDays, 
          knownKeywords,
          coursePlan
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la génération');
      }

      const generatedCourse = await response.json();
      
      // Convert cards to the format expected by CoursePlayer
      const formattedCards = generatedCourse.cards.map((card: any, index: number) => ({
        id: `card-${Date.now()}-${index}`,
        type: card.type,
        title: card.title,
        content: card.content,
        sections: card.sections,
        options: card.options?.map((opt: string, i: number) => ({
          id: `opt-${i}`,
          text: opt,
          isCorrect: i === card.correctIndex
        })),
        flashcardBack: card.flashcardBack,
        sliderConfig: card.sliderConfig,
        xpReward: card.xpReward || 10,
      }));

      // Prepare course data for saving
      const courseToSave = {
        title: generatedCourse.title,
        description: generatedCourse.description,
        category: generatedCourse.category,
        icon: generatedCourse.icon,
        level: generatedCourse.level,
        estimatedMinutes: generatedCourse.estimated_minutes,
        totalXP: generatedCourse.total_xp,
        durationDays: durationDays,
        dailyCardsCount: Math.ceil(formattedCards.length / durationDays),
        cards: formattedCards,
      };

      // Save course to database
      toast.info('Sauvegarde du cours...');
      
      const saveResponse = await supabase.functions.invoke('save-generated-course', {
        body: { course: courseToSave }
      });

      if (saveResponse.error) {
        console.error('Error saving course:', saveResponse.error);
        toast.error('Erreur lors de la sauvegarde, mais vous pouvez continuer');
      }

      const savedCourseId = saveResponse.data?.courseId || 'preview';
      
      // Navigate to course player with saved course ID
      navigate(`/course/${savedCourseId}`, {
        state: {
          generatedCourse: {
            id: savedCourseId,
            title: generatedCourse.title,
            description: generatedCourse.description,
            category: generatedCourse.category,
            icon: generatedCourse.icon,
            level: generatedCourse.level,
            estimatedMinutes: generatedCourse.estimated_minutes,
            totalXP: generatedCourse.total_xp,
            cards: formattedCards,
          }
        }
      });
      
      if (saveResponse.data?.courseId) {
        toast.success('Cours généré et sauvegardé !');
      }
      
    } catch (error) {
      console.error('Error generating course:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération du cours');
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading Screen
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Génération IA</h1>
          </div>
        </header>

        <main className="p-4 max-w-2xl mx-auto">
          <GenerationLoader />
        </main>

        <BottomNav />
      </div>
    );
  }

  // AI Form Screen
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Créer un cours</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold">Création assistée par IA</h2>
              <p className="text-sm text-muted-foreground">Décrivez votre cours idéal</p>
            </div>
          </div>
          
          <AIGenerationForm onGenerate={handleAIGenerate} isGenerating={isGenerating} />
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
