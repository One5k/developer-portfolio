import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData, Skill } from '@/contexts/AdminDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
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
import { Plus, Pencil, Trash2, Lightbulb } from 'lucide-react';

const SkillsPanel: React.FC = () => {
  const { language } = useLanguage();
  const { skills, addSkill, updateSkill, deleteSkill } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    name: '',
    nameAr: '',
    category: 'frontend' as const,
    level: 50,
    icon: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const translations = {
    en: {
      title: 'Skills',
      subtitle: 'Manage your technical and soft skills',
      addSkill: 'Add Skill',
      editSkill: 'Edit Skill',
      nameEn: 'Skill Name (English)',
      nameAr: 'Skill Name (Arabic)',
      category: 'Category',
      level: 'Proficiency Level',
      icon: 'Icon Name (optional)',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this skill?',
      saved: 'Skill saved successfully!',
      deleted: 'Skill deleted successfully!',
      error: 'An error occurred. Please try again.',
      noSkills: 'No skills yet. Add your first skill!',
      categories: {
        frontend: 'Frontend',
        backend: 'Backend',
        mobile: 'Mobile',
        tools: 'Tools',
        soft: 'Soft Skills',
      },
    },
    ar: {
      title: 'المهارات',
      subtitle: 'إدارة مهاراتك التقنية والشخصية',
      addSkill: 'إضافة مهارة',
      editSkill: 'تعديل المهارة',
      nameEn: 'اسم المهارة (إنجليزي)',
      nameAr: 'اسم المهارة (عربي)',
      category: 'الفئة',
      level: 'مستوى الإتقان',
      icon: 'اسم الأيقونة (اختياري)',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء',
      delete: 'حذف',
      deleteConfirm: 'هل أنت متأكد من حذف هذه المهارة؟',
      saved: 'تم حفظ المهارة بنجاح!',
      deleted: 'تم حذف المهارة بنجاح!',
      error: 'حدث خطأ. حاول مرة أخرى.',
      noSkills: 'لا توجد مهارات بعد. أضف أول مهارة!',
      categories: {
        frontend: 'واجهة أمامية',
        backend: 'خلفية',
        mobile: 'تطبيقات الجوال',
        tools: 'أدوات',
        soft: 'مهارات شخصية',
      },
    },
  };

  const texts = translations[language];

  const categoryColors = {
    frontend: 'from-blue-500 to-cyan-500',
    backend: 'from-green-500 to-emerald-500',
    mobile: 'from-purple-500 to-pink-500',
    tools: 'from-orange-500 to-amber-500',
    soft: 'from-rose-500 to-red-500',
  };

  const openAddDialog = () => {
    setEditingSkill(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name_en,
      nameAr: skill.name_ar,
      category: skill.category as any,
      level: skill.proficiency,
      icon: skill.icon_name || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, formData);
      } else {
        await addSkill(formData);
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
        await deleteSkill(id);
        toast({ title: texts.deleted });
      } catch (error) {
        toast({ title: texts.error, variant: 'destructive' });
      }
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
              {texts.addSkill}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? texts.editSkill : texts.addSkill}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.nameEn}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.nameAr}</Label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    dir="rtl"
                    required
                  />
                </div>
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
                    <SelectItem value="mobile">{texts.categories.mobile}</SelectItem>
                    <SelectItem value="tools">{texts.categories.tools}</SelectItem>
                    <SelectItem value="soft">{texts.categories.soft}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{texts.level}: {formData.level}%</Label>
                <Slider
                  value={[formData.level]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, level: value }))}
                  max={100}
                  step={5}
                />
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

      {skills.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{texts.noSkills}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <Card key={category} className="glass-card border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]}`} />
                  {texts.categories[category as keyof typeof texts.categories]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 rounded-lg bg-muted/30 border border-border/50 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">
                          {language === 'ar' ? skill.name_ar : skill.name_en}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => openEditDialog(skill)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]}`}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {skill.proficiency}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPanel;
