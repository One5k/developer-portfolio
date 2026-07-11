import React, { useEffect, useState } from 'react';
import { ArrowRight, Github, Linkedin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { heroApi, profileApi } from '@/lib/api';

const HeroSection: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const [heroData, setHeroData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, profileRes] = await Promise.all([
          heroApi.getHero(),
          profileApi.getProfile()
        ]);
        setHeroData(heroRes.hero);
        setProfileData(profileRes.profile);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Premium Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 section-container text-center pt-20 w-full">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Avatar skeleton */}
            <div className="mb-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted animate-pulse" />
            {/* Eyebrow skeleton */}
            <div className="h-4 w-32 bg-muted mb-4 animate-pulse rounded" />
            {/* Name/Title skeleton */}
            <div className="h-16 md:h-20 w-3/4 bg-muted mb-6 animate-pulse rounded" />
            {/* Subtitle skeleton */}
            <div className="h-8 w-1/2 bg-muted mb-8 animate-pulse rounded" />
            {/* Bio skeleton */}
            <div className="h-4 w-2/3 bg-muted mb-2 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted mb-10 animate-pulse rounded" />
            {/* Buttons skeleton */}
            <div className="flex gap-4">
              <div className="h-12 w-36 bg-muted animate-pulse rounded-none" />
              <div className="h-12 w-36 bg-muted animate-pulse rounded-none" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to defaults if loading or error, but ideally valid seed data should be present
  const greeting = heroData 
    ? (language === 'ar' ? heroData.greeting_ar : heroData.greeting_en)
    : t('home.greeting');
    
  const title = heroData 
    ? (language === 'ar' ? heroData.title_ar : heroData.title_en)
    : t('home.name');

  const subtitle = heroData
    ? (language === 'ar' ? heroData.subtitle_ar : heroData.subtitle_en)
    : t('home.title');

  const description = heroData
    ? (language === 'ar' ? heroData.description_ar : heroData.description_en)
    : t('home.bio');
    
  // Combined social links from profile data
  const socialLinks = [
    { 
      icon: Github, 
      href: profileData?.github_url, 
      show: !!profileData?.github_url 
    },
    { 
      icon: Linkedin, 
      href: profileData?.linkedin_url, 
      show: !!profileData?.linkedin_url 
    }
  ].filter(link => link.show);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const getWhatsAppUrl = () => {
    if (!profileData?.phone) return 'https://wa.me/967773703388';
    const cleanPhone = profileData.phone.replace(/[+\s\-()]/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Premium Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 section-container text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image / Avatar */}
          {heroData?.hero_image_url && (
            <div className="mb-8 flex justify-center animate-fade-in">
              <div className="relative group">
                {/* Glowing ambient background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-50 group-hover:opacity-75 transition duration-500" />
                <img
                  src={heroData.hero_image_url}
                  alt={title}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-2xl"
                />
              </div>
            </div>
          )}

          {/* Greeting Eyebrow (Distinctive, not generic numbers) */}
          <p className="text-sm uppercase tracking-[0.25em] text-primary mb-4 font-bold">
            {greeting}
          </p>

          {/* Large Name/Title */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-foreground mb-6 font-display">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl font-light text-muted-foreground mb-8 tracking-wide">
            {subtitle}
          </p>

          {/* Bio Description */}
          <p className="text-base md:text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="btn-premium rounded-none px-8 py-6 gap-2 group cursor-pointer"
              onClick={scrollToProjects}
            >
              {t('home.cta.projects')}
              <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${direction === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none border-border hover:bg-secondary hover:text-foreground px-8 py-6 text-muted-foreground cursor-pointer"
            >
              <a 
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('home.cta.contact')}
              </a>
            </Button>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors duration-300">
          <span className="text-xs uppercase tracking-widest">{t('home.scroll')}</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
