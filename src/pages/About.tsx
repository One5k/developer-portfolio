import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Briefcase, GraduationCap, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const About: React.FC = () => {
  const { t, language, direction } = useLanguage();

  const experiences = [
    {
      title: language === 'ar' ? 'مطور ويب أول' : 'Senior Web Developer',
      company: language === 'ar' ? 'شركة التقنية' : 'Tech Company',
      period: '2022 - Present',
      description: language === 'ar' 
        ? 'قيادة فريق تطوير الواجهات الأمامية وبناء تطبيقات ويب حديثة'
        : 'Leading frontend development team and building modern web applications',
    },
    {
      title: language === 'ar' ? 'مطور ويب' : 'Web Developer',
      company: language === 'ar' ? 'وكالة رقمية' : 'Digital Agency',
      period: '2020 - 2022',
      description: language === 'ar'
        ? 'تطوير مواقع ويب متجاوبة وتطبيقات تفاعلية للعملاء'
        : 'Developing responsive websites and interactive applications for clients',
    },
    {
      title: language === 'ar' ? 'مطور مبتدئ' : 'Junior Developer',
      company: language === 'ar' ? 'شركة ناشئة' : 'Startup Inc',
      period: '2019 - 2020',
      description: language === 'ar'
        ? 'المساهمة في تطوير منتجات الويب والتعلم من الفريق'
        : 'Contributing to web product development and learning from the team',
    },
  ];

  const skills = [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'Docker', level: 75 },
  ];

  const title = language === 'ar' ? 'عني | مطور ويب محترف' : 'About Me | Professional Web Developer';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={language === 'ar' ? 'تعرف على خبراتي ومهاراتي كمطور ويب' : 'Learn about my experience and skills as a web developer'} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="section-container">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">{t('about.title')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'ar' 
                  ? 'مطور شغوف ببناء تجارب رقمية مميزة'
                  : 'A passionate developer building exceptional digital experiences'}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Bio Section */}
              <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="glass-card rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{t('about.bio.title')}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {language === 'ar'
                      ? 'أنا مطور ويب متكامل مع أكثر من 5 سنوات من الخبرة في بناء تطبيقات ويب حديثة وقابلة للتطوير. أتخصص في React و TypeScript و Node.js، وأحب تحويل الأفكار المعقدة إلى واجهات مستخدم بسيطة وأنيقة. شغفي هو كتابة كود نظيف وقابل للصيانة يحل مشاكل حقيقية.'
                      : 'I\'m a full-stack web developer with over 5 years of experience building modern, scalable web applications. I specialize in React, TypeScript, and Node.js, and I love transforming complex ideas into simple, elegant user interfaces. My passion is writing clean, maintainable code that solves real problems.'}
                  </p>
                  <Button className="btn-gradient rounded-full gap-2">
                    <Download className="h-4 w-4" />
                    {t('about.download.cv')}
                  </Button>
                </div>

                {/* Skills Preview */}
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6">{language === 'ar' ? 'المهارات الرئيسية' : 'Top Skills'}</h3>
                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full animated-gradient"
                            style={{ 
                              width: `${skill.level}%`,
                              animationDelay: `${index * 0.1}s`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="glass-card rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Briefcase className="h-6 w-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold">{t('about.experience')}</h2>
                  </div>
                  
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className={`absolute top-0 bottom-0 w-0.5 bg-border ${direction === 'rtl' ? 'right-4' : 'left-4'}`} />
                    
                    <div className="space-y-8">
                      {experiences.map((exp, index) => (
                        <div 
                          key={index} 
                          className={`relative ${direction === 'rtl' ? 'pr-12' : 'pl-12'}`}
                        >
                          {/* Timeline Dot */}
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-primary glow-primary ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
                          
                          <div className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300">
                            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3">
                              {exp.period}
                            </span>
                            <h3 className="text-lg font-bold mb-1">{exp.title}</h3>
                            <p className="text-primary font-medium mb-2">{exp.company}</p>
                            <p className="text-sm text-muted-foreground">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
