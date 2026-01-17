import { useState, useCallback } from 'react';
import { Upload, FileJson, Download, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CourseSection {
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
}

interface CourseCard {
  type: 'lesson' | 'quiz' | 'flashcard' | 'info' | 'slider' | 'open-question';
  title: string;
  content: string;
  sections?: CourseSection[];
  imageUrl?: string;
  flashcardBack?: string;
  options?: Array<{ text: string; isCorrect: boolean }>;
  sliderConfig?: { min: number; max: number; correctValue: number; unit: string };
  xpReward?: number;
}

interface ImportCourse {
  title: string;
  description?: string;
  icon?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes?: number;
  cards: CourseCard[];
}

interface ImportResult {
  success: boolean;
  coursesImported: number;
  cardsImported: number;
  errors: Array<{ courseIndex: number; courseTitle: string; error: string }>;
}

const TEMPLATE: { courses: ImportCourse[] } = {
  courses: [
    {
      title: "Introduction à React",
      description: "Apprenez les bases de React avec ce cours complet",
      icon: "⚛️",
      category: "Programmation",
      level: "beginner",
      estimatedMinutes: 15,
      cards: [
        {
          type: "lesson",
          title: "Qu'est-ce que React ?",
          content: "Introduction à la bibliothèque React",
          sections: [
            {
              title: "Introduction",
              subtitle: "Pourquoi React ?",
              content: "React est une bibliothèque JavaScript créée par Facebook pour construire des interfaces utilisateur. Elle permet de créer des applications web interactives de manière efficace.",
              imageUrl: "https://example.com/react-logo.png"
            },
            {
              title: "Composants",
              content: "React utilise une architecture basée sur les composants. Chaque composant est une pièce réutilisable de l'interface."
            }
          ],
          xpReward: 20
        },
        {
          type: "quiz",
          title: "Quiz React",
          content: "Qui a créé React ?",
          options: [
            { text: "Google", isCorrect: false },
            { text: "Facebook", isCorrect: true },
            { text: "Microsoft", isCorrect: false },
            { text: "Apple", isCorrect: false }
          ],
          xpReward: 15
        },
        {
          type: "flashcard",
          title: "Vocabulaire React",
          content: "JSX",
          flashcardBack: "JavaScript XML - Une extension de syntaxe qui permet d'écrire du HTML dans JavaScript",
          xpReward: 10
        }
      ]
    }
  ]
};

export function ImportCoursesForm() {
  const [courses, setCourses] = useState<ImportCourse[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.json')) {
      toast.error('Seuls les fichiers JSON sont acceptés');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (!data.courses || !Array.isArray(data.courses)) {
          toast.error('Format invalide : le fichier doit contenir un tableau "courses"');
          return;
        }

        setCourses(data.courses);
        setFileName(file.name);
        setResult(null);
        toast.success(`${data.courses.length} cours détectés`);
      } catch {
        toast.error('Erreur de parsing JSON');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-cours.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template téléchargé !');
  };

  const handleImport = async () => {
    if (courses.length === 0) return;

    setIsImporting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-courses', {
        body: { courses }
      });

      if (error) throw error;

      setResult(data);
      
      if (data.success && data.errors.length === 0) {
        toast.success(`${data.coursesImported} cours importés avec succès !`);
      } else if (data.coursesImported > 0) {
        toast.warning(`${data.coursesImported} cours importés, ${data.errors.length} erreurs`);
      } else {
        toast.error('Aucun cours importé');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'import');
    } finally {
      setIsImporting(false);
    }
  };

  const levelLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé'
  };

  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileJson className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Template JSON</p>
              <p className="text-sm text-muted-foreground">Téléchargez le format attendu</p>
            </div>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
          ${dragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileInput}
        />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-lg font-medium mb-1">
          {fileName || 'Glissez votre fichier JSON ici'}
        </p>
        <p className="text-sm text-muted-foreground">
          ou cliquez pour sélectionner
        </p>
      </div>

      {/* Preview */}
      {courses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Aperçu ({courses.length} cours)</span>
              <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer {courses.length} cours
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {courses.map((course, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-2xl">{course.icon || '📚'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{course.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {course.cards?.length || 0} cartes • {course.category}
                      </p>
                    </div>
                    <Badge className={levelColors[course.level]}>
                      {levelLabels[course.level]}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className={result.success ? 'border-green-500/50' : 'border-red-500/50'}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              Résultat de l'import
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Cours importés:</span>
                <span className="ml-2 font-bold text-green-500">{result.coursesImported}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cartes créées:</span>
                <span className="ml-2 font-bold text-green-500">{result.cardsImported}</span>
              </div>
              {result.errors.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Erreurs:</span>
                  <span className="ml-2 font-bold text-red-500">{result.errors.length}</span>
                </div>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Erreurs détaillées
                </p>
                {result.errors.map((err, i) => (
                  <div key={i} className="text-sm p-2 rounded bg-red-500/10 text-red-400">
                    <strong>{err.courseTitle}:</strong> {err.error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
