import React, { useEffect, useState } from 'react';
import { GraduationCap, Award, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { certificatesApi } from '@/lib/api';

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

  // Hardcoded education data as there is no DB table for it yet
  const educationItems: Certificate[] = [
    {
      id: 101, // Arbitrary ID to avoid collision
      title: { en: 'Bachelor of Computer Science', ar: 'بكالوريوس علوم الحاسوب' },
      issuer: { en: 'University of Technology', ar: 'جامعة التكنولوجيا' },
      date: '2015 - 2019',
      description: {
        en: 'Graduated with honors, specialized in software engineering and web technologies',
        ar: 'تخرجت بمرتبة الشرف، تخصص هندسة البرمجيات وتقنيات الويب'
      },
      type: 'education',
    },
  ];

  useEffect(() => {
    const fetchCertificates = async () => {
        try {
            const { certificates } = await certificatesApi.getAll();
            const mappedCertificates = certificates.map((c: any) => ({
                id: c.id,
                title: { en: c.title_en, ar: c.title_ar },
                issuer: { en: c.issuer_en, ar: c.issuer_ar },
                date: new Date(c.issue_date).getFullYear().toString(),
                description: { en: '', ar: '' }, // Description is not in the certificate schema, leaving empty or could use title
                credentialUrl: c.credential_url,
                type: 'certificate' as const
            }));
            setCertificates(mappedCertificates);
        } catch (error) {
            console.error(error);
        }
    }
    fetchCertificates();
  }, []);

  return (
    <section id="certificates" className="py-20 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">
              {language === 'ar' ? 'الشهادات والتعليم' : 'Certificates & Education'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'رحلتي التعليمية والشهادات المهنية التي حصلت عليها'
              : 'My educational journey and professional certifications'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-accent/10">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">
                {language === 'ar' ? 'التعليم' : 'Education'}
              </h3>
            </div>

            <div className="space-y-6">
              {educationItems.map((item) => (
                <div 
                  key={item.id}
                  className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-accent/10 mt-1">
                      <GraduationCap className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-1">{item.title[language]}</h4>
                      <p className="text-primary font-medium mb-2">{item.issuer[language]}</p>
                      <p className="text-sm text-muted-foreground">{item.description[language]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {language === 'ar' ? 'الشهادات المهنية' : 'Professional Certificates'}
              </h3>
            </div>

            <div className="space-y-6">
              {certificates.map((item, index) => (
                <div 
                  key={item.id}
                  className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300"
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 mt-1">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-1">{item.title[language]}</h4>
                      <p className="text-primary font-medium mb-2">{item.issuer[language]}</p>
                      {/* Description is not in DB for certificates, checking if I should hide it */}
                       {/* <p className="text-sm text-muted-foreground mb-3">{item.description[language]}</p> */}
                      {item.credentialUrl && (
                        <Button asChild variant="outline" size="sm" className="rounded-full gap-2 mt-2">
                          <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                            {language === 'ar' ? 'عرض الشهادة' : 'View Credential'}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {certificates.length === 0 && (
                   <div className="glass-card rounded-2xl p-6">
                        <p className="text-muted-foreground">
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
