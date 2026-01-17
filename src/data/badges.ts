// Badge definitions for the gamification system

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'courses' | 'brain' | 'special';
  requirement: number;
  color: string;
}

export const badges: Badge[] = [
  // Streak badges
  {
    id: 'streak-3',
    name: 'Débutant Assidu',
    description: '3 jours consécutifs',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'streak-7',
    name: 'Semaine Parfaite',
    description: '7 jours consécutifs',
    icon: '⚡',
    category: 'streak',
    requirement: 7,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'streak-30',
    name: 'Mois de Feu',
    description: '30 jours consécutifs',
    icon: '🌟',
    category: 'streak',
    requirement: 30,
    color: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'streak-100',
    name: 'Centurion',
    description: '100 jours consécutifs',
    icon: '👑',
    category: 'streak',
    requirement: 100,
    color: 'from-purple-400 to-pink-500',
  },

  // XP badges
  {
    id: 'xp-500',
    name: 'Première Étape',
    description: '500 XP accumulés',
    icon: '⭐',
    category: 'xp',
    requirement: 500,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'xp-2500',
    name: 'Apprenti Éclairé',
    description: '2500 XP accumulés',
    icon: '💫',
    category: 'xp',
    requirement: 2500,
    color: 'from-indigo-400 to-blue-500',
  },
  {
    id: 'xp-10000',
    name: 'Maître du Savoir',
    description: '10 000 XP accumulés',
    icon: '🏆',
    category: 'xp',
    requirement: 10000,
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'xp-50000',
    name: 'Légende',
    description: '50 000 XP accumulés',
    icon: '💎',
    category: 'xp',
    requirement: 50000,
    color: 'from-purple-400 to-indigo-500',
  },

  // Course badges
  {
    id: 'courses-1',
    name: 'Premier Pas',
    description: '1 cours terminé',
    icon: '📖',
    category: 'courses',
    requirement: 1,
    color: 'from-green-400 to-emerald-500',
  },
  {
    id: 'courses-5',
    name: 'Étudiant Curieux',
    description: '5 cours terminés',
    icon: '📚',
    category: 'courses',
    requirement: 5,
    color: 'from-teal-400 to-green-500',
  },
  {
    id: 'courses-20',
    name: 'Érudit',
    description: '20 cours terminés',
    icon: '🎓',
    category: 'courses',
    requirement: 20,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'courses-50',
    name: 'Encyclopédie Vivante',
    description: '50 cours terminés',
    icon: '🧙',
    category: 'courses',
    requirement: 50,
    color: 'from-violet-400 to-purple-500',
  },

  // Brain/Memory badges
  {
    id: 'brain-10',
    name: 'Mémoire Active',
    description: '10 concepts mémorisés',
    icon: '🧠',
    category: 'brain',
    requirement: 10,
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 'brain-50',
    name: 'Cerveau en Forme',
    description: '50 concepts mémorisés',
    icon: '💡',
    category: 'brain',
    requirement: 50,
    color: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'brain-100',
    name: 'Super Mémoire',
    description: '100 concepts mémorisés',
    icon: '🚀',
    category: 'brain',
    requirement: 100,
    color: 'from-rose-400 to-red-500',
  },

  // Special badges
  {
    id: 'special-creator',
    name: 'Créateur',
    description: 'Créer son premier cours',
    icon: '✨',
    category: 'special',
    requirement: 1,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'special-perfect',
    name: 'Sans Faute',
    description: 'Terminer un quiz sans erreur',
    icon: '💯',
    category: 'special',
    requirement: 1,
    color: 'from-lime-400 to-green-500',
  },
  {
    id: 'special-night',
    name: 'Noctambule',
    description: 'Étudier après minuit',
    icon: '🦉',
    category: 'special',
    requirement: 1,
    color: 'from-slate-400 to-gray-600',
  },
  {
    id: 'special-early',
    name: 'Lève-tôt',
    description: 'Étudier avant 6h du matin',
    icon: '🌅',
    category: 'special',
    requirement: 1,
    color: 'from-orange-300 to-yellow-500',
  },
];

export const getBadgeProgress = (
  badge: Badge,
  stats: { xp: number; streak: number; coursesCompleted: number; conceptsLearned: number; coursesCreated: number }
): number => {
  switch (badge.category) {
    case 'streak':
      return Math.min((stats.streak / badge.requirement) * 100, 100);
    case 'xp':
      return Math.min((stats.xp / badge.requirement) * 100, 100);
    case 'courses':
      return Math.min((stats.coursesCompleted / badge.requirement) * 100, 100);
    case 'brain':
      return Math.min((stats.conceptsLearned / badge.requirement) * 100, 100);
    case 'special':
      if (badge.id === 'special-creator') {
        return stats.coursesCreated > 0 ? 100 : 0;
      }
      return 0; // Special badges need specific tracking
    default:
      return 0;
  }
};

export const isUnlocked = (
  badge: Badge,
  stats: { xp: number; streak: number; coursesCompleted: number; conceptsLearned: number; coursesCreated: number }
): boolean => {
  return getBadgeProgress(badge, stats) >= 100;
};
