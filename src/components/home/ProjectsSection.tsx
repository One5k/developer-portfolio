import React, { useEffect, useState } from 'react';
import { ExternalLink, Github, Filter, ChevronLeft, ChevronRight, X, Maximize2, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { projectsApi } from '@/lib/api';
import ProjectDetailModal from '@/components/home/ProjectDetailModal';
import ScrollReveal from '@/components/motion/ScrollReveal';

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

const getProjectImages = (urlStr: string | null | undefined): string[] => {
  if (!urlStr) return [];
  const trimmed = urlStr.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((u) => u.trim()).filter(Boolean);
    } catch (e) {
      // Fallback
    }
  }
  return trimmed.split(',').map((u) => u.trim()).filter(Boolean);
};

interface ProjectCardProps {
  project: Project;
  language: 'en' | 'ar';
  t: (key: string) => string;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
  onOpenModal: (project: Project) => void;
  isFeatured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, language, t, onOpenLightbox, onOpenModal, isFeatured = false }) => {
  const images = getProjectImages(project.image);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isFeatured) {
    return (
      <div 
        className="glass-card-premium rounded-3xl overflow-hidden group grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border/80 shadow-2xl mb-12 relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onOpenModal(project)}
      >
        {/* Flagship Tag */}
        <div className="absolute top-4 start-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-mono font-bold shadow-md">
          <Star className="h-3.5 w-3.5 fill-primary-foreground" />
          <span>{language === 'ar' ? 'المشروع البارز' : 'FEATURED WORK'}</span>
        </div>

        {/* Featured Image Canvas (7 Cols) */}
        <div 
          className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] lg:min-h-[440px] bg-muted overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLightbox(images, currentSlide, project.title[language]);
          }}
        >
          {images.length > 0 ? (
            <img 
              src={images[currentSlide]} 
              alt={`${project.title[language]} - ${currentSlide + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary font-mono text-sm">
              {language === 'ar' ? 'لا توجد صورة للمشروع' : 'No image available'}
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={cn(
                  "absolute top-1/2 start-4 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/60 text-white flex items-center justify-center transition-all duration-300 hover:bg-primary active:scale-95 z-10",
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className={cn(
                  "absolute top-1/2 end-4 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/60 text-white flex items-center justify-center transition-all duration-300 hover:bg-primary active:scale-95 z-10",
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Featured Story & Details (5 Cols) */}
        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between text-start bg-card/40">
          <div className="space-y-4">
            <span className="text-xs font-mono font-semibold uppercase text-primary tracking-wider">
              {project.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display no-letter-spacing group-hover:text-primary transition-colors">
              {project.title[language]}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed font-sans line-clamp-4">
              {project.description[language]}
            </p>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-secondary text-foreground border border-border/50"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
              <Button 
                size="lg" 
                className="btn-premium rounded-xl flex-1 gap-2 text-sm font-sans py-6 cursor-pointer"
                onClick={() => onOpenModal(project)}
              >
                <Eye className="h-4 w-4" />
                <span>{language === 'ar' ? 'تفاصيل المشروع' : 'View Case Study'}</span>
              </Button>

              {project.demo && (
                <Button asChild size="lg" variant="outline" className="rounded-xl border-border/80 hover:bg-secondary px-4 py-6">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 text-foreground" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Secondary Project Card Layout
  return (
    <div 
      className="obsidian-card rounded-2xl overflow-hidden group flex flex-col h-full border border-border/60 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(project)}
    >
      <div 
        className="relative h-56 overflow-hidden bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          onOpenLightbox(images, currentSlide, project.title[language]);
        }}
      >
        {images.length > 0 ? (
          <img 
            src={images[currentSlide]} 
            alt={`${project.title[language]} - ${currentSlide + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary font-mono text-xs">
            {language === 'ar' ? 'لا توجد صورة للمشروع' : 'No image available'}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow text-start">
        <h3 className="text-lg font-bold text-foreground mb-2 font-display no-letter-spacing group-hover:text-primary transition-colors">
          {project.title[language]}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground/80 mb-6 line-clamp-3 leading-relaxed font-sans flex-grow">
          {project.description[language]}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.techStack.map((tech) => (
            <span 
              key={tech}
              className="px-2.5 py-1 text-[10px] font-mono font-medium rounded-md bg-secondary/80 text-muted-foreground uppercase border border-border/30"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-border/50 mt-auto" onClick={(e) => e.stopPropagation()}>
          <Button 
            size="sm" 
            className="btn-premium rounded-xl flex-1 gap-1.5 text-xs py-4 font-sans cursor-pointer"
            onClick={() => onOpenModal(project)}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
          </Button>
          
          {project.demo && (
            <Button asChild size="sm" variant="outline" className="rounded-xl border-border hover:bg-secondary px-3 py-4">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Lightbox Portal Overlay Component
interface LightboxProps {
  isOpen: boolean;
  images: string[];
  activeIndex: number;
  title: string;
  language: 'en' | 'ar';
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  activeIndex,
  title,
  language,
  onClose,
  onChangeIndex,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChangeIndex((activeIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onChangeIndex((activeIndex - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, images.length, onChangeIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-7xl flex items-center justify-between text-white border-b border-white/10 pb-4 mb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h4 className="text-lg md:text-xl font-bold font-display">{title}</h4>
          <p className="text-xs text-white/50 font-mono mt-1">
            {language === 'ar' ? `صورة ${activeIndex + 1} من ${images.length}` : `Image ${activeIndex + 1} of ${images.length}`}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-primary transition-all duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div 
        className="relative flex items-center justify-center flex-grow w-full max-w-7xl h-[60vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            onClick={() => onChangeIndex((activeIndex - 1 + images.length) % images.length)}
            className="absolute left-0 md:left-4 z-10 p-3 bg-black/60 border border-white/10 text-white hover:bg-primary rounded-full transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center px-10">
          <img 
            src={images[activeIndex]} 
            alt={`${title} - Gallery Detail`}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={() => onChangeIndex((activeIndex + 1) % images.length)}
            className="absolute right-0 md:right-4 z-10 p-3 bg-black/60 border border-white/10 text-white hover:bg-primary rounded-full transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div 
        className="w-full max-w-7xl flex flex-col items-center gap-4 mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <div className="flex gap-2 max-w-full overflow-x-auto py-2 custom-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onChangeIndex(idx)}
                className={cn(
                  "relative w-16 h-12 flex-shrink-0 border transition-all duration-300 overflow-hidden rounded-md",
                  activeIndex === idx ? "border-primary scale-105" : "border-white/15 opacity-50 hover:opacity-80"
                )}
              >
                <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    activeIndex: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    activeIndex: 0,
    title: '',
  });

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
    };
    fetchProjects();
  }, []);

  const openLightbox = (images: string[], index: number, title: string) => {
    if (images.length === 0) return;
    setLightbox({
      isOpen: true,
      images,
      activeIndex: index,
      title,
    });
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-32 relative bg-background border-t border-border/40">
        <div className="section-container space-y-12">
          <div className="h-10 w-48 bg-muted animate-pulse rounded-xl" />
          <div className="h-80 w-full bg-muted animate-pulse rounded-3xl" />
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

  const featuredProject = filteredProjects.length > 0 ? filteredProjects[0] : null;
  const secondaryProjects = filteredProjects.length > 1 ? filteredProjects.slice(1) : [];

  return (
    <section id="projects" className="py-16 lg:py-20 relative bg-background">
      <div className="section-container">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-start">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-display no-letter-spacing">
                {t('projects.title')}
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-sans overflow-x-auto pb-2 custom-scrollbar">
              {filters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.key)}
                  className={cn(
                    'rounded-lg text-xs px-3.5 py-1.5 font-sans transition-all duration-300',
                    activeFilter === filter.key ? 'btn-premium' : 'border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Project Showcase */}
        {featuredProject && (
          <ScrollReveal direction="up" delay={0.1}>
            <ProjectCard 
              key={featuredProject.id}
              project={featuredProject}
              language={language}
              t={t}
              onOpenLightbox={openLightbox}
              onOpenModal={(proj) => setSelectedProject(proj)}
              isFeatured={true}
            />
          </ScrollReveal>
        )}

        {/* Secondary Projects Grid */}
        {secondaryProjects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryProjects.map((project, idx) => (
              <ScrollReveal key={project.id} direction="up" delay={0.1 + idx * 0.05}>
                <ProjectCard 
                  project={project}
                  language={language}
                  t={t}
                  onOpenLightbox={openLightbox}
                  onOpenModal={(proj) => setSelectedProject(proj)}
                  isFeatured={false}
                />
              </ScrollReveal>
            ))}
          </div>
        )}
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 obsidian-card rounded-2xl">
            <p className="text-muted-foreground font-sans">{language === 'ar' ? 'لا توجد مشاريع لعرضها حالياً.' : 'No projects to display at the moment.'}</p>
          </div>
        )}

      </div>

      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        activeIndex={lightbox.activeIndex}
        title={lightbox.title}
        language={language}
        onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
        onChangeIndex={(idx) => setLightbox(prev => ({ ...prev, activeIndex: idx }))}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default ProjectsSection;
