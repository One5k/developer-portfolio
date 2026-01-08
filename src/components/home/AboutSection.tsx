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
      }
    };
    fetchData();
  }, []);

  const bio = aboutData
    ? (language === 'ar' ? aboutData.bio_ar : aboutData.bio_en)
    : t('about.bio_placeholder'); // Fallback would be good

  // Format date function
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  };

  return (
    <section id="about" className="py-20 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('nav.about')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar'
              ? 'تعرف على خبراتي ورحلتي في عالم التطوير'
              : 'Learn about my experience and journey in development'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Bio Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                {language === 'ar' ? 'من أنا' : 'Who I Am'}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">
                {bio}
              </p>

              {aboutData && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{aboutData.years_of_experience}+</div>
                    <div className="text-xs text-muted-foreground">{language === 'ar' ? 'سنوات خبرة' : 'Years Exp'}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{aboutData.completed_projects_count}+</div>
                    <div className="text-xs text-muted-foreground">{language === 'ar' ? 'مشاريع' : 'Projects'}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{aboutData.happy_clients_count}+</div>
                    <div className="text-xs text-muted-foreground">{language === 'ar' ? 'عملاء' : 'Clients'}</div>
                  </div>
                </div>
              )}

              <Button asChild className="btn-gradient rounded-full gap-2">
                <a href={profileData?.resume_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  {t('about.download')}
                </a>
              </Button>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold mb-6">
              {language === 'ar' ? 'الخبرات العملية' : 'Work Experience'}
            </h3>
            <div className={`space-y-6 relative before:absolute before:top-0 before:bottom-0 before:w-0.5 before:bg-primary/30 ${direction === 'rtl' ? 'before:right-3' : 'before:left-3'}`}>
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className={`relative glass-card rounded-xl p-5 ${direction === 'rtl' ? 'mr-8' : 'ml-8'}`}
                >
                  <div className={`absolute top-6 w-6 h-6 rounded-full bg-primary flex items-center justify-center ${direction === 'rtl' ? '-right-11' : '-left-11'}`}>
                    <Briefcase className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : (language === 'ar' ? 'الآن' : 'Present')}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold">
                    {language === 'ar' ? exp.position_ar : exp.position_en}
                  </h4>
                  <p className="text-primary font-medium">
                    {language === 'ar' ? exp.company_ar : exp.company_en}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    {(exp.location_en || exp.location_ar) && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span>{language === 'ar' ? exp.location_ar : exp.location_en}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {experiences.length === 0 && (
                <div className={`relative glass-card rounded-xl p-5 ${direction === 'rtl' ? 'mr-8' : 'ml-8'}`}>
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
