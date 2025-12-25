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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Award, ExternalLink, Calendar } from 'lucide-react';

const CertificatesPanel: React.FC = () => {
  const { language } = useLanguage();
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const initialFormData = {
    title: '',
    titleAr: '',
    issuer: '',
    issuerAr: '',
    date: '',
    credentialUrl: '',
    image: '',
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
      image: 'Certificate Image URL',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this certificate?',
      saved: 'Certificate saved successfully!',
      deleted: 'Certificate deleted successfully!',
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
      image: 'رابط صورة الشهادة',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الشهادة؟',
      saved: 'تم حفظ الشهادة بنجاح!',
      deleted: 'تم حذف الشهادة بنجاح!',
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
      title: certificate.title,
      titleAr: certificate.titleAr,
      issuer: certificate.issuer,
      issuerAr: certificate.issuerAr,
      date: certificate.date,
      credentialUrl: certificate.credentialUrl || '',
      image: certificate.image || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCertificate) {
      updateCertificate(editingCertificate.id, formData);
    } else {
      addCertificate(formData);
    }
    setIsDialogOpen(false);
    toast({ title: texts.saved });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(texts.deleteConfirm)) {
      deleteCertificate(id);
      toast({ title: texts.deleted });
    }
  };

  const formatDate = (dateStr: string) => {
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
                <Input
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, credentialUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>{texts.image}</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {texts.cancel}
                </Button>
                <Button type="submit" className="btn-gradient">
                  {texts.save}
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
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                {certificate.image ? (
                  <img
                    src={certificate.image}
                    alt={language === 'ar' ? certificate.titleAr : certificate.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="h-16 w-16 text-primary/50" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">
                  {language === 'ar' ? certificate.titleAr : certificate.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'ar' ? certificate.issuerAr : certificate.issuer}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(certificate.date)}
                </div>
                <div className="flex gap-2 mt-4">
                  {certificate.credentialUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(certificate.credentialUrl, '_blank')}
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
