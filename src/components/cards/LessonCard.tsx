import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, ArrowRight, Youtube, Github, ExternalLink, FileText } from 'lucide-react';
import { Card, LessonSection, Resources } from '@/data/mockData';
import { Button } from '@/components/ui/button';

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
  const resources = card.resources;

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

  // Mark as completed when all sections are read (but don't auto-transition)
  useEffect(() => {
    if (readSections.size === sections.length && sections.length > 0 && !hasCompleted) {
      setHasCompleted(true);
      // Don't call onComplete automatically - wait for button click
    }
  }, [readSections.size, sections.length, hasCompleted]);

  const handleStartQuiz = () => {
    onComplete(card.xpReward);
  };

  const renderResourceSection = (resources: Resources) => {
    const hasResources = resources.youtube?.length || resources.github?.length || resources.articles?.length;
    
    if (!hasResources) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 pt-8 border-t border-border"
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
          <ExternalLink className="w-5 h-5 text-primary" />
          Ressources pour aller plus loin
        </h3>

        {/* YouTube Videos */}
        {resources.youtube && resources.youtube.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center gap-2 text-red-500 font-medium mb-3">
              <Youtube className="w-4 h-4" /> Vidéos YouTube
            </h4>
            <div className="grid gap-3">
              {resources.youtube.map((video, idx) => (
                <a
                  key={idx}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {video.title}
                    </p>
                    {video.source && (
                      <p className="text-sm text-muted-foreground truncate">{video.source}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* GitHub Repos */}
        {resources.github && resources.github.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center gap-2 text-foreground font-medium mb-3">
              <Github className="w-4 h-4" /> Repos GitHub
            </h4>
            <div className="grid gap-3">
              {resources.github.map((repo, idx) => (
                <a
                  key={idx}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {repo.title}
                    </p>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground truncate">{repo.description}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        {resources.articles && resources.articles.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center gap-2 text-blue-500 font-medium mb-3">
              <FileText className="w-4 h-4" /> Articles & Sites
            </h4>
            <div className="grid gap-3">
              {resources.articles.map((article, idx) => (
                <a
                  key={idx}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {article.title}
                    </p>
                    {article.source && (
                      <p className="text-sm text-muted-foreground truncate">{article.source}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

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
        
        {/* Resources Section */}
        {resources && renderResourceSection(resources)}
        
        {/* Quiz Button - appears when course is completed */}
        {hasCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Cours terminé !</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Prêt à tester vos connaissances ?
            </p>
            <Button 
              onClick={handleStartQuiz}
              size="lg"
              className="gap-2"
            >
              Passer au Quiz
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;