import React, { useEffect, useState } from 'react';
import { GraduationCap, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { certificatesApi, educationApi } from '@/lib/api';
import ScrollReveal from '@/components/motion/ScrollReveal';

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
  const { language } = useLanguage();
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
    };
    fetchData();
  }, []);

  return (
    <section id="certificates" className="py-16 lg:py-20 relative bg-background">
      <div className="section-container">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="mb-10 text-start">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-display no-letter-spacing">
              {language === 'ar' ? 'الشهادات والتعليم' : 'Certificates & Education'}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-10 items-start text-start">
          
          {/* Education Ledger */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground font-display no-letter-spacing">
                  {language === 'ar' ? 'التعليم والدرجات الأكاديمية' : 'Academic Education'}
                </h3>
              </div>

              <div className="space-y-6 font-sans">
                {educationItems.map((item) => (
                  <div
                    key={item.id}
                    className="obsidian-card rounded-2xl p-6 border border-border/60"
                  >
                    <div className="flex flex-col space-y-2">
                      <span className="text-xs font-mono text-primary font-bold uppercase">
                        {item.date}
                      </span>
                      <h4 className="text-lg font-bold text-foreground font-display no-letter-spacing">
                        {item.title[language]}
                      </h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.issuer[language]}
                      </p>
                      {item.description[language] && (
                        <p className="text-xs text-muted-foreground/80 leading-relaxed pt-2">
                          {item.description[language]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {educationItems.length === 0 && (
                  <div className="obsidian-card rounded-2xl p-6 text-center">
                    <p className="text-muted-foreground text-sm font-sans">
                      {language === 'ar' ? 'لا توجد بيانات تعليمية حالياً.' : 'No education records.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Certificates Ledger */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground font-display no-letter-spacing">
                  {language === 'ar' ? 'الشهادات والتراخيص المهنية' : 'Certifications & Credentials'}
                </h3>
              </div>

              <div className="space-y-6 font-sans">
                {certificates.map((item) => (
                  <div
                    key={item.id}
                    className="obsidian-card rounded-2xl p-6 border border-border/60"
                  >
                    <div className="flex flex-col space-y-2">
                      <span className="text-xs font-mono text-primary font-bold uppercase">
                        {item.date}
                      </span>
                      <h4 className="text-lg font-bold text-foreground font-display no-letter-spacing">
                        {item.title[language]}
                      </h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.issuer[language]}
                      </p>
                      {item.credentialUrl && (
                        <div className="pt-2">
                          <Button asChild variant="outline" size="sm" className="rounded-xl border-border hover:bg-secondary text-xs px-4 py-2 gap-1.5 font-sans">
                            <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>{language === 'ar' ? 'التحقق من الشهادة' : 'Verify Credential'}</span>
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {certificates.length === 0 && (
                  <div className="obsidian-card rounded-2xl p-6 text-center">
                    <p className="text-muted-foreground text-sm font-sans">
                      {language === 'ar' ? 'لا توجد شهادات حالياً.' : 'No certificates recorded.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
