// Mock data for the micro-learning app

export interface Card {
  id: string;
  type: 'info' | 'quiz' | 'flashcard' | 'slider' | 'open-question';
  title?: string;
  content?: string;
  image?: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  flashcardBack?: string;
  sliderConfig?: {
    label: string;
    min: number;
    max: number;
    unit: string;
    description: string;
  };
  xpReward: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'expert';
  category: string;
  cards: Card[];
  totalXP: number;
  estimatedMinutes: number;
  isCompleted: boolean;
  isLocked: boolean;
  icon: string;
  prerequisiteId?: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  dailyGoalMinutes: number;
  todayMinutes: number;
  completedLessons: string[];
  level: number;
}

export const mockUser: UserProgress = {
  xp: 2450,
  streak: 7,
  dailyGoalMinutes: 15,
  todayMinutes: 8,
  completedLessons: ['lesson-1'],
  level: 5,
};

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Les Bases du Sommeil',
    description: 'Comprendre les cycles du sommeil et leur importance',
    level: 'beginner',
    category: 'Bien-être',
    icon: '🌙',
    isCompleted: true,
    isLocked: false,
    totalXP: 150,
    estimatedMinutes: 5,
    cards: [
      {
        id: 'card-1-1',
        type: 'info',
        title: 'Le sommeil : un besoin vital',
        content: 'Le sommeil représente environ un tiers de notre vie. Pendant cette période, notre corps et notre cerveau se régénèrent, consolidant les apprentissages de la journée.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop',
        xpReward: 10,
      },
      {
        id: 'card-1-2',
        type: 'info',
        title: 'Les cycles du sommeil',
        content: 'Une nuit est composée de 4 à 6 cycles de 90 minutes. Chaque cycle alterne entre sommeil léger, profond et paradoxal (REM).',
        xpReward: 10,
      },
      {
        id: 'card-1-3',
        type: 'quiz',
        title: 'Vérifions vos connaissances',
        content: 'Combien de cycles de sommeil avons-nous en moyenne par nuit ?',
        options: [
          { id: 'a', text: '2 à 3 cycles', isCorrect: false },
          { id: 'b', text: '4 à 6 cycles', isCorrect: true },
          { id: 'c', text: '8 à 10 cycles', isCorrect: false },
          { id: 'd', text: '1 seul long cycle', isCorrect: false },
        ],
        xpReward: 50,
      },
      {
        id: 'card-1-4',
        type: 'flashcard',
        title: 'Sommeil REM',
        content: 'Que signifie REM ?',
        flashcardBack: 'REM = Rapid Eye Movement (Mouvements Oculaires Rapides). C\'est la phase où nous rêvons le plus.',
        xpReward: 20,
      },
      {
        id: 'card-1-5',
        type: 'slider',
        title: 'Impact de la caféine',
        content: 'Découvrez comment la caféine affecte votre sommeil selon l\'heure de consommation.',
        sliderConfig: {
          label: 'Heure du café',
          min: 6,
          max: 22,
          unit: 'h',
          description: 'Consommer de la caféine après 14h peut retarder votre endormissement de 40 minutes en moyenne.',
        },
        xpReward: 15,
      },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Optimiser son Réveil',
    description: 'Techniques pour se réveiller en pleine forme',
    level: 'beginner',
    category: 'Bien-être',
    icon: '☀️',
    isCompleted: false,
    isLocked: false,
    totalXP: 200,
    estimatedMinutes: 7,
    prerequisiteId: 'lesson-1',
    cards: [
      {
        id: 'card-2-1',
        type: 'info',
        title: 'L\'importance de la lumière',
        content: 'La lumière naturelle du matin aide à réguler votre horloge biologique. Exposez-vous à la lumière dès le réveil pour supprimer la mélatonine.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
        xpReward: 10,
      },
      {
        id: 'card-2-2',
        type: 'quiz',
        title: 'Test rapide',
        content: 'Quelle hormone est responsable de la sensation de fatigue ?',
        options: [
          { id: 'a', text: 'Dopamine', isCorrect: false },
          { id: 'b', text: 'Adrénaline', isCorrect: false },
          { id: 'c', text: 'Mélatonine', isCorrect: true },
          { id: 'd', text: 'Sérotonine', isCorrect: false },
        ],
        xpReward: 50,
      },
      {
        id: 'card-2-3',
        type: 'open-question',
        title: 'Réflexion personnelle',
        content: 'Décrivez votre routine matinale actuelle. Quels éléments pourraient être améliorés selon ce que vous avez appris ?',
        xpReward: 30,
      },
    ],
  },
  {
    id: 'lesson-3',
    title: 'Nutrition & Énergie',
    description: 'Comment l\'alimentation affecte votre énergie',
    level: 'intermediate',
    category: 'Nutrition',
    icon: '🥗',
    isCompleted: false,
    isLocked: true,
    totalXP: 250,
    estimatedMinutes: 10,
    prerequisiteId: 'lesson-2',
    cards: [],
  },
  {
    id: 'lesson-4',
    title: 'Gestion du Stress',
    description: 'Techniques avancées de relaxation',
    level: 'intermediate',
    category: 'Mental',
    icon: '🧘',
    isCompleted: false,
    isLocked: true,
    totalXP: 300,
    estimatedMinutes: 12,
    prerequisiteId: 'lesson-3',
    cards: [],
  },
  {
    id: 'lesson-5',
    title: 'Performance Cognitive',
    description: 'Maximiser vos capacités mentales',
    level: 'expert',
    category: 'Mental',
    icon: '🧠',
    isCompleted: false,
    isLocked: true,
    totalXP: 400,
    estimatedMinutes: 15,
    prerequisiteId: 'lesson-4',
    cards: [],
  },
];

export const categories = [
  { id: 'wellness', name: 'Bien-être', icon: '💆', color: 'bg-emerald-500' },
  { id: 'nutrition', name: 'Nutrition', icon: '🍎', color: 'bg-orange-500' },
  { id: 'mental', name: 'Mental', icon: '🧠', color: 'bg-purple-500' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: 'bg-red-500' },
  { id: 'productivity', name: 'Productivité', icon: '📈', color: 'bg-blue-500' },
];
