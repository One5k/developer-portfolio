import React, { useEffect, useState } from 'react';
import { Download, Briefcase, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { aboutApi, experiencesApi, profileApi } from '@/lib/api';

const AboutSection: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const [aboutData, setAboutData] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, experiencesRes, profileRes] = await Promise.all([
          aboutApi.getAbout(),
          experiencesApi.getAll(),
          profileApi.getProfile()
        ]);
        setAboutData(aboutRes.about);
        setExperiences(experiencesRes.experiences);
        setProfileData(profileRes.profile);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section id="about" className="py-24 relative bg-background">
        <div className="section-container">
          <div className="text-center mb-20">
            <div className="h-10 w-48 bg-muted animate-pulse mx-auto mb-4 rounded-none" />
            <div className="h-4 w-64 bg-muted animate-pulse mx-auto rounded-none" />
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="obsidian-card rounded-none p-8 md:p-10 flex flex-col gap-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded-none" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-none" />
              <div className="h-4 w-5/6 bg-muted animate-pulse rounded-none" />
              <div className="h-4 w-4/5 bg-muted animate-pulse rounded-none" />
              <div className="grid grid-cols-3 gap-6 border-y border-border/60 py-6 my-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-12 bg-muted animate-pulse rounded-none" />
                  <div className="h-3 w-16 bg-muted animate-pulse rounded-none" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-12 bg-muted animate-pulse rounded-none" />
                  <div className="h-3 w-16 bg-muted animate-pulse rounded-none" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-12 bg-muted animate-pulse rounded-none" />
                  <div className="h-3 w-16 bg-muted animate-pulse rounded-none" />
                </div>
              </div>
              <div className="h-12 w-40 bg-muted animate-pulse rounded-none" />
            </div>
            <div>
              <div className="h-6 w-48 bg-muted animate-pulse mb-8 rounded-none" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-3 h-3 bg-muted rounded-full mt-1.5 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 bg-muted animate-pulse rounded-none" />
                      <div className="h-4 w-40 bg-muted animate-pulse rounded-none" />
                      <div className="h-3 w-32 bg-muted animate-pulse rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const bio = aboutData
    ? (language === 'ar' ? aboutData.bio_ar : aboutData.bio_en)
    : t('home.bio');

  // Format date function
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  };

  return (
    <section id="about" className="py-24 relative bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-display">
            {t('nav.about')}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'تعرف على خبراتي ورحلتي في عالم التطوير'
              : 'Learn about my experience and journey in development'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio Section */}
          <div className="animate-fade-in">
            <div className="obsidian-card rounded-none p-8 md:p-10">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {language === 'ar' ? 'من أنا' : 'Who I Am'}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-wrap">
                {bio}
              </p>

              {aboutData && (
                <div className="grid grid-cols-3 gap-6 border-t border-b border-border/60 py-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-primary tracking-tight">{aboutData.years_of_experience}+</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{language === 'ar' ? 'سنوات خبرة' : 'Years Exp'}</div>
                  </div>
                  <div className="text-center border-x border-border/60">
                    <div className="text-3xl font-extrabold text-primary tracking-tight">{aboutData.completed_projects_count}+</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{language === 'ar' ? 'مشاريع' : 'Projects'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-primary tracking-tight">{aboutData.happy_clients_count}+</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{language === 'ar' ? 'عملاء' : 'Clients'}</div>
                  </div>
                </div>
              )}

              <Button asChild className="btn-premium rounded-none px-6 py-5 gap-2">
                <a 
                  href={language === 'ar' ? (profileData?.resume_url_ar || profileData?.resume_url) : profileData?.resume_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  {t('about.download.cv')}
                </a>
              </Button>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              {language === 'ar' ? 'الخبرات العملية' : 'Work Experience'}
            </h3>
            
            <div className="relative">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className={`relative pb-8 last:pb-0 border-border/80 ${direction === 'rtl' ? 'pr-8 border-r mr-[5px]' : 'pl-8 border-l ml-[5px]'}`}
                >
                  {/* Minimal Timeline Bullet */}
                  <div className={`w-2.5 h-2.5 bg-primary rounded-full absolute top-[9px] ${direction === 'rtl' ? '-right-[5px]' : '-left-[5px]'}`} />
                  
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold tracking-wider text-primary uppercase mb-1">
                      {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : (language === 'ar' ? 'الآن' : 'Present')}
                    </span>
                    <h4 className="text-lg font-bold text-foreground mb-0.5">
                      {language === 'ar' ? exp.position_ar : exp.position_en}
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {language === 'ar' ? exp.company_ar : exp.company_en}
                    </p>
                    {(exp.location_en || exp.location_ar) && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/75">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{language === 'ar' ? exp.location_ar : exp.location_en}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {experiences.length === 0 && (
                <div className={`relative ${direction === 'rtl' ? 'pr-8 border-r mr-[5px]' : 'pl-8 border-l ml-[5px]'}`}>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'جاري تحميل الخبرات...' : 'Loading experiences...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
