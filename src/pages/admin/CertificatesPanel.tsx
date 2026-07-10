import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData, Certificate } from '@/contexts/AdminDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Award, ExternalLink, Calendar } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

const CertificatesPanel: React.FC = () => {
  const { language } = useLanguage();
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    title: '',
    titleAr: '',
    issuer: '',
    issuerAr: '',
    date: '',
    credentialUrl: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const translations = {
    en: {
      title: 'Certificates',
      subtitle: 'Manage your certifications and education',
      addCertificate: 'Add Certificate',
      editCertificate: 'Edit Certificate',
      titleEn: 'Certificate Title (English)',
      titleAr: 'Certificate Title (Arabic)',
      issuerEn: 'Issuer (English)',
      issuerAr: 'Issuer (Arabic)',
      date: 'Date',
      credentialUrl: 'Credential URL',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this certificate?',
      saved: 'Certificate saved successfully!',
      deleted: 'Certificate deleted successfully!',
      error: 'An error occurred. Please try again.',
      noCertificates: 'No certificates yet. Add your first certificate!',
      viewCredential: 'View Credential',
    },
    ar: {
      title: 'الشهادات',
      subtitle: 'إدارة شهاداتك وتعليمك',
      addCertificate: 'إضافة شهادة',
      editCertificate: 'تعديل الشهادة',
      titleEn: 'عنوان الشهادة (إنجليزي)',
      titleAr: 'عنوان الشهادة (عربي)',
      issuerEn: 'الجهة المانحة (إنجليزي)',
      issuerAr: 'الجهة المانحة (عربي)',
      date: 'التاريخ',
      credentialUrl: 'رابط الشهادة',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء',
      delete: 'حذف',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الشهادة؟',
      saved: 'تم حفظ الشهادة بنجاح!',
      deleted: 'تم حذف الشهادة بنجاح!',
      error: 'حدث خطأ. حاول مرة أخرى.',
      noCertificates: 'لا توجد شهادات بعد. أضف أول شهادة!',
      viewCredential: 'عرض الشهادة',
    },
  };

  const texts = translations[language];

  const openAddDialog = () => {
    setEditingCertificate(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      title: certificate.title_en,
      titleAr: certificate.title_ar,
      issuer: certificate.issuer_en,
      issuerAr: certificate.issuer_ar,
      date: certificate.issue_date,
      credentialUrl: certificate.credential_url || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingCertificate) {
        await updateCertificate(editingCertificate.id, formData);
      } else {
        await addCertificate(formData);
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
        await deleteCertificate(id);
        toast({ title: texts.deleted });
      } catch (error) {
        toast({ title: texts.error, variant: 'destructive' });
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
    });
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
              {texts.addCertificate}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCertificate ? texts.editCertificate : texts.addCertificate}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.issuerEn}</Label>
                  <Input
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.issuerAr}</Label>
                  <Input
                    value={formData.issuerAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuerAr: e.target.value }))}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{texts.date}</Label>
                <Input
                  type="month"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{texts.credentialUrl}</Label>
                <ImageUpload
                  value={formData.credentialUrl}
                  onChange={(url) => setFormData(prev => ({ ...prev, credentialUrl: url }))}
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

      {certificates.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{texts.noCertificates}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="glass-card border-border/50 overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Award className="h-16 w-16 text-primary/50" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">
                  {language === 'ar' ? certificate.title_ar : certificate.title_en}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'ar' ? certificate.issuer_ar : certificate.issuer_en}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(certificate.issue_date)}
                </div>
                <div className="flex gap-2 mt-4">
                  {certificate.credential_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(certificate.credential_url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {texts.viewCredential}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(certificate)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(certificate.id)}
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

export default CertificatesPanel;
