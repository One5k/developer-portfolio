import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Project {
  id: number;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  techStack: string[];
  category: string;
  github?: string;
  demo?: string;
}

const Projects: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const projects: Project[] = [
    {
      id: 1,
      title: { en: 'E-Commerce Platform', ar: 'منصة تجارة إلكترونية' },
      description: { 
        en: 'A full-featured e-commerce platform with payment integration and admin dashboard',
        ar: 'منصة تجارة إلكترونية متكاملة مع بوابة دفع ولوحة تحكم'
      },
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      category: 'fullstack',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      id: 2,
      title: { en: 'Task Management App', ar: 'تطبيق إدارة المهام' },
      description: {
        en: 'A collaborative task management application with real-time updates',
        ar: 'تطبيق إدارة مهام تعاوني مع تحديثات فورية'
      },
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      techStack: ['React', 'TypeScript', 'Supabase'],
      category: 'frontend',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      id: 3,
      title: { en: 'API Gateway Service', ar: 'خدمة بوابة API' },
      description: {
        en: 'A scalable API gateway with rate limiting and authentication',
        ar: 'بوابة API قابلة للتوسع مع تحديد المعدل والمصادقة'
      },
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      techStack: ['Node.js', 'Express', 'Redis', 'Docker'],
      category: 'backend',
      github: 'https://github.com',
    },
    {
      id: 4,
      title: { en: 'Mobile Fitness App', ar: 'تطبيق اللياقة البدنية' },
      description: {
        en: 'A cross-platform fitness tracking app with workout plans',
        ar: 'تطبيق تتبع اللياقة البدنية مع خطط التمارين'
      },
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
      techStack: ['React Native', 'Firebase', 'TypeScript'],
      category: 'mobile',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      id: 5,
      title: { en: 'Analytics Dashboard', ar: 'لوحة تحليلات' },
      description: {
        en: 'Real-time analytics dashboard with interactive charts and reports',
        ar: 'لوحة تحليلات فورية مع رسوم بيانية تفاعلية'
      },
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI'],
      category: 'fullstack',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      id: 6,
      title: { en: 'Social Media UI Kit', ar: 'مجموعة واجهات التواصل الاجتماعي' },
      description: {
        en: 'A comprehensive UI component library for social media applications',
        ar: 'مكتبة مكونات واجهة مستخدم شاملة لتطبيقات التواصل الاجتماعي'
      },
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
      techStack: ['React', 'Tailwind CSS', 'Storybook'],
      category: 'frontend',
      github: 'https://github.com',
    },
  ];

  const filters = [
    { key: 'all', label: t('projects.filter.all') },
    { key: 'frontend', label: t('projects.filter.frontend') },
    { key: 'backend', label: t('projects.filter.backend') },
    { key: 'fullstack', label: t('projects.filter.fullstack') },
    { key: 'mobile', label: t('projects.filter.mobile') },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const title = language === 'ar' ? 'المشاريع | مطور ويب محترف' : 'Projects | Professional Web Developer';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={language === 'ar' ? 'استعرض مشاريعي في تطوير الويب' : 'Browse my web development projects'} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="section-container">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">{t('projects.title')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'ar' 
                  ? 'مجموعة من أعمالي في تطوير الويب والتطبيقات'
                  : 'A collection of my web and application development work'}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Filter className="h-5 w-5 text-muted-foreground" />
              {filters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.key)}
                  className={cn(
                    'rounded-full',
                    activeFilter === filter.key && 'btn-gradient'
                  )}
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title[language]}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action Buttons */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      {project.demo && (
                        <Button asChild size="sm" className="btn-gradient rounded-full flex-1">
                          <a href={project.demo} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {t('projects.view.demo')}
                          </a>
                        </Button>
                      )}
                      {project.github && (
                        <Button asChild size="sm" variant="outline" className="rounded-full">
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title[language]}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description[language]}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Projects;
