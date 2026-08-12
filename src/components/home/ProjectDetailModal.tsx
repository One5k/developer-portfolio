import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Layers, Calendar, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ProjectDetail {
  id: number;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  techStack: string[];
  category: string;
  github?: string;
  demo?: string;
  features?: { en: string; ar: string }[];
}

interface ProjectDetailModalProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
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

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveImageIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const images = getProjectImages(project.image);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border/80 rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar z-10 text-start flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-card/90 backdrop-blur-md border-b border-border/50">
              <div>
                <span className="text-xs font-mono uppercase text-primary font-semibold tracking-wider">
                  {project.category}
                </span>
                <h3 className="text-2xl font-extrabold text-foreground font-display no-letter-spacing mt-0.5">
                  {project.title[language]}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border/50 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Media Gallery Canvas */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-muted border border-border/60">
                    <img
                      src={images[activeImageIndex]}
                      alt={project.title[language]}
                      className="w-full h-full object-cover"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                          className="absolute start-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white border border-white/20 hover:bg-primary transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                          className="absolute end-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white border border-white/20 hover:bg-primary transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-20 h-14 rounded-xl overflow-hidden border transition-all ${
                            activeImageIndex === idx ? 'border-primary ring-2 ring-primary/40' : 'border-border/40 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Project Description Narrative */}
              <div className="space-y-4">
                <h4 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest">
                  {language === 'ar' ? 'تفاصيل المشروع والحلول' : 'PROJECT OVERVIEW'}
                </h4>
                <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-sans whitespace-pre-wrap">
                  {project.description[language]}
                </p>
              </div>

              {/* Technologies Matrix */}
              <div className="space-y-4">
                <h4 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>{language === 'ar' ? 'التقنيات والمكتبات المستخدمة' : 'TECHNOLOGY STACK'}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-xl bg-secondary text-foreground border border-border/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
                {project.demo && (
                  <Button asChild size="lg" className="btn-premium rounded-xl px-7 py-6 text-sm gap-2 flex-1 sm:flex-none">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span>{t('projects.view.demo')}</span>
                    </a>
                  </Button>
                )}
                {project.github && (
                  <Button asChild size="lg" variant="outline" className="rounded-xl border-border/80 hover:bg-secondary px-7 py-6 text-sm text-foreground flex-1 sm:flex-none">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      <span>{language === 'ar' ? 'مستودع الكود' : 'Source Code'}</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
