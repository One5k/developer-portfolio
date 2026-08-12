import React, { useEffect, useState } from 'react';
import { ArrowRight, Github, Linkedin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <section className="relative min-h-[90vh] flex items-center justify-center bg-background pt-24 pb-12">
        <div className="section-container w-full space-y-6 text-start">
          <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
          <div className="h-16 sm:h-24 w-3/4 bg-muted animate-pulse rounded-xl" />
          <div className="h-8 w-1/2 bg-muted animate-pulse rounded-lg" />
          <div className="h-16 w-2/3 bg-muted animate-pulse rounded-lg" />
        </div>
      </section>
    );
  }

  // All data from Supabase — no hardcoded fallbacks
  const name = profileData
    ? (language === 'ar' ? profileData.name_ar : profileData.name_en)
    : '';

  const subtitle = heroData
    ? (language === 'ar' ? heroData.subtitle_ar : heroData.subtitle_en)
    : '';

  const description = heroData
    ? (language === 'ar' ? heroData.description_ar : heroData.description_en)
    : '';

  const title = heroData
    ? (language === 'ar' ? heroData.title_ar : heroData.title_en)
    : '';

  const heroImage = heroData?.hero_image_url || null;

  const socialLinks = [
    { icon: Github, href: profileData?.github_url, label: 'GitHub', show: !!profileData?.github_url },
    { icon: Linkedin, href: profileData?.linkedin_url, label: 'LinkedIn', show: !!profileData?.linkedin_url }
  ].filter(link => link.show);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const getWhatsAppUrl = () => {
    if (!profileData?.phone) return '#contact';
    const cleanPhone = profileData.phone.replace(/[+\s\-()]/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  // Stagger animation config
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  // Layout: With image → split grid. Without image → full-width centered
  const hasImage = !!heroImage;

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-background pt-28 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
      <div className="section-container w-full relative z-10">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-12' : ''} gap-10 lg:gap-12 items-center`}
        >

          {/* Text Content Block */}
          <div className={`${hasImage ? 'lg:col-span-7 xl:col-span-8' : 'max-w-4xl'} text-start space-y-6`}>

            {/* Greeting / Role Tag */}
            {subtitle && (
              <motion.p variants={itemVariants} className="text-sm sm:text-base text-muted-foreground font-sans">
                {subtitle}
              </motion.p>
            )}

            {/* Name — the focal point */}
            {name && (
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.08] font-display no-letter-spacing"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                {name}
              </motion.h1>
            )}

            {/* Description paragraph */}
            {description && (
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans">
                {description}
              </motion.p>
            )}

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                className="btn-premium rounded-xl px-6 py-5 text-sm gap-2 group cursor-pointer font-sans"
                onClick={scrollToProjects}
              >
                <span>{t('home.cta.projects')}</span>
                <ArrowRight className={`h-4 w-4 transition-transform ${direction === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl border-border hover:bg-secondary hover:text-foreground px-6 py-5 text-sm text-muted-foreground cursor-pointer transition-colors font-sans"
              >
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  {t('home.cta.contact')}
                </a>
              </Button>

              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2 ms-1">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>

          </div>

          {/* Profile Image — only when image exists */}
          {hasImage && (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={heroImage}
                    alt={name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    loading="eager"
                  />
                  {/* Subtle bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-50" />
                </div>
                {/* Floating name tag on image */}
                <div className="absolute bottom-4 inset-x-4 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-md border border-border/50 text-start">
                  <p className="text-sm font-bold text-foreground font-display no-letter-spacing truncate">{name}</p>
                  <p className="text-[11px] text-muted-foreground font-sans truncate">{title}</p>
                </div>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 inset-x-0 hidden md:flex flex-col items-center gap-1 text-muted-foreground/30 pointer-events-none">
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;