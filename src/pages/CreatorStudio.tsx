import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GripVertical, Image, HelpCircle, FileText, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomNav from '@/components/BottomNav';

interface CreatorCard {
  id: string;
  type: 'info' | 'quiz' | 'flashcard';
  title: string;
  content: string;
}

const CreatorStudio = () => {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseLevel, setCourseLevel] = useState<string>('beginner');
  const [courseCategory, setCourseCategory] = useState<string>('');
  const [cards, setCards] = useState<CreatorCard[]>([
    { id: '1', type: 'info', title: '', content: '' }
  ]);

  const addCard = (type: 'info' | 'quiz' | 'flashcard') => {
    setCards([...cards, {
      id: Date.now().toString(),
      type,
      title: '',
      content: ''
    }]);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const updateCard = (id: string, field: keyof CreatorCard, value: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'info': return FileText;
      case 'quiz': return HelpCircle;
      case 'flashcard': return ToggleLeft;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border safe-top">
        <div className="px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-bold text-lg text-foreground">Créer un cours</h1>
          <Button size="sm" className="gradient-primary rounded-xl">
            Publier
          </Button>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-6">
        {/* Course Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-2xl p-5 shadow-card border border-border space-y-4"
        >
          <h2 className="font-semibold text-foreground">Détails du cours</h2>
          
          <Input
            placeholder="Titre du cours"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="h-12 rounded-xl"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select value={courseLevel} onValueChange={setCourseLevel}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-level-beginner" />
                    Débutant
                  </span>
                </SelectItem>
                <SelectItem value="intermediate">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-level-intermediate" />
                    Intermédiaire
                  </span>
                </SelectItem>
                <SelectItem value="expert">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-level-expert" />
                    Expert
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={courseCategory} onValueChange={setCourseCategory}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wellness">💆 Bien-être</SelectItem>
                <SelectItem value="nutrition">🍎 Nutrition</SelectItem>
                <SelectItem value="mental">🧠 Mental</SelectItem>
                <SelectItem value="fitness">💪 Fitness</SelectItem>
                <SelectItem value="productivity">📈 Productivité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Cards Editor */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Cartes ({cards.length})</h2>
          </div>

          {cards.map((card, index) => {
            const Icon = getCardIcon(card.type);
            return (
              <motion.div
                key={card.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl p-4 shadow-card border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <div className={`p-2 rounded-lg ${
                      card.type === 'info' ? 'bg-primary/10' :
                      card.type === 'quiz' ? 'bg-level-intermediate/10' :
                      'bg-success/10'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        card.type === 'info' ? 'text-primary' :
                        card.type === 'quiz' ? 'text-level-intermediate' :
                        'text-success'
                      }`} />
                    </div>
                    <span className="text-sm font-medium text-foreground capitalize">
                      {card.type === 'info' ? 'Information' : 
                       card.type === 'quiz' ? 'Quiz' : 'Flashcard'}
                    </span>
                  </div>
                  {cards.length > 1 && (
                    <button
                      onClick={() => removeCard(card.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  )}
                </div>

                <Input
                  placeholder="Titre de la carte"
                  value={card.title}
                  onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                  className="h-11 rounded-xl"
                />

                <Textarea
                  placeholder="Contenu de la carte..."
                  value={card.content}
                  onChange={(e) => updateCard(card.id, 'content', e.target.value)}
                  className="min-h-[80px] rounded-xl resize-none"
                />

                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Image className="w-4 h-4" />
                  Ajouter une image
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Add Card Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <button
            onClick={() => addCard('info')}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card border border-border border-dashed hover:border-primary transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">Info</span>
          </button>
          <button
            onClick={() => addCard('quiz')}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card border border-border border-dashed hover:border-level-intermediate transition-colors"
          >
            <div className="p-2 bg-level-intermediate/10 rounded-lg">
              <HelpCircle className="w-5 h-5 text-level-intermediate" />
            </div>
            <span className="text-xs font-medium text-foreground">Quiz</span>
          </button>
          <button
            onClick={() => addCard('flashcard')}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card border border-border border-dashed hover:border-success transition-colors"
          >
            <div className="p-2 bg-success/10 rounded-lg">
              <ToggleLeft className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs font-medium text-foreground">Flashcard</span>
          </button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CreatorStudio;
