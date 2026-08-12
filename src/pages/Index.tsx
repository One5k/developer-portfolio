import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import SkillsSection from '@/components/home/SkillsSection';
import CertificatesSection from '@/components/home/CertificatesSection';
import ContactSection from '@/components/home/ContactSection';
import TechMarquee from '@/components/home/TechMarquee';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData } from '@/contexts/AdminDataContext';
import { seoApi } from '@/lib/api';

const Index: React.FC = () => {
  const { language } = useLanguage();
  const { profile, hero } = useAdminData();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const fetchSeo = async () => {
      try {
        const res = await seoApi.getSeo('home');
        if (res.seo) setSeoData(res.seo);
      } catch (err) {
        console.error('Failed to fetch SEO', err);
      }
    };
    fetchSeo();
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    const glowElement = document.getElementById('cursor-glow-tracker');
    if (!glowElement) return;

    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        glowElement.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [isTouchDevice]);

  const name = profile
    ? (language === 'ar' ? profile.name_ar : profile.name_en)
    : (language === 'ar' ? 'مطور محترف' : 'Professional Developer');

  const jobTitle = hero
    ? (language === 'ar' ? hero.title_ar : hero.title_en)
    : (language === 'ar' ? 'مطور ويب' : 'Web Developer');

  const defaultBio = hero
    ? (language === 'ar' ? hero.description_ar : hero.description_en)
    : (language === 'ar' ? 'مطور ويب متكامل' : 'Full-stack Web Developer');

  const metaTitle = seoData
    ? (language === 'ar' ? (seoData.meta_title_ar || `${name} | ${jobTitle}`) : (seoData.meta_title_en || `${name} | ${jobTitle}`))
    : `${name} | ${jobTitle}`;

  const metaDesc = seoData
    ? (language === 'ar' ? (seoData.meta_description_ar || defaultBio) : (seoData.meta_description_en || defaultBio))
    : defaultBio;

  const metaKeywords = seoData?.meta_keywords || '';
  const ogImage = seoData?.og_image_url || profile?.avatar_url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    description: metaDesc,
    url: window.location.href,
    sameAs: [profile?.github_url, profile?.linkedin_url, profile?.twitter_url].filter(Boolean),
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}

        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        {ogImage && <meta property="og:image" content={ogImage} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Premium Luxury Grain Texture Overlay */}
      <div className="grain-overlay" />

      {/* Ambient mouse glow effect (hidden on mobile/touch screens) */}
      {!isTouchDevice && (
        <div className="cursor-glow-container">
          <div id="cursor-glow-tracker" className="cursor-glow-element" />
        </div>
      )}

      <div className="min-h-screen bg-background relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <TechMarquee />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <CertificatesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
