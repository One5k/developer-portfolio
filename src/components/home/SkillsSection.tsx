import React, { useEffect, useState } from 'react';
import { Code, Server, Smartphone, Wrench, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { skillsApi } from '@/lib/api';

interface SkillCategory {
  icon: React.ElementType;
  title: { en: string; ar: string };
  skills: { name: string; level: number }[];
}

const SkillsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const fetchSkills = async () => {
       try {
         const { skills } = await skillsApi.getAll();
         setSkills(skills);
       } catch (error) {
         console.error(error);
       } finally {
         setIsLoading(false);
       }
     }
     fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <section id="skills" className="py-24 relative bg-background">
        <div className="section-container">
          <div className="text-center mb-20">
            <div className="h-10 w-48 bg-muted animate-pulse mx-auto mb-4 rounded-none" />
            <div className="h-4 w-64 bg-muted animate-pulse mx-auto rounded-none" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="obsidian-card rounded-none p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-muted animate-pulse rounded-none" />
                  <div className="h-6 w-32 bg-muted animate-pulse rounded-none" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-10 w-full bg-muted animate-pulse rounded-none" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Helper to categorize skills dynamically
  const getSkillsByCategory = (category: string) => {
    return skills
      .filter(s => s.category === category)
      .map(s => ({ name: s.name_en, level: s.proficiency }));
  };

  const categories: SkillCategory[] = [
    {
      icon: Code,
      title: { en: 'Frontend', ar: 'الواجهة الأمامية' },
      skills: getSkillsByCategory('frontend'),
    },
    {
      icon: Server,
      title: { en: 'Backend', ar: 'الخلفية' },
      skills: getSkillsByCategory('backend'),
    },
    {
      icon: Smartphone,
      title: { en: 'Mobile', ar: 'تطبيقات الجوال' },
      skills: getSkillsByCategory('mobile'),
    },
    {
      icon: Wrench,
      title: { en: 'Tools & DevOps', ar: 'الأدوات و DevOps' },
      skills: getSkillsByCategory('tools'),
    },
    // Retaining hardcoded soft skills as they might not be in DB or handled differently
    {
      icon: Users,
      title: { en: 'Soft Skills', ar: 'المهارات الشخصية' },
      skills: getSkillsByCategory('soft'),
    },
  ];

  // Filter out empty categories except soft skills
  const activeCategories = categories.filter(c => c.skills.length > 0 || c.title.en === 'Soft Skills');

  return (
    <section id="skills" className="py-24 relative bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-display">
            {t('skills.title')}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'التقنيات والأدوات التي أستخدمها لبناء حلول رقمية متميزة'
              : 'Technologies and tools I use to build exceptional digital solutions'}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCategories.map((category, catIndex) => (
            <div
              key={category.title.en}
              className="obsidian-card rounded-none p-8 animate-fade-in"
              style={{ animationDelay: `${catIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3.5 mb-8">
                <div className="p-3 rounded-none bg-secondary">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{category.title[language]}</h3>
              </div>

              {/* Skills List - Technical Ledger style (No progress bars!) */}
              <div className="space-y-3">
                {category.skills.map((skill) => (
                  <div 
                    key={skill.name}
                    className="flex items-center justify-between p-3.5 bg-secondary/30 border border-border/40 rounded-none hover:border-primary/30 transition-colors duration-200"
                  >
                    <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                    <span className="text-xs font-mono text-primary font-medium">{skill.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Icons Cloud */}
        <div className="mt-24 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-bold text-foreground mb-10">
            {language === 'ar' ? 'التقنيات التي أعمل بها' : 'Technologies I Work With'}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <span
                key={skill.id || index}
                className="px-5 py-2.5 bg-secondary border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 text-xs font-mono uppercase tracking-wider rounded-none transition-all duration-200 cursor-default"
                style={{ animationDelay: `${0.4 + index * 0.03}s` }}
              >
                {skill.name_en}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
