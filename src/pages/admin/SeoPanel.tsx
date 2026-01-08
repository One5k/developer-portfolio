import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { seoApi } from '@/lib/api';
import { Globe, Search, Save, AlertCircle } from 'lucide-react';

const SeoPanel: React.FC = () => {
    const { language } = useLanguage();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // We can support multiple pages in the future, currently 'home'
    const [formData, setFormData] = useState({
        meta_title_en: '',
        meta_title_ar: '',
        meta_description_en: '',
        meta_description_ar: '',
        meta_keywords: '',
        og_image_url: '',
    });

    const translations = {
        en: {
            title: 'SEO Settings',
            subtitle: 'Manage search engine optimization for your pages',
            save: 'Save Changes',
            saving: 'Saving...',
            metaTitleEn: 'Meta Title (English)',
            metaTitleAr: 'Meta Title (Arabic)',
            metaDescEn: 'Meta Description (English)',
            metaDescAr: 'Meta Description (Arabic)',
            keywords: 'Keywords (comma separated)',
            ogImage: 'Social Share Image URL',
            success: 'SEO settings saved successfully',
            error: 'Failed to save SEO settings',
            fetchError: 'Failed to fetch SEO settings',
            preview: 'Search Preview',
        },
        ar: {
            title: 'إعدادات SEO',
            subtitle: 'تحسين محركات البحث لصفحات موقعك',
            save: 'حفظ التغييرات',
            saving: 'جاري الحفظ...',
            metaTitleEn: 'عنوان الصفحة (إنجليزي)',
            metaTitleAr: 'عنوان الصفحة (عربي)',
            metaDescEn: 'وصف الصفحة (إنجليزي)',
            metaDescAr: 'وصف الصفحة (عربي)',
            keywords: 'الكلمات المفتاحية (مفصولة بفاصلة)',
            ogImage: 'رابط صورة المشاركة',
            success: 'تم حفظ إعدادات SEO بنجاح',
            error: 'فشل حفظ الإعدادات',
            fetchError: 'فشل جلب الإعدادات',
            preview: 'معاينة البحث',
        },
    };

    const texts = translations[language];

    useEffect(() => {
        fetchSeoData();
    }, []);

    const fetchSeoData = async () => {
        try {
            const response = await seoApi.getSeo('home');
            if (response.seo) {
                setFormData({
                    meta_title_en: response.seo.meta_title_en || '',
                    meta_title_ar: response.seo.meta_title_ar || '',
                    meta_description_en: response.seo.meta_description_en || '',
                    meta_description_ar: response.seo.meta_description_ar || '',
                    meta_keywords: response.seo.meta_keywords || '',
                    og_image_url: response.seo.og_image_url || '',
                });
            }
        } catch (error) {
            console.error(error);
            toast({ title: texts.fetchError, variant: 'destructive' });
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await seoApi.updateSeo('home', formData);
            toast({ title: texts.success });
        } catch (error) {
            toast({ title: texts.error, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">{texts.title}</h1>
                <p className="text-muted-foreground mt-1">{texts.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Global Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{texts.metaTitleEn}</Label>
                                <Input
                                    value={formData.meta_title_en}
                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title_en: e.target.value }))}
                                    placeholder="e.g. John Doe | Full Stack Developer"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{texts.metaTitleAr}</Label>
                                <Input
                                    value={formData.meta_title_ar}
                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title_ar: e.target.value }))}
                                    dir="rtl"
                                    placeholder="مثال: محمد أحمد | مطور ويب شامل"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{texts.metaDescEn}</Label>
                                <Textarea
                                    value={formData.meta_description_en}
                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description_en: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{texts.metaDescAr}</Label>
                                <Textarea
                                    value={formData.meta_description_ar}
                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description_ar: e.target.value }))}
                                    rows={3}
                                    dir="rtl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{texts.keywords}</Label>
                                <Textarea
                                    value={formData.meta_keywords}
                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                                    placeholder="react, typescript, developer, portfolio"
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{texts.ogImage}</Label>
                                <Input
                                    value={formData.og_image_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, og_image_url: e.target.value }))}
                                    placeholder="https://..."
                                />
                            </div>

                            <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" /> {texts.save}</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>

                <div className="space-y-6">
                    {/* Google Search Preview */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-primary" />
                                {texts.preview} (Google)
                            </CardTitle>
                            <CardDescription>
                                This is how your site might appear in search results.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-white rounded-lg shadow-sm font-sans text-left border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center text-xs">Fav</div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-[#202124]">yourwebsite.com</span>
                                        <span className="text-xs text-[#5f6368]">https://yourwebsite.com</span>
                                    </div>
                                </div>
                                <h3 className="text-[#1a0dab] text-xl hover:underline cursor-pointer truncate">
                                    {language === 'ar' ? (formData.meta_title_ar || 'Your Site Title') : (formData.meta_title_en || 'Your Site Title')}
                                </h3>
                                <div className="text-[#4d5156] text-sm mt-1 line-clamp-2">
                                    {language === 'ar' ? (formData.meta_description_ar || 'Description of your website will appear here...') : (formData.meta_description_en || 'Description of your website will appear here...')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card bg-amber-500/10 border-amber-500/20">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-amber-900 dark:text-amber-100">Pro Tip</h4>
                                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                                        Keep your titles under 60 characters and descriptions under 160 characters for best visibility in search results.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SeoPanel;
