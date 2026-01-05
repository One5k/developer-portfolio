import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { profileApi } from '@/lib/api';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [profileData, setProfileData] = useState<any>(null);

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
  }, []);

  const socialLinks = [
    { icon: Github, href: profileData?.github_url, label: 'GitHub', show: !!profileData?.github_url },
    { icon: Linkedin, href: profileData?.linkedin_url, label: 'LinkedIn', show: !!profileData?.linkedin_url },
    { icon: Twitter, href: profileData?.twitter_url, label: 'Twitter', show: !!profileData?.twitter_url },
    { icon: Mail, href: profileData?.email ? `mailto:${profileData.email}` : 'mailto:hello@example.com', label: 'Email', show: true },
  ].filter(link => link.show);

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
