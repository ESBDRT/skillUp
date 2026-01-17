import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Card, LessonSection } from '@/data/mockData';

interface LessonCardProps {
  card: Card;
  onComplete: (xp: number) => void;
}

// Different layout styles for variety
type LayoutStyle = 'image-top' | 'image-left' | 'image-right' | 'text-only' | 'image-full';

const getLayoutStyle = (index: number, hasImage: boolean): LayoutStyle => {
  if (!hasImage) return 'text-only';
  
  // Vary layouts based on index
  const layouts: LayoutStyle[] = ['image-top', 'image-left', 'image-right', 'image-full'];
  return layouts[index % layouts.length];
};

const LessonCard = ({ card, onComplete }: LessonCardProps) => {
  const [hasCompleted, setHasCompleted] = useState(false);
  const [readSections, setReadSections] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const sections = card.sections || [];

  // Track which sections have been scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setReadSections(prev => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [sections.length]);

  // Complete when all sections are read
  useEffect(() => {
    if (readSections.size === sections.length && sections.length > 0 && !hasCompleted) {
      setHasCompleted(true);
      onComplete(card.xpReward);
    }
  }, [readSections.size, sections.length, hasCompleted, onComplete, card.xpReward]);

  const renderSection = (section: LessonSection, index: number) => {
    const layout = getLayoutStyle(index, !!section.imageUrl);
    const isRead = readSections.has(index);
    
    return (
      <motion.div
        key={section.id}
        ref={el => sectionRefs.current[index] = el}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative"
      >
        {/* Section number indicator */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${isRead ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            {isRead ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
          </div>
          <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
        </div>

        {/* Content based on layout */}
        {layout === 'text-only' && (
          <div className="pl-11">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {section.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {layout === 'image-top' && (
          <div className="pl-11 space-y-4">
            {section.imageUrl && (
              <motion.div
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="w-full aspect-video object-cover"
                />
              </motion.div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {section.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {layout === 'image-left' && (
          <div className="pl-11 grid md:grid-cols-2 gap-6 items-start">
            {section.imageUrl && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="w-full aspect-square object-cover"
                />
              </motion.div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {section.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {layout === 'image-right' && (
          <div className="pl-11 grid md:grid-cols-2 gap-6 items-start">
            <div className="prose prose-lg dark:prose-invert max-w-none order-2 md:order-1">
              {section.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.imageUrl && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-lg order-1 md:order-2"
              >
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="w-full aspect-square object-cover"
                />
              </motion.div>
            )}
          </div>
        )}

        {layout === 'image-full' && (
          <div className="pl-11 space-y-4">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {section.content.split('\n\n').slice(0, 1).map((paragraph, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.imageUrl && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-lg -mx-4 md:mx-0"
              >
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="w-full aspect-[21/9] object-cover"
                />
              </motion.div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {section.content.split('\n\n').slice(1).map((paragraph, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Aucun contenu disponible</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-h-full overflow-hidden">
      {/* Course Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 pb-4 border-b border-border"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{card.title}</h1>
            {card.content && (
              <p className="text-sm text-muted-foreground mt-1">{card.content}</p>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(readSections.size / sections.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {readSections.size}/{sections.length}
          </span>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-12 pb-8 pr-2"
      >
        {sections.map((section, index) => renderSection(section, index))}
        
        {/* End of course indicator */}
        {hasCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Cours terminé !</h3>
            <p className="text-sm text-muted-foreground">
              Swipez à droite pour passer au quiz →
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;
