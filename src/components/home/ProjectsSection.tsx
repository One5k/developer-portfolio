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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const { projects } = await projectsApi.getAll();
            const mappedProjects = projects.map((p: any) => ({
                id: p.id,
                title: { en: p.title_en, ar: p.title_ar },
                description: { en: p.description_en, ar: p.description_ar },
                image: p.image_url,
                techStack: p.technologies || [], 
                category: p.category,
                github: p.github_url,
                demo: p.live_url
            }));
            setProjects(mappedProjects);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <section id="projects" className="py-24 relative bg-background">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="h-10 w-48 bg-muted animate-pulse mx-auto mb-4 rounded-none" />
            <div className="h-4 w-64 bg-muted animate-pulse mx-auto rounded-none" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded-none" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="obsidian-card rounded-none overflow-hidden flex flex-col h-full p-6">
                <div className="h-48 w-full bg-muted animate-pulse rounded-none mb-4" />
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded-none mb-2" />
                <div className="h-4 w-full bg-muted animate-pulse rounded-none mb-1" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded-none mb-6" />
                <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
                  <div className="h-10 w-full bg-muted animate-pulse rounded-none" />
                  <div className="h-10 w-12 bg-muted animate-pulse rounded-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
    <section id="projects" className="py-24 relative bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-display">
            {t('projects.title')}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'مجموعة من أعمالي في تطوير الويب والتطبيقات'
              : 'A collection of my web and application development work'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16 animate-fade-in">
          <Filter className="h-4 w-4 text-muted-foreground mr-2" />
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                'rounded-none text-xs uppercase tracking-wider px-5 py-2.5',
                activeFilter === filter.key ? 'btn-premium' : 'border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
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
              className="obsidian-card rounded-none overflow-hidden group flex flex-col h-full animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-muted">
                <img 
                  src={project.image} 
                  alt={project.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {project.title[language]}
                </h3>
                <p className="text-sm text-muted-foreground/80 mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {project.description[language]}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2.5 py-1 text-[10px] font-mono font-medium rounded-none bg-secondary text-muted-foreground uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Always-visible Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-border/50">
                  {project.demo && (
                    <Button asChild size="sm" className="btn-premium rounded-none flex-1 gap-1.5 text-xs py-4">
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t('projects.view.demo')}
                      </a>
                    </Button>
                  )}
                  {project.github && (
                    <Button asChild size="sm" variant="outline" className="rounded-none border-border hover:bg-secondary px-3 py-4">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12 obsidian-card rounded-none">
              <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد مشاريع لعرضها حالياً.' : 'No projects to display at the moment.'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
