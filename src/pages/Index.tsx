import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { language } = useLanguage();

  const title = language === 'ar' 
    ? 'الرئيسية | مطور ويب محترف' 
    : 'Home | Professional Web Developer';
  
  const description = language === 'ar'
    ? 'مطور ويب متكامل متخصص في بناء تطبيقات ويب حديثة وتجارب مستخدم مميزة'
    : 'Full-stack web developer specializing in building modern web applications and exceptional user experiences';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
