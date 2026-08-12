import React, { useEffect, useState } from 'react';
import { Download, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { aboutApi, experiencesApi, profileApi } from '@/lib/api';
import ScrollReveal from '@/components/motion/ScrollReveal';

const AboutSection: React.FC = () => {
  const { t, language } = useLanguage();
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
      <section id="about" className="py-16 lg:py-20 bg-background">
        <div className="section-container space-y-8">
          <div className="h-10 w-48 bg-muted animate-pulse rounded-xl" />
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 h-48 bg-muted animate-pulse rounded-2xl" />
            <div className="lg:col-span-5 h-48 bg-muted animate-pulse rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const bio = aboutData
    ? (language === 'ar' ? aboutData.bio_ar : aboutData.bio_en)
    : '';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return language === 'ar' ? 'الآن' : 'Present';
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  };

  return (
    <section id="about" className="py-16 lg:py-20 bg-background">
      <div className="section-container">

        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="mb-12 text-start">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-display no-letter-spacing">
              {t('nav.about')}
            </h2>
          </div>
        </ScrollReveal>

        {/* Two-column editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Bio Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-start">

            <ScrollReveal direction="up" delay={0.1}>
              <div className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans" style={{ maxWidth: '65ch' }}>
                {bio}
              </div>
            </ScrollReveal>

            {/* Impact Metrics */}
            {aboutData && (
              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-wrap gap-8 sm:gap-12 py-6 border-y border-border/50">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-foreground font-mono">{aboutData.years_of_experience}+</div>
                    <div className="text-xs font-sans text-muted-foreground mt-1">{language === 'ar' ? 'سنوات خبرة' : 'Years Exp'}</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-foreground font-mono">{aboutData.completed_projects_count}+</div>
                    <div className="text-xs font-sans text-muted-foreground mt-1">{language === 'ar' ? 'مشاريع مكتملة' : 'Projects'}</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-foreground font-mono">{aboutData.happy_clients_count}+</div>
                    <div className="text-xs font-sans text-muted-foreground mt-1">{language === 'ar' ? 'عملاء سعيدون' : 'Clients'}</div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* CV Download */}
            <ScrollReveal direction="up" delay={0.3}>
              <Button asChild className="btn-premium rounded-xl px-6 py-5 gap-2 text-sm font-sans">
                <a
                  href={language === 'ar' ? (profileData?.resume_url_ar || profileData?.resume_url) : profileData?.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  <span>{t('about.download.cv')}</span>
                </a>
              </Button>
            </ScrollReveal>
          </div>

          {/* Work Experience Column (5 cols) */}
          <div className="lg:col-span-5 text-start space-y-6 lg:ps-4">
            <ScrollReveal direction="up" delay={0.15}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide font-sans border-b border-border/50 pb-3">
                {language === 'ar' ? 'الخبرات العملية' : 'Experience'}
              </h3>

              <div className="space-y-6 font-sans mt-4">
                {experiences.map((exp, idx) => (
                  <ScrollReveal key={exp.id} direction="up" delay={0.2 + idx * 0.05}>
                    <div className="relative ps-5 border-s-2 border-border/60 space-y-1 group hover:border-primary/50 transition-colors">
                      <div className="w-2 h-2 bg-primary rounded-full absolute top-2 -start-[5px]" />

                      <div className="text-xs font-mono text-muted-foreground">
                        {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : (language === 'ar' ? 'الآن' : 'Present')}
                      </div>

                      <h4 className="text-sm font-bold text-foreground font-display no-letter-spacing">
                        {language === 'ar' ? exp.position_ar : exp.position_en}
                      </h4>

                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? exp.company_ar : exp.company_en}
                      </p>

                      {(exp.location_en || exp.location_ar) && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/50 pt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{language === 'ar' ? exp.location_ar : exp.location_en}</span>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}

                {experiences.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    {language === 'ar' ? 'لا توجد خبرات مضافة.' : 'No experiences added.'}
                  </p>
                )}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
