import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

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

  return (
    <div className="relative">
      {/* Main testimonial */}
      <div className="relative min-h-[280px] flex items-center justify-center">
        {/* Large decorative quote */}
        <Quote className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 text-primary/10" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${planType}-${language}-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center px-4 md:px-12 pt-8"
          >
            <p 
              className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ 
                __html: current.quote.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>') 
              }}
            />
            
            <div className="flex flex-col items-center gap-2">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                <span className="text-primary font-bold">
                  {current.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{current.author}</p>
                <p className="text-sm text-muted-foreground">{current.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {/* Prev button */}
        <button
          onClick={goPrev}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;