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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { skills } = await skillsApi.getAll();
        setSkills(skills);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSkills();
  }, []);

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
    <section id="skills" className="py-20 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('skills.title')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              className="glass-card rounded-2xl p-6 animate-fade-in hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${catIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{category.title[language]}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full animated-gradient transition-all duration-1000"
                        style={{
                          width: `${skill.level}%`,
                          animationDelay: `${(catIndex * 0.1) + (skillIndex * 0.05)}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Icons Cloud */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-2xl font-bold mb-8">
            {language === 'ar' ? 'التقنيات التي أعمل بها' : 'Technologies I Work With'}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <span
                key={skill.id || index}
                className="px-6 py-3 glass-card rounded-full font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-default"
                style={{ animationDelay: `${0.5 + index * 0.05}s` }}
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
