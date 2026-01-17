import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlanToggle from '@/components/landing/PlanToggle';
import TestimonialCard from '@/components/landing/TestimonialCard';
import PricingCard from '@/components/landing/PricingCard';
import FAQItem from '@/components/landing/FAQItem';
import LanguageToggle from '@/components/landing/LanguageToggle';
import { translations, type Language, type PlanType } from '@/data/landingTranslations';

const Landing = () => {
  const [planType, setPlanType] = useState<PlanType>('individual');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('landing-language');
    return (saved === 'fr' ? 'fr' : 'en') as Language;
  });
  const navigate = useNavigate();
  
  const t = translations[language];
  const content = t.content[planType];

  useEffect(() => {
    localStorage.setItem('landing-language', language);
  }, [language]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MicroLearn</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle language={language} onToggle={setLanguage} />
            <Button onClick={() => navigate('/dashboard')} className="shadow-lg shadow-primary/20">
              {t.header.cta} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              ✨ AI-Powered Micro-Learning
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight"
          >
            {t.hero.title}{' '}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[size:200%] animate-gradient">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t.hero.subtitle}
            <strong className="text-foreground block mt-2"> {t.hero.subtitleBold}</strong>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <PlanToggle 
              planType={planType} 
              onToggle={setPlanType} 
              labels={t.planToggle}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            {planType === 'individual' ? t.hero.individualDesc : t.hero.companyDesc}
          </motion.p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-6">
        {/* Section divider wave */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-muted/30" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`testimonials-header-${planType}-${language}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
                {planType === 'individual' ? t.testimonials.individualTitle : t.testimonials.companyTitle}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-lg">
                {planType === 'individual' ? t.testimonials.individualSubtitle : t.testimonials.companySubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${planType}-${language}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {content.testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`pricing-header-${planType}-${language}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
                {planType === 'individual' ? t.pricing.individualTitle : t.pricing.companyTitle}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-lg">
                {planType === 'individual' ? t.pricing.individualSubtitle : t.pricing.companySubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${planType}-${language}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6 items-start"
            >
              {content.pricing.map((plan, index) => (
                <PricingCard key={index} {...plan} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`faq-header-${planType}-${language}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
                {t.faq.title}
              </h2>
              <p className="text-muted-foreground text-center mb-12 text-lg">
                {planType === 'individual' ? t.faq.individualSubtitle : t.faq.companySubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${planType}-${language}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-lg"
            >
              {content.faq.map((item, index) => (
                <FAQItem key={index} {...item} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-3xl rounded-full" />
            
            <div className="relative bg-card border border-border rounded-3xl p-12 shadow-xl">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                {t.cta.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {planType === 'individual' ? t.cta.individualSubtitle : t.cta.companySubtitle}
              </p>
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                onClick={() => navigate('/dashboard')}
              >
                {planType === 'individual' ? t.cta.individualButton : t.cta.companyButton}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MicroLearn</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-primary transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-primary transition-colors">{t.footer.contact}</a>
          </div>
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
