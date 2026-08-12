import React, { useState, useRef } from 'react';
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
  DialogDescription,
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
import { 
  Plus, Pencil, Trash2, FolderKanban, Star, 
  ChevronLeft, ChevronRight, Upload, Loader2, Link as LinkIcon 
} from 'lucide-react';
import { uploadApi } from '@/lib/api';

// Helper to safely parse image URLs (handles single URL, comma-separated lists, and JSON arrays)
const getProjectImages = (urlStr: string | null | undefined): string[] => {
  if (!urlStr) return [];
  const trimmed = urlStr.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((u: string) => u.trim()).filter(Boolean);
    } catch (e) {
      // Fallback on JSON parse error
    }
  }
  return trimmed.split(',').map((u) => u.trim()).filter(Boolean);
};

const ProjectsPanel: React.FC = () => {
  const { language } = useLanguage();
  const { projects, addProject, updateProject, deleteProject } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialFormData = {
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    image: '[]', // Stores JSON stringified array of images
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
      images: 'Project Gallery (Multiple Images)',
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
      noImages: 'No images added to the project gallery yet.',
      addUrl: 'Add URL',
      upload: 'Upload File',
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
      images: 'معرض صور المشروع (صور متعددة)',
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
      noImages: 'لم يتم إضافة صور لمعرض المشروع بعد.',
      addUrl: 'إضافة رابط',
      upload: 'رفع ملف',
      categories: {
        frontend: 'واجهة أمامية',
        backend: 'خلفية',
        fullstack: 'متكامل',
        mobile: 'تطبيقات',
      },
    },
  };

  const texts = translations[language];
  const currentImagesList = getProjectImages(formData.image);

  const openAddDialog = () => {
    setEditingProject(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    
    // Normalise image value to JSON string
    let initialImageVal = '[]';
    if (project.image_url) {
      const parsed = getProjectImages(project.image_url);
      initialImageVal = JSON.stringify(parsed);
    }

    setFormData({
      title: project.title_en,
      titleAr: project.title_ar,
      description: project.description_en,
      descriptionAr: project.description_ar,
      image: initialImageVal,
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

  // Multi-image handlers
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      const updated = [...currentImagesList, newImageUrl.trim()];
      setFormData(prev => ({ ...prev, image: JSON.stringify(updated) }));
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadApi.uploadFile(file);
      if (res.success && res.url) {
        const updated = [...currentImagesList, res.url];
        setFormData(prev => ({ ...prev, image: JSON.stringify(updated) }));
        toast({ title: "Image uploaded and added to project" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Upload failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = currentImagesList.filter((_, idx) => idx !== indexToRemove);
    setFormData(prev => ({ ...prev, image: JSON.stringify(updated) }));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === currentImagesList.length - 1) return;

    const newIndex = direction === 'left' ? index - 1 : index + 1;
    const updated = [...currentImagesList];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    setFormData(prev => ({ ...prev, image: JSON.stringify(updated) }));
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border border-border">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? texts.editProject : texts.addProject}
              </DialogTitle>
              <DialogDescription>
                {texts.subtitle}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.titleEn}</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="rounded-none border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.titleAr}</Label>
                  <Input
                    value={formData.titleAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                    dir="rtl"
                    required
                    className="rounded-none border-border"
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
                  className="rounded-none border-border"
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
                  className="rounded-none border-border"
                />
              </div>

              {/* Multi-Image Section */}
              <div className="space-y-4 border border-border/50 p-4 bg-muted/10 rounded-none">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">{texts.images}</Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {currentImagesList.length} {language === 'ar' ? 'صور' : 'images'}
                  </span>
                </div>
                
                {/* Images Preview Grid */}
                {currentImagesList.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentImagesList.map((img, idx) => (
                      <div key={idx} className="relative aspect-video border border-border group bg-muted/20 overflow-hidden">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Control Actions Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="self-end bg-destructive text-white p-1 hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="flex justify-between w-full">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, 'left')}
                              className="bg-black/90 text-white p-1 hover:bg-primary disabled:opacity-30 disabled:hover:bg-black/90 transition-colors"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[10px] text-white/90 font-mono self-center">{idx + 1}</span>
                            <button
                              type="button"
                              disabled={idx === currentImagesList.length - 1}
                              onClick={() => handleMoveImage(idx, 'right')}
                              className="bg-black/90 text-white p-1 hover:bg-primary disabled:opacity-30 disabled:hover:bg-black/90 transition-colors"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60 italic py-4 text-center">{texts.noImages}</p>
                )}

                {/* Adding New Image URL or Uploading file */}
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <div className="flex gap-2">
                    <Input
                      placeholder={language === 'ar' ? 'أدخل رابط الصورة مباشر...' : 'Enter direct image URL...'}
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="rounded-none border-border"
                    />
                    <Button type="button" variant="secondary" className="rounded-none gap-1.5" onClick={handleAddImageUrl}>
                      <LinkIcon className="h-3.5 w-3.5" />
                      {texts.addUrl}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-none border-border w-full gap-2 text-xs"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          {texts.upload}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{texts.category}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="rounded-none border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="frontend">{texts.categories.frontend}</SelectItem>
                    <SelectItem value="backend">{texts.categories.backend}</SelectItem>
                    <SelectItem value="fullstack">{texts.categories.fullstack}</SelectItem>
                    <SelectItem value="mobile">{texts.categories.mobile}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{texts.technologies}</Label>
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={addTechnology}
                  placeholder={texts.techPlaceholder}
                  className="rounded-none border-border"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="cursor-pointer rounded-none text-xs"
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
                    className="rounded-none border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.githubUrl}</Label>
                  <Input
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="rounded-none border-border"
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

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" className="rounded-none border-border" onClick={() => setIsDialogOpen(false)}>
                  {texts.cancel}
                </Button>
                <Button type="submit" className="btn-gradient rounded-none" disabled={isLoading}>
                  {isLoading ? texts.saving : texts.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="glass-card-premium rounded-none border-border/50">
          <CardContent className="py-12 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{texts.noProjects}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const firstImage = getProjectImages(project.image_url)[0] || '';
            return (
              <Card key={project.id} className="glass-card-premium rounded-none border-border/50 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={language === 'ar' ? project.title_ar : project.title_en}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {project.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-primary rounded-none">
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
                      <Badge key={tech} variant="outline" className="text-xs rounded-none border-border">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs rounded-none border-border">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(project)}
                      className="flex-1 rounded-none border-border hover:bg-secondary"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project.id)}
                      className="rounded-none"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPanel;
