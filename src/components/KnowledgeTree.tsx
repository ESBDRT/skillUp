import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, ChevronRight } from 'lucide-react';
import { Lesson } from '@/data/mockData';

interface KnowledgeTreeProps {
  lessons: Lesson[];
}

const KnowledgeTree = ({ lessons }: KnowledgeTreeProps) => {
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-level-beginner';
      case 'intermediate': return 'bg-level-intermediate';
      case 'expert': return 'bg-level-expert';
      default: return 'bg-primary';
    }
  };

  const getLevelBgColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-level-beginner/10';
      case 'intermediate': return 'bg-level-intermediate/10';
      case 'expert': return 'bg-level-expert/10';
      default: return 'bg-primary/10';
    }
  };

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => (
        <div key={lesson.id} className="relative">
          {/* Connector line */}
          {index < lessons.length - 1 && (
            <div className="absolute left-8 top-16 w-0.5 h-8 bg-border" />
          )}

          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !lesson.isLocked && navigate(`/course/${lesson.id}`)}
            disabled={lesson.isLocked}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
              lesson.isLocked
                ? 'bg-muted opacity-60 cursor-not-allowed'
                : lesson.isCompleted
                ? 'bg-success/10 border border-success/20'
                : 'bg-card border border-border hover:border-primary shadow-card'
            }`}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              lesson.isLocked
                ? 'bg-muted-foreground/10'
                : lesson.isCompleted
                ? 'bg-success/20'
                : getLevelBgColor(lesson.level)
            }`}>
              {lesson.isLocked ? (
                <Lock className="w-5 h-5 text-muted-foreground" />
              ) : lesson.isCompleted ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                lesson.icon
              )}
            </div>

            {/* Content */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${
                  lesson.isLocked ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {lesson.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  lesson.isLocked
                    ? 'bg-muted-foreground/10 text-muted-foreground'
                    : getLevelColor(lesson.level) + ' text-white'
                }`}>
                  {lesson.level === 'beginner' ? 'Débutant' : 
                   lesson.level === 'intermediate' ? 'Inter.' : 'Expert'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {lesson.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>⚡ {lesson.totalXP} XP</span>
                <span>⏱️ {lesson.estimatedMinutes} min</span>
              </div>
            </div>

            {/* Arrow */}
            {!lesson.isLocked && (
              <ChevronRight className={`w-5 h-5 ${
                lesson.isCompleted ? 'text-success' : 'text-muted-foreground'
              }`} />
            )}
          </motion.button>
        </div>
      ))}
    </div>
  );
};

export default KnowledgeTree;
