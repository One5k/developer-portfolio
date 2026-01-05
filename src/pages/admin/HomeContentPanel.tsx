import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData, HeroData, AboutData } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Save, Image as ImageIcon, FileText, BarChart3, LayoutTemplate } from 'lucide-react';

const HomeContentPanel: React.FC = () => {
  const { language } = useLanguage();
  const { hero, about, updateHero, updateAbout } = useAdminData();
  const { toast } = useToast();
  const [isHeroLoading, setIsHeroLoading] = useState(false);
  const [isAboutLoading, setIsAboutLoading] = useState(false);

  // Hero Form State
  const [heroForm, setHeroForm] = useState<HeroData>({
    greeting_en: '',
    greeting_ar: '',
    title_en: '',
    title_ar: '',
    subtitle_en: '',
    subtitle_ar: '',
    description_en: '',
    description_ar: '',
    hero_image_url: '',
  });

  // About Form State
  const [aboutForm, setAboutForm] = useState<AboutData>({
    bio_en: '',
    bio_ar: '',
    years_of_experience: 0,
    completed_projects_count: 0,
    happy_clients_count: 0,
  });

  useEffect(() => {
    if (hero) setHeroForm(hero);
    if (about) setAboutForm(about);
  }, [hero, about]);

  const translations = {
    en: {
      title: 'Home Content Manager',
      subtitle: 'Manage content for Hero and About sections',
      heroTab: 'Hero Section',
      aboutTab: 'About & Stats',
      greetingEn: 'Greeting (English)',
      greetingAr: 'Greeting (Arabic)',
      titleEn: 'Main Title (English)',
      titleAr: 'Main Title (Arabic)',
      subtitleEn: 'Subtitle (English)',
      subtitleAr: 'Subtitle (Arabic)',
      descEn: 'Description (English)',
      descAr: 'Description (Arabic)',
      heroImage: 'Hero Image URL',
      yearsExp: 'Years of Experience',
      projectsCount: 'Completed Projects',
      clientsCount: 'Happy Clients',
      bioEn: 'About Bio (English)',
      bioAr: 'About Bio (Arabic)',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Content updated successfully!',
      error: 'An error occurred. Please try again.',
      heroDesc: 'Customize the first impression of your website.',
      aboutDesc: 'Update your professional statistics and biography.',
    },
    ar: {
      title: 'مدير محتوى الصفحة الرئيسية',
      subtitle: 'إدارة محتوى قسم الهيرو ومن أنا',
      heroTab: 'قسم الهيرو',
      aboutTab: 'من أنا والإحصائيات',
      greetingEn: 'التحية (إنجليزي)',
      greetingAr: 'التحية (عربي)',
      titleEn: 'العنوان الرئيسي (إنجليزي)',
      titleAr: 'العنوان الرئيسي (عربي)',
      subtitleEn: 'العنوان الفرعي (إنجليزي)',
      subtitleAr: 'العنوان الفرعي (عربي)',
      descEn: 'الوصف (إنجليزي)',
      descAr: 'الوصف (عربي)',
      heroImage: 'رابط صورة الهيرو',
      yearsExp: 'سنوات الخبرة',
      projectsCount: 'المشاريع المكتملة',
      clientsCount: 'العملاء السعداء',
      bioEn: 'نبذة عني (إنجليزي)',
      bioAr: 'نبذة عني (عربي)',
      save: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',
      saved: 'تم تحديث المحتوى بنجاح!',
      error: 'حدث خطأ. حاول مرة أخرى.',
      heroDesc: 'قم بتخصيص الانطباع الأول لموقعك.',
      aboutDesc: 'قم بتحديث إحصائياتك المهنية ونبذتك.',
    },
  };

  const texts = translations[language];

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsHeroLoading(true);
    try {
      await updateHero(heroForm);
      toast({ title: texts.saved });
    } catch (error) {
      toast({ title: texts.error, variant: 'destructive' });
    } finally {
      setIsHeroLoading(false);
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAboutLoading(true);
    try {
      await updateAbout(aboutForm);
      toast({ title: texts.saved });
    } catch (error) {
      toast({ title: texts.error, variant: 'destructive' });
    } finally {
      setIsAboutLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{texts.title}</h1>
        <p className="text-muted-foreground mt-1">{texts.subtitle}</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="hero" className="gap-2">
            <LayoutTemplate className="h-4 w-4" />
            {texts.heroTab}
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {texts.aboutTab}
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                {texts.heroTab}
              </CardTitle>
              <CardDescription>{texts.heroDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{texts.greetingEn}</Label>
                    <Input
                      value={heroForm.greeting_en}
                      onChange={(e) => setHeroForm({ ...heroForm, greeting_en: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{texts.greetingAr}</Label>
                    <Input
                      value={heroForm.greeting_ar}
                      onChange={(e) => setHeroForm({ ...heroForm, greeting_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{texts.titleEn}</Label>
                    <Input
                      value={heroForm.title_en}
                      onChange={(e) => setHeroForm({ ...heroForm, title_en: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{texts.titleAr}</Label>
                    <Input
                      value={heroForm.title_ar}
                      onChange={(e) => setHeroForm({ ...heroForm, title_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{texts.subtitleEn}</Label>
                    <Input
                      value={heroForm.subtitle_en}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle_en: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{texts.subtitleAr}</Label>
                    <Input
                      value={heroForm.subtitle_ar}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{texts.descEn}</Label>
                  <Textarea
                    value={heroForm.description_en}
                    onChange={(e) => setHeroForm({ ...heroForm, description_en: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{texts.descAr}</Label>
                  <Textarea
                    value={heroForm.description_ar}
                    onChange={(e) => setHeroForm({ ...heroForm, description_ar: e.target.value })}
                    rows={3}
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{texts.heroImage}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={heroForm.hero_image_url}
                        onChange={(e) => setHeroForm({ ...heroForm, hero_image_url: e.target.value })}
                        className="pl-10"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="btn-gradient gap-2" disabled={isHeroLoading}>
                    <Save className="h-4 w-4" />
                    {isHeroLoading ? texts.saving : texts.save}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section Tab */}
        <TabsContent value="about">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {texts.aboutTab}
              </CardTitle>
              <CardDescription>{texts.aboutDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAboutSubmit} className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl">
                  <div className="space-y-2">
                    <Label>{texts.yearsExp}</Label>
                    <Input
                      type="number"
                      value={aboutForm.years_of_experience}
                      onChange={(e) => setAboutForm({ ...aboutForm, years_of_experience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{texts.projectsCount}</Label>
                    <Input
                      type="number"
                      value={aboutForm.completed_projects_count}
                      onChange={(e) => setAboutForm({ ...aboutForm, completed_projects_count: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{texts.clientsCount}</Label>
                    <Input
                      type="number"
                      value={aboutForm.happy_clients_count}
                      onChange={(e) => setAboutForm({ ...aboutForm, happy_clients_count: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{texts.bioEn}</Label>
                    <Textarea
                      value={aboutForm.bio_en}
                      onChange={(e) => setAboutForm({ ...aboutForm, bio_en: e.target.value })}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{texts.bioAr}</Label>
                    <Textarea
                      value={aboutForm.bio_ar}
                      onChange={(e) => setAboutForm({ ...aboutForm, bio_ar: e.target.value })}
                      rows={5}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="btn-gradient gap-2" disabled={isAboutLoading}>
                    <Save className="h-4 w-4" />
                    {isAboutLoading ? texts.saving : texts.save}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeContentPanel;
