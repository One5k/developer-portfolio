import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData, Education } from '@/contexts/AdminDataContext';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const EducationPanel: React.FC = () => {
    const { language } = useLanguage();
    const { education, addEducation, updateEducation, deleteEducation } = useAdminData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCurrentStudy, setIsCurrentStudy] = useState(false);

    const initialFormData = {
        degree: '',
        degreeAr: '',
        institution: '',
        institutionAr: '',
        fieldOfStudy: '',
        fieldOfStudyAr: '',
        startDate: '',
        endDate: '',
        description: '',
        descriptionAr: '',
        location: '',
        locationAr: '',
        gpa: '',
    };

    const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);

    const translations = {
        en: {
            title: 'Education',
            subtitle: 'Manage your academic background',
            addEducation: 'Add Education',
            editEducation: 'Edit Education',
            degree: 'Degree (English)',
            degreeAr: 'Degree (Arabic)',
            institution: 'Institution (English)',
            institutionAr: 'Institution (Arabic)',
            fieldOfStudy: 'Field of Study (English)',
            fieldOfStudyAr: 'Field of Study (Arabic)',
            startDate: 'Start Date',
            endDate: 'End Date',
            currentStudy: 'I am currently studying here',
            description: 'Description (English)',
            descriptionAr: 'Description (Arabic)',
            location: 'Location (English)',
            locationAr: 'Location (Arabic)',
            gpa: 'GPA (optional)',
            save: 'Save',
            saving: 'Saving...',
            cancel: 'Cancel',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this education record?',
            saved: 'Education saved successfully!',
            deleted: 'Education deleted successfully!',
            error: 'An error occurred. Please try again.',
            noEducation: 'No education records yet. Add your academic history!',
        },
        ar: {
            title: 'التعليم',
            subtitle: 'إدارة مؤهلاتك الأكاديمية',
            addEducation: 'إضافة مؤهل',
            editEducation: 'تعديل المؤهل',
            degree: 'الدرجة العلمية (إنجليزي)',
            degreeAr: 'الدرجة العلمية (عربي)',
            institution: 'المؤسسة التعليمية (إنجليزي)',
            institutionAr: 'المؤسسة التعليمية (عربي)',
            fieldOfStudy: 'التخصص (إنجليزي)',
            fieldOfStudyAr: 'التخصص (عربي)',
            startDate: 'تاريخ البدء',
            endDate: 'تاريخ التخرج',
            currentStudy: 'أدرس هنا حالياً',
            description: 'الوصف (إنجليزي)',
            descriptionAr: 'الوصف (عربي)',
            location: 'الموقع (إنجليزي)',
            locationAr: 'الموقع (عربي)',
            gpa: 'المعدل التراكمي (اختياري)',
            save: 'حفظ',
            saving: 'جاري الحفظ...',
            cancel: 'إلغاء',
            delete: 'حذف',
            deleteConfirm: 'هل أنت متأكد من حذف هذا السجل التعليمي؟',
            saved: 'تم حفظ المؤهل بنجاح!',
            deleted: 'تم حذف المؤهل بنجاح!',
            error: 'حدث خطأ. حاول مرة أخرى.',
            noEducation: 'لا توجد مؤهلات بعد. أضف تاريخك الأكاديمي!',
        },
    };

    const texts = translations[language];

    const openAddDialog = () => {
        setEditingEducation(null);
        setFormData(initialFormData);
        setIsCurrentStudy(false);
        setIsDialogOpen(true);
    };

    const openEditDialog = (edu: Education) => {
        setEditingEducation(edu);
        setFormData({
            degree: edu.degree_en,
            degreeAr: edu.degree_ar,
            institution: edu.institution_en,
            institutionAr: edu.institution_ar,
            fieldOfStudy: edu.field_of_study_en || '',
            fieldOfStudyAr: edu.field_of_study_ar || '',
            startDate: edu.start_date ? edu.start_date.split('T')[0] : '',
            endDate: edu.end_date ? edu.end_date.split('T')[0] : '',
            description: edu.description_en || '',
            descriptionAr: edu.description_ar || '',
            location: edu.location_en || '',
            locationAr: edu.location_ar || '',
            gpa: edu.gpa || '',
        });
        setIsCurrentStudy(!edu.end_date);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                degree_en: formData.degree,
                degree_ar: formData.degreeAr,
                institution_en: formData.institution,
                institution_ar: formData.institutionAr,
                field_of_study_en: formData.fieldOfStudy,
                field_of_study_ar: formData.fieldOfStudyAr,
                start_date: formData.startDate,
                end_date: isCurrentStudy ? null : formData.endDate,
                description_en: formData.description,
                description_ar: formData.descriptionAr,
                location_en: formData.location,
                location_ar: formData.locationAr,
                gpa: formData.gpa,
            };

            if (editingEducation) {
                await updateEducation(editingEducation.id, payload);
            } else {
                await addEducation(payload);
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
                await deleteEducation(id);
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
                            {texts.addEducation}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingEducation ? texts.editEducation : texts.addEducation}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{texts.degree}</Label>
                                    <Input
                                        value={formData.degree}
                                        onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{texts.degreeAr}</Label>
                                    <Input
                                        value={formData.degreeAr}
                                        onChange={(e) => setFormData(prev => ({ ...prev, degreeAr: e.target.value }))}
                                        dir="rtl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{texts.institution}</Label>
                                    <Input
                                        value={formData.institution}
                                        onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{texts.institutionAr}</Label>
                                    <Input
                                        value={formData.institutionAr}
                                        onChange={(e) => setFormData(prev => ({ ...prev, institutionAr: e.target.value }))}
                                        dir="rtl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{texts.fieldOfStudy}</Label>
                                    <Input
                                        value={formData.fieldOfStudy}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{texts.fieldOfStudyAr}</Label>
                                    <Input
                                        value={formData.fieldOfStudyAr}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fieldOfStudyAr: e.target.value }))}
                                        dir="rtl"
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
                                        disabled={isCurrentStudy}
                                        required={!isCurrentStudy}
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <Switch
                                            checked={isCurrentStudy}
                                            onCheckedChange={setIsCurrentStudy}
                                            id="current-study"
                                        />
                                        <Label htmlFor="current-study">{texts.currentStudy}</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{texts.location}</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
                                <Label>{texts.gpa}</Label>
                                <Input
                                    value={formData.gpa}
                                    onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                                    placeholder="e.g. 3.8/4.0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{texts.description}</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{texts.descriptionAr}</Label>
                                <Textarea
                                    value={formData.descriptionAr}
                                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                                    rows={3}
                                    dir="rtl"
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

            {education.length === 0 ? (
                <Card className="glass-card border-border/50">
                    <CardContent className="py-12 text-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">{texts.noEducation}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {education.map((edu) => (
                        <Card key={edu.id} className="glass-card border-border/50 overflow-hidden group hover:bg-muted/30 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-primary/10 mt-1">
                                            <GraduationCap className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                {language === 'ar' ? edu.degree_ar : edu.degree_en}
                                            </h3>
                                            <p className="text-lg text-primary font-medium">
                                                {language === 'ar' ? edu.institution_ar : edu.institution_en}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <span className="font-medium">
                                                    {language === 'ar' ? edu.field_of_study_ar : edu.field_of_study_en}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : (language === 'ar' ? 'الآن' : 'Present')}
                                                    </span>
                                                </div>
                                                {(edu.location_en || edu.location_ar) && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{language === 'ar' ? edu.location_ar : edu.location_en}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground">
                                                {language === 'ar' ? edu.description_ar : edu.description_en}
                                            </p>
                                            {edu.gpa && (
                                                <p className="text-sm text-primary/80 mt-2 font-medium">
                                                    {language === 'ar' ? 'المعدل: ' : 'GPA: '} {edu.gpa}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEditDialog(edu)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(edu.id)}
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

export default EducationPanel;
