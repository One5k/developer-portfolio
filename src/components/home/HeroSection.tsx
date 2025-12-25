import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const { t, direction } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 tech-grid opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <p className="text-lg md:text-xl text-muted-foreground mb-4 animate-fade-in">
            {t('home.greeting')}
          </p>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">{t('home.name')}</span>
          </h1>

          {/* Title with Typing Effect */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="inline-block px-4 py-2 rounded-full glass-card text-lg md:text-xl font-mono text-primary">
              {'>'} {t('home.title')}
              <span className="animate-blink">_</span>
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {t('home.bio')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              asChild
              size="lg"
              className="btn-gradient rounded-full px-8 gap-2 group"
            >
              <Link to="/projects">
                {t('home.cta.projects')}
                <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${direction === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 glass-card border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Link to="/contact">
                {t('home.cta.contact')}
              </Link>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass-card text-muted-foreground hover:text-primary hover:glow-primary transition-all duration-300"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass-card text-muted-foreground hover:text-primary hover:glow-primary transition-all duration-300"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">{t('home.scroll')}</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Floating Code Blocks - Decorative */}
      <div className="hidden lg:block absolute top-1/3 left-10 glass-card rounded-lg p-4 animate-float opacity-60">
        <pre className="text-xs font-mono text-primary">
          <code>{`const dev = {
  passion: true,
  coffee: "∞"
};`}</code>
        </pre>
      </div>

      <div className="hidden lg:block absolute bottom-1/3 right-10 glass-card rounded-lg p-4 animate-float opacity-60" style={{ animationDelay: '2s' }}>
        <pre className="text-xs font-mono text-accent">
          <code>{`while (alive) {
  eat();
  sleep();
  code();
}`}</code>
        </pre>
      </div>
    </section>
  );
};

export default HeroSection;
