import React, { useEffect, useState } from 'react';
import { Layers, Terminal, Cpu, Layout, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { skillsApi } from '@/lib/api';
import ScrollReveal from '@/components/motion/ScrollReveal';

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
    };
    fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <section id="skills" className="py-32 relative bg-background border-t border-border/40">
        <div className="section-container space-y-12">
          <div className="h-10 w-48 bg-muted animate-pulse rounded-xl" />
          <div className="h-64 w-full bg-muted animate-pulse rounded-3xl" />
        </div>
      </section>
    );
  }

  const getSkillsByCategory = (category: string) => {
    return skills
      .filter((s) => s.category === category)
      .map((s) => ({ name: s.name_en, level: s.proficiency }));
  };

  const categories: SkillCategory[] = [
    {
      icon: Layout,
      title: { en: 'Frontend Architecture', ar: 'الواجهة الأمامية والهندسة' },
      skills: getSkillsByCategory('frontend'),
    },
    {
      icon: Cpu,
      title: { en: 'Backend & APIs', ar: 'الخلفية وقواعد البيانات' },
      skills: getSkillsByCategory('backend'),
    },
    {
      icon: Smartphone,
      title: { en: 'Mobile Development', ar: 'تطبيقات الجوال' },
      skills: getSkillsByCategory('mobile'),
    },
    {
      icon: Terminal,
      title: { en: 'DevOps & Tooling', ar: 'الأدوات والبنية التحتية' },
      skills: getSkillsByCategory('tools'),
    },
    {
      icon: Layers,
      title: { en: 'UI/UX & Design Systems', ar: 'التصميم وتجربة المستخدم' },
      skills: getSkillsByCategory('soft'),
    },
  ];

  const activeCategories = categories.filter((c) => c.skills.length > 0);

  return (
    <section id="skills" className="py-16 lg:py-20 relative bg-background">
      <div className="section-container">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="mb-10 text-start">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-display no-letter-spacing">
              {t('skills.title')}
            </h2>
          </div>
        </ScrollReveal>

        {/* Studio Technical Presentation Matrix */}
        <div className="space-y-8">
          {activeCategories.map((category, idx) => (
            <ScrollReveal key={category.title.en} direction="up" delay={0.1 * idx}>
              <div
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pb-8 border-b border-border/40 text-start"
              >
                {/* Category Identity (4 Cols) */}
                <div className="lg:col-span-3 flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-secondary text-primary">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-display no-letter-spacing">
                    {category.title[language]}
                  </h3>
                </div>

                {/* Skills Tags Ledger (8 Cols) */}
                <div className="lg:col-span-9 flex flex-wrap gap-2 font-sans">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-foreground hover:border-primary/30 transition-colors duration-200"
                    >
                      <span className="text-xs font-medium">{skill.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/70 bg-background/80 px-2 py-0.5 rounded-md border border-border/40">
                        {skill.level}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>



      </div>
    </section>
  );
};

export default SkillsSection;
