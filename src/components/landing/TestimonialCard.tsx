import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  index?: number;
}

const TestimonialCard = ({ quote, author, role, index = 0 }: TestimonialCardProps) => {
  const accentColors = [
    'from-primary/20 to-primary/5',
    'from-purple-500/20 to-purple-500/5',
    'from-emerald-500/20 to-emerald-500/5',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 overflow-hidden"
    >
      {/* Decorative gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColors[index % 3]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Large quote mark decoration */}
      <div className="absolute -top-2 -left-2 text-8xl font-serif text-primary/10 select-none pointer-events-none leading-none">
        "
      </div>
      
      <div className="relative z-10">
        <p 
          className="text-foreground text-lg leading-relaxed mb-6 relative"
          dangerouslySetInnerHTML={{ __html: quote.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold">$1</strong>') }}
        />
        
        <div className="flex items-center gap-3">
          {/* Avatar with ring animation */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
              <span className="text-primary font-bold text-sm">
                {author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          
          <div>
            <p className="font-bold text-foreground">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
