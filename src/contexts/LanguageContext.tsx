import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.certificates': 'Certificates',
    'nav.contact': 'Contact',
    
    // Home Page
    'home.greeting': 'Hello, I\'m',
    'home.name': 'Your Name',
    'home.title': 'Full-Stack Developer',
    'home.subtitle': 'Building digital experiences with modern technologies',
    'home.bio': 'I craft elegant solutions to complex problems, specializing in web development with a passion for clean code and intuitive user experiences.',
    'home.cta.projects': 'View Projects',
    'home.cta.contact': 'Contact Me',
    'home.scroll': 'Scroll to explore',
    
    // About Page
    'about.title': 'About Me',
    'about.bio.title': 'Who I Am',
    'about.experience': 'Experience',
    'about.download.cv': 'Download CV',
    
    // Projects Page
    'projects.title': 'My Projects',
    'projects.filter.all': 'All',
    'projects.filter.frontend': 'Frontend',
    'projects.filter.backend': 'Backend',
    'projects.filter.fullstack': 'Full Stack',
    'projects.filter.mobile': 'Mobile',
    'projects.view.demo': 'Live Demo',
    'projects.view.code': 'View Code',
    
    // Skills Page
    'skills.title': 'My Skills',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.mobile': 'Mobile',
    'skills.tools': 'Tools',
    'skills.soft': 'Soft Skills',
    
    // Certificates Page
    'certificates.title': 'Certificates & Education',
    
    // Contact Page
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have a project in mind? Let\'s talk about it.',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Your Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'Failed to send message. Please try again.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.years': 'Years',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'عني',
    'nav.projects': 'المشاريع',
    'nav.skills': 'المهارات',
    'nav.certificates': 'الشهادات',
    'nav.contact': 'تواصل معي',
    
    // Home Page
    'home.greeting': 'مرحباً، أنا',
    'home.name': 'اسمك هنا',
    'home.title': 'مطور ويب متكامل',
    'home.subtitle': 'أبني تجارب رقمية بتقنيات حديثة',
    'home.bio': 'أصمم حلولاً أنيقة للمشكلات المعقدة، متخصص في تطوير الويب مع شغف بالكود النظيف وتجربة المستخدم البديهية.',
    'home.cta.projects': 'عرض المشاريع',
    'home.cta.contact': 'تواصل معي',
    'home.scroll': 'اسحب للاستكشاف',
    
    // About Page
    'about.title': 'عني',
    'about.bio.title': 'من أنا',
    'about.experience': 'الخبرات',
    'about.download.cv': 'تحميل السيرة الذاتية',
    
    // Projects Page
    'projects.title': 'مشاريعي',
    'projects.filter.all': 'الكل',
    'projects.filter.frontend': 'الواجهة الأمامية',
    'projects.filter.backend': 'الخلفية',
    'projects.filter.fullstack': 'متكامل',
    'projects.filter.mobile': 'تطبيقات',
    'projects.view.demo': 'عرض مباشر',
    'projects.view.code': 'عرض الكود',
    
    // Skills Page
    'skills.title': 'مهاراتي',
    'skills.frontend': 'الواجهة الأمامية',
    'skills.backend': 'الخلفية',
    'skills.mobile': 'تطبيقات الجوال',
    'skills.tools': 'الأدوات',
    'skills.soft': 'المهارات الشخصية',
    
    // Certificates Page
    'certificates.title': 'الشهادات والتعليم',
    
    // Contact Page
    'contact.title': 'تواصل معي',
    'contact.subtitle': 'لديك مشروع في ذهنك؟ دعنا نتحدث عنه.',
    'contact.form.name': 'اسمك',
    'contact.form.email': 'بريدك الإلكتروني',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'رسالتك',
    'contact.form.send': 'إرسال الرسالة',
    'contact.form.sending': 'جاري الإرسال...',
    'contact.success': 'تم إرسال الرسالة بنجاح!',
    'contact.error': 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ ما',
    'common.years': 'سنوات',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-language');
    return (saved as Language) || 'en';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('portfolio-language', language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Update font family for Arabic
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
