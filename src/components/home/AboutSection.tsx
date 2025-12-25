import React from 'react';
import { Download, Briefcase, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection: React.FC = () => {
  const { t, language, direction } = useLanguage();

  const experiences = [
    {
      title: { en: 'Senior Full-Stack Developer', ar: 'مطور ويب متكامل أول' },
      company: { en: 'Tech Solutions Inc.', ar: 'شركة الحلول التقنية' },
      period: '2022 - Present',
      location: { en: 'Riyadh, Saudi Arabia', ar: 'الرياض، السعودية' },
    },
    {
      title: { en: 'Full-Stack Developer', ar: 'مطور ويب متكامل' },
      company: { en: 'Digital Agency', ar: 'وكالة رقمية' },
      period: '2020 - 2022',
      location: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' },
    },
    {
      title: { en: 'Frontend Developer', ar: 'مطور واجهات أمامية' },
      company: { en: 'Startup Hub', ar: 'مركز الشركات الناشئة' },
      period: '2018 - 2020',
      location: { en: 'Amman, Jordan', ar: 'عمان، الأردن' },
    },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('nav.about')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'تعرف على خبراتي ورحلتي في عالم التطوير'
              : 'Learn about my experience and journey in development'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Bio Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                {language === 'ar' ? 'من أنا' : 'Who I Am'}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === 'ar' 
                  ? 'أنا مطور ويب شغوف بخبرة تزيد عن 5 سنوات في بناء تطبيقات ويب حديثة. أركز على إنشاء واجهات مستخدم جميلة وتجارب سلسة باستخدام أحدث التقنيات.'
                  : 'I am a passionate web developer with over 5 years of experience building modern web applications. I focus on creating beautiful user interfaces and seamless experiences using the latest technologies.'}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {language === 'ar'
                  ? 'أحب حل المشكلات المعقدة وتحويل الأفكار إلى منتجات رقمية عملية. أؤمن بكتابة كود نظيف وقابل للصيانة.'
                  : 'I love solving complex problems and turning ideas into functional digital products. I believe in writing clean, maintainable code.'}
              </p>
              <Button className="btn-gradient rounded-full gap-2">
                <Download className="h-4 w-4" />
                {t('about.download')}
              </Button>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold mb-6">
              {language === 'ar' ? 'الخبرات العملية' : 'Work Experience'}
            </h3>
            <div className={`space-y-6 relative before:absolute before:top-0 before:bottom-0 before:w-0.5 before:bg-primary/30 ${direction === 'rtl' ? 'before:right-3' : 'before:left-3'}`}>
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className={`relative glass-card rounded-xl p-5 ${direction === 'rtl' ? 'mr-8' : 'ml-8'}`}
                >
                  <div className={`absolute top-6 w-6 h-6 rounded-full bg-primary flex items-center justify-center ${direction === 'rtl' ? '-right-11' : '-left-11'}`}>
                    <Briefcase className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.period}</span>
                  </div>
                  <h4 className="text-lg font-bold">{exp.title[language]}</h4>
                  <p className="text-primary font-medium">{exp.company[language]}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <MapPin className="h-3 w-3" />
                    <span>{exp.location[language]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
