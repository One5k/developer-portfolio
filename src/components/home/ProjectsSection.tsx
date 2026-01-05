import React, { useEffect, useState } from 'react';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { projectsApi } from '@/lib/api';

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

const ProjectsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const { projects } = await projectsApi.getAll();
            const mappedProjects = projects.map((p: any) => ({
                id: p.id,
                title: { en: p.title_en, ar: p.title_ar },
                description: { en: p.description_en, ar: p.description_ar },
                image: p.image_url,
                // Assuming project_skills returns an array of skill names or similar, 
                // but if not, logic might be needed. For now assuming seeded data.
                // Backend returns 'technologies' array of strings now
                techStack: p.technologies || [], 
                category: p.category,
                github: p.github_url,
                demo: p.live_url
            }));
            setProjects(mappedProjects);
        } catch (error) {
            console.error(error);
        }
    }
    fetchProjects();
  }, []);

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

  return (
    <section id="projects" className="py-20 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('projects.title')}</span>
          </h2>
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
          
           {filteredProjects.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد مشاريع لعرضها حالياً.' : 'No projects to display at the moment.'}</p>
                </div>
           )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
