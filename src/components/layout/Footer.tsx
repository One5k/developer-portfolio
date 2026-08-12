import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowUp, Heart, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { profileApi } from '@/lib/api';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [profileData, setProfileData] = useState<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { profile } = await profileApi.getProfile();
        setProfileData(profile);
      } catch (error) {
        console.error('Failed to fetch profile data in footer:', error);
      }
    };
    fetchProfile();

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { href: '#hero', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#projects', label: t('nav.projects') },
    { href: '#skills', label: t('nav.skills') },
    { href: '#certificates', label: t('nav.certificates') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const socialLinks = [
    { icon: Github, href: profileData?.github_url, label: 'GitHub', show: !!profileData?.github_url },
    { icon: Linkedin, href: profileData?.linkedin_url, label: 'LinkedIn', show: !!profileData?.linkedin_url },
    { icon: Mail, href: profileData?.email ? `mailto:${profileData.email}` : null, label: 'Email', show: !!profileData?.email },
  ].filter(link => link.show);

  const name = profileData
    ? (language === 'ar' ? profileData.name_ar : profileData.name_en)
    : '';

  return (
    <footer className="relative bg-card border-t border-border/50">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 text-start">

          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <a
              href="#hero"
              onClick={(e) => scrollToSection(e, '#hero')}
              className="text-xl font-extrabold text-foreground font-display no-letter-spacing hover:text-primary transition-colors cursor-pointer"
            >
              {'<Dev />'}
            </a>
            {name && (
              <p className="text-sm text-muted-foreground font-sans">{name}</p>
            )}
            {profileData?.email && (
              <a href={`mailto:${profileData.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                {profileData.email}
              </a>
            )}
            {profileData?.phone && (
              <a href={`tel:${profileData.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                {profileData.phone}
              </a>
            )}
            {(profileData?.location_ar || profileData?.location_en) && (
              <p className="text-sm text-muted-foreground font-sans flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {language === 'ar' ? profileData.location_ar : profileData.location_en}
              </p>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground font-sans">
              {language === 'ar' ? 'تنقل سريع' : 'Quick Links'}
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground font-sans">
              {language === 'ar' ? 'تواصل' : 'Connect'}
            </h4>
            <div className="flex flex-col gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans flex items-center gap-2"
                >
                  <social.icon className="h-3.5 w-3.5" />
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Back to Top */}
          <div className="flex flex-col items-start lg:items-end justify-between gap-4">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all font-sans text-xs flex items-center gap-2 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
              <span>{language === 'ar' ? 'الأعلى' : 'Top'}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
          <p className="text-xs text-muted-foreground/60 font-sans">
            © {currentYear} {name || 'Developer'}. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-muted-foreground/40 font-sans flex items-center gap-1">
            {language === 'ar' ? 'صُنع بـ' : 'Made with'} <Heart className="h-3 w-3 text-red-400/60" /> {language === 'ar' ? 'والكثير من القهوة' : '& lots of coffee'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
