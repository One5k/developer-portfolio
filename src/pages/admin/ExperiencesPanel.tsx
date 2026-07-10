import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData, Experience } from '@/contexts/AdminDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Briefcase, Calendar, MapPin } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Globe } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

const ExperiencesPanel: React.FC = () => {
  const { language } = useLanguage();
  const { experiences, addExperience, updateExperience, deleteExperience } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const initialFormData = {
    company: '',
    companyAr: '',
    position: '',
    positionAr: '',
    startDate: '',
    endDate: '',
    description: '',
    descriptionAr: '',
    companyUrl: '',
    companyLogo: '',
    location: '',
    locationAr: '',
  };

  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);

  const translations = {
    en: {
      title: 'Work Experience',
      subtitle: 'Manage your professional journey',
      addExperience: 'Add Experience',
      editExperience: 'Edit Experience',
      company: 'Company (English)',
      companyAr: 'Company (Arabic)',
      position: 'Position (English)',
      positionAr: 'Position (Arabic)',
      startDate: 'Start Date',
      endDate: 'End Date',
      currentJob: 'I currently work here',
      description: 'Description (English)',
      descriptionAr: 'Description (Arabic)',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      delete: 'Delete',
      companyUrl: 'Company Website',
      companyLogo: 'Company Logo',
      location: 'Location (English)',
      locationAr: 'Location (Arabic)',
      deleteConfirm: 'Are you sure you want to delete this experience?',
      saved: 'Experience saved successfully!',
      deleted: 'Experience deleted successfully!',
      error: 'An error occurred. Please try again.',
      noExperiences: 'No experiences yet. Add your first job!',
    },
    ar: {
      title: 'الخبرات العملية',
      subtitle: 'إدارة مسارك المهني',
      addExperience: 'إضافة خبرة',
      editExperience: 'تعديل الخبرة',
      company: 'الشركة (إنجليزي)',
      companyAr: 'الشركة (عربي)',
      position: 'المسمى الوظيفي (إنجليزي)',
      positionAr: 'المسمى الوظيفي (عربي)',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      currentJob: 'أعمل هنا حالياً',
      description: 'الوصف (إنجليزي)',
      descriptionAr: 'الوصف (عربي)',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء',
      delete: 'حذف',
      companyUrl: 'موقع الشركة',
      companyLogo: 'شعار الشركة',
      location: 'الموقع (إنجليزي)',
      locationAr: 'الموقع (عربي)',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الخبرة؟',
      saved: 'تم حفظ الخبرة بنجاح!',
      deleted: 'تم حذف الخبرة بنجاح!',
      error: 'حدث خطأ. حاول مرة أخرى.',
      noExperiences: 'لا توجد خبرات بعد. أضف أول وظيفة لك!',
    },
  };

  const texts = translations[language];

  const openAddDialog = () => {
    setEditingExperience(null);
    setFormData(initialFormData);
    setIsCurrentJob(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      company: exp.company_en,
      companyAr: exp.company_ar,
      position: exp.position_en,
      positionAr: exp.position_ar,
      // Format dates for input type="date"
      startDate: exp.start_date.split('T')[0],
      endDate: exp.end_date ? exp.end_date.split('T')[0] : '',
      description: exp.description_en,
      descriptionAr: exp.description_ar,
      companyUrl: exp.company_url || '',
      companyLogo: exp.company_logo_url || '',
      location: exp.location_en || '',
      locationAr: exp.location_ar || '',
    });
    setIsCurrentJob(!exp.end_date);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        company_en: formData.company,
        company_ar: formData.companyAr,
        position_en: formData.position,
        position_ar: formData.positionAr,
        start_date: formData.startDate,
        end_date: isCurrentJob ? null : formData.endDate,
        description_en: formData.description,
        description_ar: formData.descriptionAr,
        company_url: formData.companyUrl,
        location_en: formData.location,
        location_ar: formData.locationAr,
        type: 'work', // Default type
        company_logo_url: formData.companyLogo,
      };

      if (editingExperience) {
        await updateExperience(editingExperience.id, payload);
      } else {
        await addExperience(payload);
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
        await deleteExperience(id);
        toast({ title: texts.deleted });
      } catch (error) {
        toast({ title: texts.error, variant: 'destructive' });
      }
    }
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
              {texts.addExperience}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? texts.editExperience : texts.addExperience}
              </DialogTitle>
              <DialogDescription>
                {texts.subtitle}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.position}</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.positionAr}</Label>
                  <Input
                    value={formData.positionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, positionAr: e.target.value }))}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.company}</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.companyAr}</Label>
                  <Input
                    value={formData.companyAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyAr: e.target.value }))}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.startDate}</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.endDate}</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={isCurrentJob}
                    required={!isCurrentJob}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Switch
                      checked={isCurrentJob}
                      onCheckedChange={setIsCurrentJob}
                      id="current-job"
                    />
                    <Label htmlFor="current-job">{texts.currentJob}</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{texts.description}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{texts.descriptionAr}</Label>
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
                  <Label>{texts.location}</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Remote, Riyadh"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.locationAr}</Label>
                  <Input
                    value={formData.locationAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{texts.companyUrl}</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.companyUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyUrl: e.target.value }))}
                    className="pl-10"
                    placeholder="https://..."
                  />
                </div>
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

      {experiences.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{texts.noExperiences}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id} className="glass-card border-border/50 overflow-hidden group hover:bg-muted/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 mt-1">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {language === 'ar' ? exp.position_ar : exp.position_en}
                      </h3>
                      <p className="text-lg text-primary font-medium">
                        {language === 'ar' ? exp.company_ar : exp.company_en}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : (language === 'ar' ? 'الآن' : 'Present')}
                        </span>
                      </div>
                      {(exp.location_en || exp.location_ar) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{language === 'ar' ? exp.location_ar : exp.location_en}</span>
                        </div>
                      )}
                      <p className="text-muted-foreground">
                        {language === 'ar' ? exp.description_ar : exp.description_en}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(exp)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperiencesPanel;
