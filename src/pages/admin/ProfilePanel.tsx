import React, { useState } from 'react';
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
  const [formData, setFormData] = useState<Profile>(profile);

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
      saved: 'Profile updated successfully!',
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
      saved: 'تم تحديث الملف الشخصي بنجاح!',
      personal: 'المعلومات الشخصية',
      social: 'روابط التواصل',
      contact: 'معلومات الاتصال',
    },
  };

  const texts = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    toast({
      title: texts.saved,
    });
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
              <Label htmlFor="name">{texts.nameEn}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">{texts.nameAr}</Label>
              <Input
                id="nameAr"
                value={formData.nameAr}
                onChange={(e) => handleChange('nameAr', e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">{texts.titleEn}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">{texts.titleAr}</Label>
              <Input
                id="titleAr"
                value={formData.titleAr}
                onChange={(e) => handleChange('titleAr', e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">{texts.bioEn}</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bioAr">{texts.bioAr}</Label>
              <Textarea
                id="bioAr"
                value={formData.bioAr}
                onChange={(e) => handleChange('bioAr', e.target.value)}
                rows={3}
                dir="rtl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="avatar">{texts.avatar}</Label>
              <Input
                id="avatar"
                value={formData.avatar || ''}
                onChange={(e) => handleChange('avatar', e.target.value)}
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
                  value={formData.email}
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
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{texts.locationEn}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationAr">{texts.locationAr}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="locationAr"
                  value={formData.locationAr}
                  onChange={(e) => handleChange('locationAr', e.target.value)}
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
              <Label htmlFor="github">{texts.github}</Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  value={formData.github || ''}
                  onChange={(e) => handleChange('github', e.target.value)}
                  className="pl-10"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">{texts.linkedin}</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  value={formData.linkedin || ''}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="pl-10"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">{texts.twitter}</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  value={formData.twitter || ''}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  className="pl-10"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="btn-gradient gap-2">
          <Save className="h-4 w-4" />
          {texts.save}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePanel;
