import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/data/mockData';
interface InfoCardProps {
  card: Card;
  slideNumber?: number;
  totalSlides?: number;
}
const InfoCard = ({
  card,
  slideNumber,
  totalSlides
}: InfoCardProps) => {
  // Get emoji based on card title or content for visual header
  const getHeaderEmoji = () => {
    const title = card.title.toLowerCase();
    if (title.includes('cerveau') || title.includes('brain') || title.includes('neuron') || title.includes('mémoire')) return '🧠';
    if (title.includes('coeur') || title.includes('heart')) return '❤️';
    if (title.includes('science') || title.includes('chimie')) return '🔬';
    if (title.includes('histoire') || title.includes('history')) return '📜';
    if (title.includes('tech') || title.includes('code') || title.includes('program')) return '💻';
    if (title.includes('art') || title.includes('peinture')) return '🎨';
    if (title.includes('musique') || title.includes('music')) return '🎵';
    if (title.includes('nature') || title.includes('plante') || title.includes('photo')) return '🌿';
    if (title.includes('espace') || title.includes('space')) return '🚀';
    if (title.includes('math') || title.includes('calcul')) return '📐';
    if (title.includes('langue') || title.includes('language')) return '📝';
    if (title.includes('finance') || title.includes('argent')) return '💰';
    if (title.includes('santé') || title.includes('health')) return '🏥';
    if (title.includes('sport') || title.includes('exercice')) return '🏃';
    if (title.includes('cuisine') || title.includes('food')) return '🍳';
    if (title.includes('voiture') || title.includes('car')) return '🚗';
    if (title.includes('moteur') || title.includes('engine')) return '⚙️';
    if (title.includes('lumière') || title.includes('light')) return '💡';
    if (title.includes('sommeil') || title.includes('sleep')) return '😴';
    if (title.includes('eau') || title.includes('water')) return '💧';
    if (title.includes('énergie') || title.includes('energy')) return '⚡';
    return '📚';
  };

  // Format content for better markdown display
  const formatContent = (content: string) => {
    if (!content) return '';

    // If content doesn't have markdown, add line breaks after sentences for better readability
    if (!content.includes('\n') && !content.includes('**') && !content.includes('- ')) {
      return content.replace(/\. ([A-ZÀ-ÿ])/g, '.\n\n$1').replace(/: ([A-ZÀ-ÿ])/g, ':\n\n$1');
    }
    return content;
  };
  return <div className="flex-1 flex flex-col h-full">
      {/* Slide indicator */}
      {slideNumber && totalSlides && <div className="text-[10px] sm:text-xs text-muted-foreground mb-2 text-center">
          {slideNumber} / {totalSlides}
        </div>}

      {/* Header with emoji - compact and responsive */}
      <motion.div initial={{
      scale: 0.95,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl sm:rounded-2xl">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl sm:text-3xl">{getHeaderEmoji()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="sm:text-lg md:text-xl font-bold text-foreground leading-tight break-words hyphens-auto line-clamp-2 text-xl">
            {card.title}
          </h2>
        </div>
      </motion.div>

      {/* Content section - takes remaining space */}
      <motion.div initial={{
      y: 20,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      delay: 0.1
    }} className="flex-1 flex flex-col overflow-y-auto scroll-touch">
        <div className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown components={{
          p: ({
            children
          }) => <p className="mb-3 sm:mb-4 sm:text-base text-muted-foreground leading-relaxed text-lg">
                  {children}
                </p>,
          strong: ({
            children
          }) => <strong className="text-foreground font-bold bg-primary/10 px-0.5 sm:px-1 rounded">
                  {children}
                </strong>,
          em: ({
            children
          }) => <em className="text-primary font-medium not-italic">{children}</em>,
          ul: ({
            children
          }) => <ul className="list-disc list-outside ml-3 sm:ml-4 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
                  {children}
                </ul>,
          ol: ({
            children
          }) => <ol className="list-decimal list-outside ml-3 sm:ml-4 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
                  {children}
                </ol>,
          li: ({
            children
          }) => <li className="text-muted-foreground leading-relaxed text-sm sm:text-base">{children}</li>,
          h3: ({
            children
          }) => <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mt-3 sm:mt-4 mb-1.5 sm:mb-2 flex items-center gap-2">
                  <span className="w-0.5 sm:w-1 h-3 sm:h-4 bg-primary rounded-full"></span>
                  {children}
                </h3>,
          blockquote: ({
            children
          }) => <div className="bg-gradient-to-r from-primary/15 to-primary/5 border-l-4 border-primary rounded-r-lg sm:rounded-r-xl p-3 sm:p-4 my-3 sm:my-4 shadow-sm">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl flex-shrink-0">💡</span>
                    <div className="flex-1 text-xs sm:text-sm md:text-base text-foreground font-medium">
                      {children}
                    </div>
                  </div>
                </div>
        }}>
            {formatContent(card.content)}
          </ReactMarkdown>
        </div>
      </motion.div>

      {/* Navigation hint */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.3
    }} className="pt-3 sm:pt-4 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tapez à droite pour continuer →
        </p>
      </motion.div>
    </div>;
};
export default InfoCard;