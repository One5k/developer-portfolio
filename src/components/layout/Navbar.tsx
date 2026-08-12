import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'projects', 'skills', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section === 'home' ? 'hero' : section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { id: 'home', href: '#hero', label: t('nav.home') },
    { id: 'about', href: '#about', label: t('nav.about') },
    { id: 'projects', href: '#projects', label: t('nav.projects') },
    { id: 'skills', href: '#skills', label: t('nav.skills') },
    { id: 'certificates', href: '#certificates', label: t('nav.certificates') },
    { id: 'contact', href: '#contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500 py-3 sm:py-4 px-4 sm:px-8',
        isScrolled ? 'pt-3' : 'pt-5'
      )}
    >
      <nav
        className={cn(
          'max-w-6xl mx-auto rounded-full transition-all duration-500 px-5 sm:px-7 py-2.5 flex items-center justify-between',
          isScrolled
            ? 'bg-card/80 backdrop-blur-xl border border-border/80 shadow-lg'
            : 'bg-card/40 backdrop-blur-md border border-border/40'
        )}
      >
        {/* Studio Brand Logo */}
        <a 
          href="#hero"
          onClick={(e) => scrollToSection(e, '#hero')}
          className="text-xl sm:text-2xl font-extrabold text-foreground font-display no-letter-spacing hover:text-primary transition-colors cursor-pointer"
        >
          {'<Dev />'}
        </a>

        {/* Desktop Navigation Links with Animated Pill Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 font-sans bg-secondary/40 p-1 rounded-full border border-border/40">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={cn(
                  'relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer z-10',
                  isActive ? 'text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-primary rounded-full z-[-1]"
                  />
                )}
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Right Actions Bar */}
        <div className="flex items-center gap-1.5">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative rounded-full h-9 w-9 border border-border/50 hover:border-primary/40"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4 text-foreground" />
            <span className="absolute -bottom-1 -end-1 text-[8px] font-mono font-bold bg-primary text-primary-foreground rounded-full px-1">
              {language.toUpperCase()}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-9 w-9 border border-border/50 hover:border-primary/40"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full h-9 w-9 border border-border/50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden max-w-6xl mx-auto mt-2 font-sans"
          >
            <div className="bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-3 shadow-xl space-y-1 text-start">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={cn(
                    'block px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer',
                    activeSection === link.id
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
