import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Sparkles, PenLine, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { AIGenerationForm } from "@/components/AIGenerationForm";
import { GenerationLoader } from "@/components/GenerationLoader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type CardType = "info" | "quiz" | "flashcard" | "slider" | "open-question";

interface CourseCard {
  id: string;
  type: CardType;
  title: string;
  content: string;
  options?: string[];
  correctIndex?: number;
  flashcardBack?: string;
  sliderConfig?: {
    min: number;
    max: number;
    correct: number;
    unit: string;
  };
  xpReward: number;
}

interface GeneratedCourse {
  title: string;
  description: string;
  category: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'expert';
  estimated_minutes: number;
  total_xp: number;
  cards: CourseCard[];
}

type CreationMode = 'select' | 'ai' | 'manual';

const cardTypeLabels: Record<CardType, string> = {
  info: "📖 Information",
  quiz: "❓ Quiz",
  flashcard: "🔄 Flashcard",
  slider: "📊 Slider",
  "open-question": "✍️ Question ouverte",
};

const cardTypeColors: Record<CardType, string> = {
  info: "border-l-blue-500",
  quiz: "border-l-purple-500",
  flashcard: "border-l-amber-500",
  slider: "border-l-emerald-500",
  "open-question": "border-l-rose-500",
};

export default function CreatorStudio() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CreationMode>('select');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Course metadata
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseIcon, setCourseIcon] = useState("📚");
  const [courseLevel, setCourseLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  
  // Cards
  const [cards, setCards] = useState<CourseCard[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleAIGenerate = async (theme: string, minutes: number, level: 'beginner' | 'intermediate' | 'expert') => {
    setIsGenerating(true);
    setMode('ai');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ theme, dailyMinutes: minutes, level }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la génération');
      }

      const generatedCourse: GeneratedCourse = await response.json();
      
      // Convert cards to the format expected by CoursePlayer
      const formattedCards = generatedCourse.cards.map((card, index) => ({
        id: `card-${Date.now()}-${index}`,
        type: card.type,
        title: card.title,
        content: card.content,
        options: card.options?.map((opt, i) => ({
          id: `opt-${i}`,
          text: opt,
          isCorrect: i === card.correctIndex
        })),
        flashcardBack: card.flashcardBack,
        sliderConfig: card.sliderConfig,
        xpReward: card.xpReward || 10,
      }));
      
      // Navigate directly to course player with generated data
      navigate('/course/preview', {
        state: {
          generatedCourse: {
            id: 'preview',
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
      
    } catch (error) {
      console.error('Error generating course:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération du cours');
      setMode('select');
    } finally {
      setIsGenerating(false);
    }
  };

  const addCard = (type: CardType) => {
    const newCard: CourseCard = {
      id: `card-${Date.now()}`,
      type,
      title: "",
      content: "",
      xpReward: type === 'info' ? 10 : type === 'slider' ? 20 : 15,
      ...(type === 'quiz' && { options: ["", "", "", ""], correctIndex: 0 }),
      ...(type === 'flashcard' && { flashcardBack: "" }),
      ...(type === 'slider' && { sliderConfig: { min: 0, max: 100, correct: 50, unit: "" } }),
    };
    setCards([...cards, newCard]);
    setExpandedCard(newCard.id);
  };

  const updateCard = (id: string, updates: Partial<CourseCard>) => {
    setCards(cards.map(card => card.id === id ? { ...card, ...updates } : card));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    if (expandedCard === id) setExpandedCard(null);
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cards.length) return;
    
    const newCards = [...cards];
    [newCards[index], newCards[newIndex]] = [newCards[newIndex], newCards[index]];
    setCards(newCards);
  };

  const handleSave = () => {
    if (!courseTitle.trim()) {
      toast.error("Veuillez entrer un titre pour le cours");
      return;
    }
    if (cards.length === 0) {
      toast.error("Ajoutez au moins une carte au cours");
      return;
    }
    
    // TODO: Save to database when auth is implemented
    toast.success("Cours sauvegardé ! (Mode démo - pas de base de données connectée)");
  };

  const handlePreview = () => {
    toast.info("Prévisualisation à venir !");
  };

  const totalXP = cards.reduce((sum, card) => sum + card.xpReward, 0);

  // Mode Selection Screen
  if (mode === 'select') {
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

        <main className="p-4 max-w-2xl mx-auto space-y-6 mt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Comment voulez-vous créer ?</h2>
            <p className="text-muted-foreground">Choisissez votre méthode de création</p>
          </div>

          <div className="grid gap-4">
            {/* AI Generation Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('ai')}
              className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-left transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Générer avec l'IA</h3>
                    <p className="text-sm text-muted-foreground">Recommandé</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Décrivez votre sujet et laissez l'IA créer un cours complet avec des quiz, flashcards et exercices adaptés à votre niveau.
                </p>
              </div>
            </motion.button>

            {/* Manual Creation Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('manual')}
              className="rounded-2xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <PenLine className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Créer manuellement</h3>
                  <p className="text-sm text-muted-foreground">Contrôle total</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Créez chaque carte vous-même avec un contrôle total sur le contenu, les questions et la structure du cours.
              </p>
            </motion.button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // AI Generation Screen (while loading)
  if (mode === 'ai' && isGenerating) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMode('select')} disabled>
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

  // AI Form Screen (before generation)
  if (mode === 'ai' && cards.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMode('select')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Générer avec l'IA</h1>
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

  // Editor Screen (Manual or after AI generation)
  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => {
              if (cards.length > 0) {
                if (confirm("Voulez-vous vraiment quitter ? Vos modifications seront perdues.")) {
                  setMode('select');
                  setCards([]);
                  setCourseTitle("");
                  setCourseDescription("");
                }
              } else {
                setMode('select');
              }
            }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">
              {mode === 'ai' ? 'Éditer le cours' : 'Créer manuellement'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-1" />
              Aperçu
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Publier
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Course Metadata */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Input
              value={courseIcon}
              onChange={(e) => setCourseIcon(e.target.value)}
              className="w-16 text-center text-2xl"
              maxLength={2}
            />
            <Input
              placeholder="Titre du cours"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="text-lg font-bold"
            />
          </div>
          
          <Textarea
            placeholder="Description du cours (optionnel)"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            rows={2}
          />

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Catégorie:</span>
              <Input
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value)}
                placeholder="Ex: Science"
                className="w-32 h-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Niveau:</span>
              <select
                value={courseLevel}
                onChange={(e) => setCourseLevel(e.target.value as 'beginner' | 'intermediate' | 'expert')}
                className="h-8 px-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="beginner">Notions</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">XP Total:</span>
              <span className="font-bold text-primary">{totalXP}</span>
            </div>
          </div>
        </Card>

        {/* Cards List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{cards.length} cartes</h2>
          </div>

          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={cn("border-l-4 overflow-hidden", cardTypeColors[card.type])}>
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {cardTypeLabels[card.type]}
                        </span>
                        <span className="text-xs text-primary font-medium">+{card.xpReward} XP</span>
                      </div>
                      <p className="font-medium truncate mt-1">
                        {card.title || "Sans titre"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); moveCard(index, 'up'); }}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); moveCard(index, 'down'); }}
                        disabled={index === cards.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </button>

                  {/* Expanded Editor */}
                  <AnimatePresence>
                    {expandedCard === card.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 space-y-4 bg-muted/30">
                          <Input
                            placeholder="Titre de la carte"
                            value={card.title}
                            onChange={(e) => updateCard(card.id, { title: e.target.value })}
                          />
                          
                          <Textarea
                            placeholder="Contenu principal"
                            value={card.content}
                            onChange={(e) => updateCard(card.id, { content: e.target.value })}
                            rows={3}
                          />

                          {/* Quiz Options */}
                          {card.type === 'quiz' && card.options && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Options (cliquez pour marquer la bonne réponse)</label>
                              {card.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateCard(card.id, { correctIndex: optIndex })}
                                    className={cn(
                                      "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                                      card.correctIndex === optIndex
                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                        : "border-border hover:border-primary"
                                    )}
                                  >
                                    {String.fromCharCode(65 + optIndex)}
                                  </button>
                                  <Input
                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...card.options!];
                                      newOptions[optIndex] = e.target.value;
                                      updateCard(card.id, { options: newOptions });
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Flashcard Back */}
                          {card.type === 'flashcard' && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Verso (réponse)</label>
                              <Textarea
                                placeholder="Réponse affichée au verso de la carte"
                                value={card.flashcardBack || ''}
                                onChange={(e) => updateCard(card.id, { flashcardBack: e.target.value })}
                                rows={2}
                              />
                            </div>
                          )}

                          {/* Slider Config */}
                          {card.type === 'slider' && card.sliderConfig && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium">Min</label>
                                <Input
                                  type="number"
                                  value={card.sliderConfig.min}
                                  onChange={(e) => updateCard(card.id, { 
                                    sliderConfig: { ...card.sliderConfig!, min: Number(e.target.value) }
                                  })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Max</label>
                                <Input
                                  type="number"
                                  value={card.sliderConfig.max}
                                  onChange={(e) => updateCard(card.id, { 
                                    sliderConfig: { ...card.sliderConfig!, max: Number(e.target.value) }
                                  })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Réponse correcte</label>
                                <Input
                                  type="number"
                                  value={card.sliderConfig.correct}
                                  onChange={(e) => updateCard(card.id, { 
                                    sliderConfig: { ...card.sliderConfig!, correct: Number(e.target.value) }
                                  })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Unité</label>
                                <Input
                                  placeholder="Ex: %, km, ans"
                                  value={card.sliderConfig.unit}
                                  onChange={(e) => updateCard(card.id, { 
                                    sliderConfig: { ...card.sliderConfig!, unit: e.target.value }
                                  })}
                                />
                              </div>
                            </div>
                          )}

                          {/* XP Reward */}
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Récompense XP:</label>
                            <Input
                              type="number"
                              value={card.xpReward}
                              onChange={(e) => updateCard(card.id, { xpReward: Number(e.target.value) })}
                              className="w-20"
                              min={0}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Card Buttons */}
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Ajouter une carte</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(cardTypeLabels) as CardType[]).map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addCard(type)}
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                {cardTypeLabels[type]}
              </Button>
            ))}
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
