import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
  ];

  return (
    <footer className="relative mt-20 border-t border-border bg-card/50">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-start">
            <span className="text-2xl font-bold gradient-text">{'<Dev />'}</span>
            <p className="mt-2 text-sm text-muted-foreground">
              © {currentYear} {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Line */}
      <div className="h-1 animated-gradient" />
    </footer>
  );
};

export default Footer;
