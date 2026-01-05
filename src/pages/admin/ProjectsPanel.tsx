import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData, Project } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Github, FolderKanban, Star } from 'lucide-react';

const ProjectsPanel: React.FC = () => {
  const { language } = useLanguage();
  const { projects, addProject, updateProject, deleteProject } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    image: '',
    category: 'frontend' as 'frontend' | 'backend' | 'fullstack' | 'mobile',
    technologies: [] as string[],
    liveUrl: '',
    githubUrl: '',
    featured: false,
  };

  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);

  const translations = {
    en: {
      title: 'Projects',
      subtitle: 'Manage your portfolio projects',
      addProject: 'Add Project',
      editProject: 'Edit Project',
      titleEn: 'Title (English)',
      titleAr: 'Title (Arabic)',
      descEn: 'Description (English)',
      descAr: 'Description (Arabic)',
      image: 'Image URL',
      category: 'Category',
      technologies: 'Technologies',
      techPlaceholder: 'Type and press Enter',
      liveUrl: 'Live Demo URL',
      githubUrl: 'GitHub URL',
      featured: 'Featured Project',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this project?',
      saved: 'Project saved successfully!',
      deleted: 'Project deleted successfully!',
      error: 'An error occurred. Please try again.',
      noProjects: 'No projects yet. Add your first project!',
      categories: {
        frontend: 'Frontend',
        backend: 'Backend',
        fullstack: 'Full Stack',
        mobile: 'Mobile',
      },
    },
    ar: {
      title: 'المشاريع',
      subtitle: 'إدارة مشاريع معرض أعمالك',
      addProject: 'إضافة مشروع',
      editProject: 'تعديل المشروع',
      titleEn: 'العنوان (إنجليزي)',
      titleAr: 'العنوان (عربي)',
      descEn: 'الوصف (إنجليزي)',
      descAr: 'الوصف (عربي)',
      image: 'رابط الصورة',
      category: 'الفئة',
      technologies: 'التقنيات',
      techPlaceholder: 'اكتب واضغط Enter',
      liveUrl: 'رابط العرض المباشر',
      githubUrl: 'رابط GitHub',
      featured: 'مشروع مميز',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء',
      delete: 'حذف',
      deleteConfirm: 'هل أنت متأكد من حذف هذا المشروع؟',
      saved: 'تم حفظ المشروع بنجاح!',
      deleted: 'تم حذف المشروع بنجاح!',
      error: 'حدث خطأ. حاول مرة أخرى.',
      noProjects: 'لا توجد مشاريع بعد. أضف أول مشروع!',
      categories: {
        frontend: 'واجهة أمامية',
        backend: 'خلفية',
        fullstack: 'متكامل',
        mobile: 'تطبيقات',
      },
    },
  };

  const texts = translations[language];

  const openAddDialog = () => {
    setEditingProject(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title_en,
      titleAr: project.title_ar,
      description: project.description_en,
      descriptionAr: project.description_ar,
      image: project.image_url,
      category: project.category,
      technologies: [...project.technologies],
      liveUrl: project.live_url || '',
      githubUrl: project.github_url || '',
      featured: project.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await addProject(formData);
      }
      setIsDialogOpen(false);
      toast({ title: texts.saved });
    } catch (error) {
      toast({ title: texts.error, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(texts.deleteConfirm)) {
      try {
        await deleteProject(id);
        toast({ title: texts.deleted });
      } catch (error) {
        toast({ title: texts.error, variant: 'destructive' });
      }
    }
  };

  const addTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData(prev => ({
          ...prev,
          technologies: [...prev.technologies, techInput.trim()],
        }));
      }
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{texts.title}</h1>
          <p className="text-muted-foreground mt-1">{texts.subtitle}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient gap-2" onClick={openAddDialog}>
              <Plus className="h-4 w-4" />
              {texts.addProject}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? texts.editProject : texts.addProject}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.titleEn}</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.titleAr}</Label>
                  <Input
                    value={formData.titleAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{texts.descEn}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{texts.descAr}</Label>
                <Textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                  rows={3}
                  dir="rtl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.image}</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.category}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">{texts.categories.frontend}</SelectItem>
                      <SelectItem value="backend">{texts.categories.backend}</SelectItem>
                      <SelectItem value="fullstack">{texts.categories.fullstack}</SelectItem>
                      <SelectItem value="mobile">{texts.categories.mobile}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{texts.technologies}</Label>
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={addTechnology}
                  placeholder={texts.techPlaceholder}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTechnology(tech)}
                    >
                      {tech} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.liveUrl}</Label>
                  <Input
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.githubUrl}</Label>
                  <Input
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label>{texts.featured}</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {texts.cancel}
                </Button>
                <Button type="submit" className="btn-gradient" disabled={isLoading}>
                  {isLoading ? texts.saving : texts.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{texts.noProjects}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="glass-card border-border/50 overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-muted">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={language === 'ar' ? project.title_ar : project.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderKanban className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {project.is_featured && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">
                  {language === 'ar' ? project.title_ar : project.title_en}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {language === 'ar' ? project.description_ar : project.description_en}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(project)}
                    className="flex-1"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPanel;
