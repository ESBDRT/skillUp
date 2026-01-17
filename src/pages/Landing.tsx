import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlanToggle from '@/components/landing/PlanToggle';
import TestimonialCard from '@/components/landing/TestimonialCard';
import PricingCard from '@/components/landing/PricingCard';
import FAQItem from '@/components/landing/FAQItem';

const landingContent = {
  individual: {
    testimonials: [
      {
        quote: "I learned **Python in 3 months** spending just 10 minutes a day. The micro-lessons fit perfectly into my busy schedule.",
        author: "Marie Laurent",
        role: "Software Developer"
      },
      {
        quote: "The spaced repetition helped me **retain 90%** of what I learned. I've never felt so confident with new material.",
        author: "Thomas Kramer",
        role: "Graduate Student"
      },
      {
        quote: "**Best investment** in my career development. I went from beginner to proficient in data science.",
        author: "Sophie Renard",
        role: "Marketing Analyst"
      }
    ],
    pricing: [
      {
        name: "Free",
        price: "€0",
        description: "Perfect for trying out micro-learning",
        features: [
          "**1 course** included",
          "Basic flashcards",
          "Progress tracking",
          "Mobile access"
        ]
      },
      {
        name: "Pro",
        price: "€9.99",
        period: "/month",
        description: "For dedicated learners who want it all",
        features: [
          "**Unlimited courses**",
          "AI-powered tutor",
          "**Spaced repetition** engine",
          "Progress sync across devices",
          "Offline access"
        ],
        highlighted: true
      },
      {
        name: "Lifetime",
        price: "€99",
        description: "One payment, forever access",
        features: [
          "**Everything in Pro**",
          "Priority support",
          "Early access to new features",
          "**No recurring fees**"
        ],
        ctaText: "Get Lifetime Access"
      }
    ],
    faq: [
      {
        question: "How long are the lessons?",
        answer: "Each lesson takes **5-10 minutes** to complete. They're designed to fit into your coffee break, commute, or any spare moment."
      },
      {
        question: "Can I learn offline?",
        answer: "**Yes, with Pro plan**. Download courses and learn anywhere without an internet connection."
      },
      {
        question: "What subjects are available?",
        answer: "We offer **50+ topics** from programming and data science to languages, design, and business skills."
      },
      {
        question: "How does spaced repetition work?",
        answer: "Our AI tracks what you've learned and shows you concepts **right before you'd forget them**. This scientifically-proven method maximizes retention."
      }
    ]
  },
  company: {
    testimonials: [
      {
        quote: "We **reduced training costs by 60%** with MicroLearn. Our employees actually complete their training now.",
        author: "Jean-Pierre Dubois",
        role: "CEO, TechCorp France"
      },
      {
        quote: "Employee engagement **increased by 85%** since adoption. The gamification keeps teams motivated.",
        author: "Anna Schmidt",
        role: "HR Director, StartupX"
      },
      {
        quote: "**ROI within 3 months** of implementation. The analytics dashboard helps us identify skill gaps instantly.",
        author: "Marc Lefebvre",
        role: "L&D Manager, BigCo"
      }
    ],
    pricing: [
      {
        name: "Team",
        price: "€29",
        period: "/user/month",
        description: "For growing teams up to 50 people",
        features: [
          "**Up to 50 users**",
          "Team analytics dashboard",
          "Custom learning paths",
          "Email support"
        ]
      },
      {
        name: "Business",
        price: "€19",
        period: "/user/month",
        description: "Best value for larger organizations",
        features: [
          "**Unlimited users**",
          "**SSO integration**",
          "Custom course creation",
          "Advanced analytics",
          "Priority support"
        ],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "Tailored for large enterprises",
        features: [
          "**Everything in Business**",
          "Dedicated account manager",
          "**API access**",
          "On-premise option",
          "Custom integrations"
        ],
        ctaText: "Contact Sales"
      }
    ],
    faq: [
      {
        question: "Can we create custom courses?",
        answer: "**Yes, with Business plan**. Our course builder lets you create branded content specific to your organization's needs."
      },
      {
        question: "Is there SSO integration?",
        answer: "**Yes, SAML and OAuth supported**. Integrate seamlessly with Okta, Azure AD, Google Workspace, and more."
      },
      {
        question: "How do we track employee progress?",
        answer: "Our **real-time analytics dashboard** shows completion rates, engagement metrics, skill progression, and identifies learning gaps."
      },
      {
        question: "What about data security?",
        answer: "We're **SOC 2 Type II certified** and GDPR compliant. Your data is encrypted at rest and in transit with enterprise-grade security."
      }
    ]
  }
};

const Landing = () => {
  const [planType, setPlanType] = useState<'individual' | 'company'>('individual');
  const navigate = useNavigate();
  const content = landingContent[planType];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MicroLearn</span>
          </div>
          <Button onClick={() => navigate('/dashboard')}>
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight"
          >
            Learn smarter,{' '}
            <span className="text-primary">not harder</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Micro-lessons powered by AI and spaced repetition. 
            <strong className="text-foreground"> Master any skill in just 10 minutes a day.</strong>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <PlanToggle planType={planType} onToggle={setPlanType} />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {planType === 'individual' 
              ? "For personal growth and self-directed learning" 
              : "For teams and organizations that invest in their people"}
          </motion.p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            key={`testimonials-title-${planType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
          >
            {planType === 'individual' ? 'Loved by learners' : 'Trusted by companies'}
          </motion.h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {planType === 'individual' 
              ? "Join thousands who've transformed their skills with micro-learning"
              : "Leading organizations trust us with their learning & development"}
          </p>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={planType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {content.testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            key={`pricing-title-${planType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
          >
            {planType === 'individual' ? 'Simple, transparent pricing' : 'Plans that scale with you'}
          </motion.h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {planType === 'individual' 
              ? "Start free, upgrade when you're ready"
              : "Volume discounts available for larger teams"}
          </p>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={planType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {content.pricing.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            key={`faq-title-${planType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
          >
            Frequently asked questions
          </motion.h2>
          <p className="text-muted-foreground text-center mb-12">
            {planType === 'individual' 
              ? "Everything you need to know about your learning journey"
              : "Common questions from L&D professionals"}
          </p>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={planType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {content.faq.map((item, index) => (
                <FAQItem key={index} {...item} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to start learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {planType === 'individual' 
              ? "Join over 100,000 learners. Start for free today."
              : "Book a demo and see how we can transform your L&D."}
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => navigate('/dashboard')}>
            {planType === 'individual' ? 'Start Learning Free' : 'Book a Demo'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MicroLearn</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MicroLearn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
