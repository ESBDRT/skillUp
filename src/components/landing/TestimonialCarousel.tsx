import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Users, TrendingUp, Award } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  language: string;
  planType: string;
}

const TestimonialCarousel = ({ testimonials, language, planType }: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-advance testimonials
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);
  
  // Reset to first when content changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [language, planType]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];
  
  const stats = planType === 'individual' 
    ? [
        { icon: Users, value: '100K+', label: language === 'en' ? 'Learners' : 'Apprenants' },
        { icon: Star, value: '4.9', label: language === 'en' ? 'Rating' : 'Note' },
        { icon: TrendingUp, value: '92%', label: language === 'en' ? 'Completion' : 'Complétion' },
        { icon: Award, value: '50+', label: language === 'en' ? 'Topics' : 'Sujets' },
      ]
    : [
        { icon: Users, value: '500+', label: language === 'en' ? 'Companies' : 'Entreprises' },
        { icon: Star, value: '4.8', label: language === 'en' ? 'Rating' : 'Note' },
        { icon: TrendingUp, value: '85%', label: language === 'en' ? 'Engagement' : 'Engagement' },
        { icon: Award, value: '60%', label: language === 'en' ? 'Cost Saved' : 'Économies' },
      ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={`${planType}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
          >
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Main testimonial card */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        
        <div className="relative min-h-[280px] flex items-center justify-center p-6 md:p-10 rounded-2xl bg-card/30 border border-border/50 backdrop-blur-sm">
          {/* Large decorative quote */}
          <Quote className="absolute top-4 left-4 md:top-6 md:left-6 w-12 h-12 md:w-16 md:h-16 text-primary/10" />
          
          {/* Star rating */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${planType}-${language}-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center px-4 md:px-8"
            >
              <p 
                className="text-lg md:text-2xl text-foreground leading-relaxed mb-8 max-w-2xl mx-auto font-medium"
                dangerouslySetInnerHTML={{ 
                  __html: current.quote.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold">$1</strong>') 
                }}
              />
              
              <div className="flex flex-col items-center gap-3">
                {/* Avatar with gradient ring */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-600 blur-sm opacity-50" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-2 border-primary/30">
                    <span className="text-xl font-bold text-primary">
                      {current.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-lg">{current.author}</p>
                  <p className="text-sm text-muted-foreground">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {/* Prev button */}
        <button
          onClick={goPrev}
          className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all border border-border/50"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots with progress indicator */}
        <div className="flex items-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative"
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary scale-110' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`} />
              {index === currentIndex && !isPaused && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all border border-border/50"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Trust badges - Enhanced company logos */}
      <div className="mt-12 pt-8 border-t border-border/30">
        <p className="text-center text-sm text-muted-foreground mb-6 font-medium">
          {planType === 'company' ? (language === 'en' ? 'Trusted by industry leaders' : 'Approuvé par les leaders du marché') : (language === 'en' ? 'Featured in' : 'Présent dans')}
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          {[
            { letter: 'G', name: 'Google', color: 'from-blue-500 to-green-500' },
            { letter: 'M', name: 'Microsoft', color: 'from-blue-600 to-cyan-500' },
            { letter: 'A', name: 'Apple', color: 'from-gray-600 to-gray-400' },
            { letter: 'S', name: 'Spotify', color: 'from-green-500 to-green-400' },
          ].map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 group cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center font-bold text-white text-lg shadow-md group-hover:scale-110 transition-transform duration-200`}>
                {company.letter}
              </div>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                {company.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
