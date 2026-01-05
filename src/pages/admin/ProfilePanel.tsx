import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData, Profile } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const ProfilePanel: React.FC = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useAdminData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with empty defaults to prevent controlled/uncontrolled errors
  const [formData, setFormData] = useState<Profile>({
    id: '',
    user_id: '',
    name_en: '',
    name_ar: '',
    title_en: '',
    title_ar: '',
    bio_en: '',
    bio_ar: '',
    email: '',
    phone: '',
    location_en: '',
    location_ar: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    avatar_url: '',
    resume_url: '',
    created_at: '',
    updated_at: ''
  });

  // Update form data when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const translations = {
    en: {
      title: 'Profile Settings',
      subtitle: 'Manage your personal information',
      nameEn: 'Name (English)',
      nameAr: 'Name (Arabic)',
      titleEn: 'Job Title (English)',
      titleAr: 'Job Title (Arabic)',
      bioEn: 'Bio (English)',
      bioAr: 'Bio (Arabic)',
      email: 'Email',
      phone: 'Phone',
      locationEn: 'Location (English)',
      locationAr: 'Location (Arabic)',
      github: 'GitHub URL',
      linkedin: 'LinkedIn URL',
      twitter: 'Twitter URL',
      avatar: 'Avatar URL',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Profile updated successfully!',
      error: 'An error occurred. Please try again.',
      personal: 'Personal Info',
      social: 'Social Links',
      contact: 'Contact Info',
    },
    ar: {
      title: 'إعدادات الملف الشخصي',
      subtitle: 'إدارة معلوماتك الشخصية',
      nameEn: 'الاسم (إنجليزي)',
      nameAr: 'الاسم (عربي)',
      titleEn: 'المسمى الوظيفي (إنجليزي)',
      titleAr: 'المسمى الوظيفي (عربي)',
      bioEn: 'النبذة (إنجليزي)',
      bioAr: 'النبذة (عربي)',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      locationEn: 'الموقع (إنجليزي)',
      locationAr: 'الموقع (عربي)',
      github: 'رابط GitHub',
      linkedin: 'رابط LinkedIn',
      twitter: 'رابط Twitter',
      avatar: 'رابط الصورة الشخصية',
      save: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',
      saved: 'تم تحديث الملف الشخصي بنجاح!',
      error: 'حدث خطأ. حاول مرة أخرى.',
      personal: 'المعلومات الشخصية',
      social: 'روابط التواصل',
      contact: 'معلومات الاتصال',
    },
  };

  const texts = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast({
        title: texts.saved,
      });
    } catch (error) {
      toast({ title: texts.error, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{texts.title}</h1>
        <p className="text-muted-foreground mt-1">{texts.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {texts.personal}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_en">{texts.nameEn}</Label>
              <Input
                id="name_en"
                value={formData.name_en || ''}
                onChange={(e) => handleChange('name_en', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">{texts.nameAr}</Label>
              <Input
                id="name_ar"
                value={formData.name_ar || ''}
                onChange={(e) => handleChange('name_ar', e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">{texts.titleEn}</Label>
              <Input
                id="title_en"
                value={formData.title_en || ''}
                onChange={(e) => handleChange('title_en', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_ar">{texts.titleAr}</Label>
              <Input
                id="title_ar"
                value={formData.title_ar || ''}
                onChange={(e) => handleChange('title_ar', e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio_en">{texts.bioEn}</Label>
              <Textarea
                id="bio_en"
                value={formData.bio_en || ''}
                onChange={(e) => handleChange('bio_en', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio_ar">{texts.bioAr}</Label>
              <Textarea
                id="bio_ar"
                value={formData.bio_ar || ''}
                onChange={(e) => handleChange('bio_ar', e.target.value)}
                rows={3}
                dir="rtl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="avatar_url">{texts.avatar}</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url || ''}
                onChange={(e) => handleChange('avatar_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="resume_url">{language === 'ar' ? 'رابط السيرة الذاتية' : 'Resume URL'}</Label>
              <Input
                id="resume_url"
                value={formData.resume_url || ''}
                onChange={(e) => handleChange('resume_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {texts.contact}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{texts.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{texts.phone}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_en">{texts.locationEn}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location_en"
                  value={formData.location_en || ''}
                  onChange={(e) => handleChange('location_en', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_ar">{texts.locationAr}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location_ar"
                  value={formData.location_ar || ''}
                  onChange={(e) => handleChange('location_ar', e.target.value)}
                  className="pl-10"
                  dir="rtl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5 text-primary" />
              {texts.social}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url">{texts.github}</Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github_url"
                  value={formData.github_url || ''}
                  onChange={(e) => handleChange('github_url', e.target.value)}
                  className="pl-10"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">{texts.linkedin}</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  className="pl-10"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">{texts.twitter}</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter_url"
                  value={formData.twitter_url || ''}
                  onChange={(e) => handleChange('twitter_url', e.target.value)}
                  className="pl-10"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="btn-gradient gap-2" disabled={isLoading}>
          <Save className="h-4 w-4" />
          {isLoading ? texts.saving : texts.save}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePanel;
