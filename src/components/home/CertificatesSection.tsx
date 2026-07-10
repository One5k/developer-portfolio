import React, { useEffect, useState } from 'react';
import { GraduationCap, Award, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { certificatesApi, educationApi } from '@/lib/api';

interface Certificate {
  id: number;
  title: { en: string; ar: string };
  issuer: { en: string; ar: string };
  date: string;
  description: { en: string; ar: string };
  credentialUrl?: string;
  type: 'certificate' | 'education';
}

const CertificatesSection: React.FC = () => {
  const { language, t } = useLanguage(); // Added t for translations if needed, though mostly using inline conditionals
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [educationItems, setEducationItems] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certificatesRes, educationRes] = await Promise.all([
          certificatesApi.getAll(),
          educationApi.getAll()
        ]);

        const mappedCertificates = certificatesRes.certificates.map((c: any) => ({
          id: c.id,
          title: { en: c.title_en, ar: c.title_ar },
          issuer: { en: c.issuer_en, ar: c.issuer_ar },
          date: new Date(c.issue_date).getFullYear().toString(),
          description: { en: '', ar: '' },
          credentialUrl: c.credential_url,
          type: 'certificate' as const
        }));

        const mappedEducation = educationRes.education.map((e: any) => ({
          id: e.id,
          title: { en: e.degree_en, ar: e.degree_ar },
          issuer: { en: e.institution_en, ar: e.institution_ar },
          date: `${new Date(e.start_date).getFullYear()} - ${e.end_date ? new Date(e.end_date).getFullYear() : 'Present'}`,
          description: { en: e.description_en || '', ar: e.description_ar || '' },
          type: 'education' as const
        }));

        setCertificates(mappedCertificates);
        setEducationItems(mappedEducation);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <section id="certificates" className="py-24 relative bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-display">
            {language === 'ar' ? 'الشهادات والتعليم' : 'Certificates & Education'}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'رحلتي التعليمية والشهادات المهنية التي حصلت عليها'
              : 'My educational journey and professional certifications'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Education */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-secondary rounded-none">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {language === 'ar' ? 'التعليم' : 'Education'}
              </h3>
            </div>

            <div className="space-y-6">
              {educationItems.map((item) => (
                <div
                  key={item.id}
                  className="obsidian-card rounded-none p-6"
                >
                  <div className="flex flex-col">
                    <div className="text-xs font-mono font-bold tracking-wider text-accent uppercase mb-2">
                      {item.date}
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-1">
                      {item.title[language]}
                    </h4>
                    <p className="text-sm font-semibold text-primary mb-3">
                      {item.issuer[language]}
                    </p>
                    {item.description[language] && (
                      <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        {item.description[language]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {educationItems.length === 0 && (
                <div className="obsidian-card rounded-none p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    {language === 'ar' ? 'لا توجد بيانات تعليمية لعرضها.' : 'No education records to display.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-secondary rounded-none">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {language === 'ar' ? 'الشهادات المهنية' : 'Professional Certificates'}
              </h3>
            </div>

            <div className="space-y-6">
              {certificates.map((item, index) => (
                <div
                  key={item.id}
                  className="obsidian-card rounded-none p-6"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className="flex flex-col">
                    <div className="text-xs font-mono font-bold tracking-wider text-primary uppercase mb-2">
                      {item.date}
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-1">
                      {item.title[language]}
                    </h4>
                    <p className="text-sm font-semibold text-muted-foreground mb-4">
                      {item.issuer[language]}
                    </p>
                    {item.credentialUrl && (
                      <Button asChild variant="outline" size="sm" className="rounded-none border-border hover:bg-secondary text-xs px-4 py-2 self-start gap-1.5 mt-1">
                        <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                          {language === 'ar' ? 'عرض الشهادة' : 'View Credential'}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {certificates.length === 0 && (
                <div className="obsidian-card rounded-none p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    {language === 'ar' ? 'لا توجد شهادات لعرضها.' : 'No certificates to display.'}
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

export default CertificatesSection;
