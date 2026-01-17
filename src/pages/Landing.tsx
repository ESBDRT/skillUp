import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlanToggle from '@/components/landing/PlanToggle';
import TestimonialCarousel from '@/components/landing/TestimonialCarousel';
import PricingCard from '@/components/landing/PricingCard';
import FAQItem from '@/components/landing/FAQItem';
import LanguageToggle from '@/components/landing/LanguageToggle';
import { ThemeToggle } from '@/components/landing/ThemeToggle';
import { UseCaseCard } from '@/components/landing/UseCaseCard';
import CoursePreview from '@/components/landing/CoursePreview';
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
  return <div className="min-h-screen bg-background overflow-hidden">
      {/* Depth background layers */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
        
        {/* Layered depth gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,hsl(270_75%_60%/0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_20%_80%,hsl(var(--primary)/0.06),transparent)]" />
        
        {/* Subtle vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.4)_100%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SquizzUp</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5
        }} className="inline-block mb-6">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              ✨ AI-Powered Micro-Learning
            </span>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div key={`hero-content-${language}`} initial={{
            opacity: 0,
            y: 15,
            filter: 'blur(8px)'
          }} animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }} exit={{
            opacity: 0,
            y: -15,
            filter: 'blur(8px)'
          }} transition={{
            duration: 0.4,
            ease: 'easeOut'
          }}>
              <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight">
                {t.hero.title}{' '}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[size:200%] animate-gradient">
                  {t.hero.titleHighlight}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                {t.hero.subtitle}
                <strong className="text-foreground block mt-2"> {t.hero.subtitleBold}</strong>
              </p>
            </motion.div>
          </AnimatePresence>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="mb-6">
            <PlanToggle planType={planType} onToggle={setPlanType} labels={t.planToggle} />
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.p key={`hero-desc-${planType}-${language}`} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3
          }} className="text-sm text-muted-foreground">
              {planType === 'individual' ? t.hero.individualDesc : t.hero.companyDesc}
            </motion.p>
          </AnimatePresence>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="mt-8">
            <Button size="lg" className="text-lg px-10 py-6 shadow-xl shadow-primary/25 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all hover:scale-105" onClick={() => navigate('/dashboard')}>
              {planType === 'individual' ? t.cta.individualButton : t.cta.companyButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`usecases-header-${planType}-${language}`} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {planType === 'individual' ? t.useCases.individualTitle : t.useCases.companyTitle}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {planType === 'individual' ? t.useCases.individualSubtitle : t.useCases.companySubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div key={`usecases-${planType}-${language}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.3
          }} className="grid md:grid-cols-[1.2fr_1fr] gap-8">
              {/* Featured use case */}
              <UseCaseCard {...content.useCases[0]} index={0} variant="featured" />
              
              {/* Stacked compact use cases */}
              <div className="flex flex-col gap-6">
                {content.useCases.slice(1).map((useCase, index) => <UseCaseCard key={index + 1} {...useCase} index={index + 1} variant="compact" />)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <AnimatePresence mode="wait">
                <motion.div key={`preview-text-${language}`} initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -10
              }}>
                  <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                    {t.coursePreview.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {t.coursePreview.subtitle}
                  </p>
                  
                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {t.coursePreview.features.map((feature, index) => {
                    const icons = [BookOpen, Brain, Zap];
                    const Icon = icons[index % icons.length];
                    return <motion.div key={index} initial={{
                      opacity: 0,
                      scale: 0.9
                    }} whileInView={{
                      opacity: 1,
                      scale: 1
                    }} viewport={{
                      once: true
                    }} transition={{
                      delay: index * 0.1
                    }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{feature}</span>
                        </motion.div>;
                  })}
                  </div>
                  
                  <Button onClick={() => navigate('/dashboard')} size="lg" className="shadow-lg shadow-primary/20">
                    {language === 'en' ? 'Try it yourself' : 'Essayez vous-même'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Right side - Phone mockup */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
              <CoursePreview language={language} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`testimonials-header-${planType}-${language}`} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }}>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
                {planType === 'individual' ? t.testimonials.individualTitle : t.testimonials.companyTitle}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-lg">
                {planType === 'individual' ? t.testimonials.individualSubtitle : t.testimonials.companySubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          {/* Single featured testimonial carousel */}
          <TestimonialCarousel testimonials={content.testimonials} language={language} planType={planType} />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`pricing-header-${planType}-${language}`} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }}>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
                {planType === 'individual' ? t.pricing.individualTitle : t.pricing.companyTitle}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-lg">
                {planType === 'individual' ? t.pricing.individualSubtitle : t.pricing.companySubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div key={`${planType}-${language}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.3
          }} className="grid md:grid-cols-3 gap-6 items-start">
              {content.pricing.map((plan, index) => <PricingCard key={index} {...plan} index={index} />)}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section - WIDER */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`faq-header-${planType}-${language}`} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }}>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
                {t.faq.title}
              </h2>
              <p className="text-muted-foreground text-center mb-12 text-lg">
                {planType === 'individual' ? t.faq.individualSubtitle : t.faq.companySubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div key={`${planType}-${language}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.3
          }} className="space-y-0">
              {content.faq.map((item, index) => <FAQItem key={index} {...item} index={index} />)}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Depth background for CTA */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/50 to-purple-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(270_75%_60%/0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`cta-${planType}-${language}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.4
          }} className="space-y-8">
              {/* Decorative badge */}
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {language === 'en' ? 'No credit card required' : 'Aucune carte requise'}
                </span>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight">
                {t.cta.title}
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {planType === 'individual' ? t.cta.individualSubtitle : t.cta.companySubtitle}
              </p>
              
              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-3">
                {[language === 'en' ? '✓ Free forever plan' : '✓ Plan gratuit à vie', language === 'en' ? '✓ Cancel anytime' : '✓ Annulez à tout moment', language === 'en' ? '✓ Instant access' : '✓ Accès instantané'].map((feature, i) => <motion.span key={i} initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.2 + i * 0.1
              }} className="px-4 py-2 rounded-full bg-card/50 border border-border/50 text-sm text-muted-foreground backdrop-blur-sm">
                    {feature}
                  </motion.span>)}
              </div>
              
              {/* CTA Button with glow effect */}
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-purple-600 blur-xl opacity-50 animate-pulse" />
                <Button size="lg" className="relative text-lg px-14 py-8 shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all hover:scale-105 rounded-xl" onClick={() => navigate('/dashboard')}>
                  {planType === 'individual' ? t.cta.individualButton : t.cta.companyButton}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
              
              {/* Social proof */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {['M', 'S', 'T', 'A'].map((initial, i) => <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 border-2 border-background flex items-center justify-center text-sm font-bold text-primary">
                      {initial}
                    </div>)}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">1,247</span> {language === 'en' ? 'learners joined this week' : 'apprenants cette semaine'}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
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
    </div>;
};
export default Landing;