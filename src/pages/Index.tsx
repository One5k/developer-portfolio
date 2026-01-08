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
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData } from '@/contexts/AdminDataContext';
import { seoApi } from '@/lib/api';

const Index: React.FC = () => {
  const { language } = useLanguage();
  const { profile, hero } = useAdminData();
  const [seoData, setSeoData] = useState<any>(null);

  useEffect(() => {
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

  const name = profile
    ? (language === 'ar' ? profile.name_ar : profile.name_en)
    : (language === 'ar' ? 'مطور محترف' : 'Professional Developer');

  const jobTitle = hero
    ? (language === 'ar' ? hero.title_ar : hero.title_en)
    : (language === 'ar' ? 'مطور ويب' : 'Web Developer');

  const defaultBio = hero
    ? (language === 'ar' ? hero.description_ar : hero.description_en)
    : (language === 'ar' ? 'مطور ويب متكامل' : 'Full-stack Web Developer');

  const pageTitle = `${name} | ${jobTitle}`;

  // Prioritize Specific SEO data, fallback to generated defaults
  const metaTitle = seoData
    ? (language === 'ar' ? (seoData.meta_title_ar || `${name} | ${jobTitle}`) : (seoData.meta_title_en || `${name} | ${jobTitle}`))
    : `${name} | ${jobTitle}`;

  const metaDesc = seoData
    ? (language === 'ar' ? (seoData.meta_description_ar || defaultBio) : (seoData.meta_description_en || defaultBio))
    : defaultBio;

  const metaKeywords = seoData?.meta_keywords || '';
  const ogImage = seoData?.og_image_url || profile?.avatar_url;

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
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
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
