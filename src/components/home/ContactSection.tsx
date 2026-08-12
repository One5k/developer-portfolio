import React, { useState, useEffect } from 'react';
import { Send, Mail, MapPin, Phone, Github, Linkedin, MessageCircle, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { messagesApi, profileApi } from '@/lib/api';
import ScrollReveal from '@/components/motion/ScrollReveal';

const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { profile } = await profileApi.getProfile();
        setProfileData(profile);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyEmail = () => {
    const email = profileData?.email || 'hello@example.com';
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast({
      title: language === 'ar' ? 'تم نسخ البريد الإلكتروني!' : 'Email Copied!',
      description: email,
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await messagesApi.create({
        sender_name: formData.name,
        sender_email: formData.email,
        content: `${formData.subject ? `[${formData.subject}] ` : ''}${formData.message}`
      });

      toast({
        title: language === 'ar' ? 'تم الإرسال بنجاح!' : 'Message Sent Successfully!',
        description: t('contact.success'),
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: "destructive",
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل إرسال الرسالة. حاول مرة أخرى.' : 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: profileData?.email || 'hello@example.com', 
      href: profileData?.email ? `mailto:${profileData.email}` : 'mailto:hello@example.com' 
    },
    { 
      icon: Phone, 
      label: language === 'ar' ? 'الهاتف' : 'Phone', 
      value: profileData?.phone || '+967 773 703 388', 
      href: profileData?.phone ? `tel:${profileData.phone}` : 'tel:+967773703388' 
    },
    { 
      icon: MapPin, 
      label: language === 'ar' ? 'الموقع' : 'Location', 
      value: (language === 'ar' ? profileData?.location_ar : profileData?.location_en) || (language === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'), 
      href: null 
    },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: profileData?.github_url },
    { icon: Linkedin, label: 'LinkedIn', href: profileData?.linkedin_url },
    { icon: MessageCircle, label: 'WhatsApp', href: profileData?.phone ? `https://wa.me/${profileData.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/967773703388' },
  ].filter(link => link.href);

  return (
    <section id="contact" className="py-16 lg:py-20 relative bg-background">
      <div className="section-container">
        
        {/* Closing Statement Header */}
        <ScrollReveal direction="up">
          <div className="text-start mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-display no-letter-spacing max-w-3xl leading-[1.15]" style={{ textWrap: 'balance' } as React.CSSProperties}>
              {language === 'ar' ? 'دعنا نبني شيئاً استثنائياً معاً.' : "Let's build something extraordinary together."}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans mt-4">
              {t('contact.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-sans">
          
          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 text-start">
            <ScrollReveal direction="up" delay={0.1}>
              <form onSubmit={handleSubmit} className="obsidian-card rounded-2xl p-6 sm:p-8 space-y-5 border border-border/60">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-2">
                      {t('contact.form.name')}
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-border/80 bg-background/60 py-5 font-sans"
                      placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-2">
                      {t('contact.form.email')}
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-border/80 bg-background/60 py-5 font-sans"
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-border/80 bg-background/60 py-5 font-sans"
                    placeholder={language === 'ar' ? 'موضوع الرسالة' : 'Message subject'}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-2">
                    {t('contact.form.message')}
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="rounded-xl border-border/80 bg-background/60 resize-none font-sans"
                    placeholder={language === 'ar' ? 'اكتب تفاصيل مشروعك أو رسالتك هنا...' : 'Write your project details or message here...'}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-premium rounded-xl py-6 text-sm gap-2 font-sans cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('contact.form.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{t('contact.form.send')}</span>
                    </>
                  )}
                </Button>
              </form>
            </ScrollReveal>
          </div>

          {/* Direct Channels (5 Cols) */}
          <div className="lg:col-span-5 text-start space-y-6">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="obsidian-card rounded-3xl p-8 sm:p-10 space-y-8 border border-border/70">
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <h3 className="text-xl font-bold text-foreground font-display no-letter-spacing">
                    {language === 'ar' ? 'معلومات التواصل المباشر' : 'Direct Channels'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyEmail}
                    className="text-xs font-mono gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    {copiedEmail ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedEmail ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ البريد' : 'Copy Email')}</span>
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="p-3 bg-secondary rounded-xl text-primary">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase font-mono text-muted-foreground mb-1 font-sans">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} className="text-base font-semibold text-foreground hover:text-primary transition-colors duration-300 font-sans inline-flex items-center gap-1 group">
                            <span>{info.value}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <p className="text-base font-semibold text-foreground font-sans">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border/60">
                  <h4 className="text-xs font-mono uppercase text-muted-foreground mb-4">
                    {language === 'ar' ? 'الشبكات المهنية' : 'PROFESSIONAL NETWORKS'}
                  </h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary/80 border border-border/50 transition-all duration-300 rounded-xl"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <Button
                asChild
                className="w-full bg-secondary border border-border/80 hover:border-primary/40 text-foreground rounded-2xl py-6 gap-2.5 text-sm font-sans"
              >
                <a href={profileData?.phone ? `https://wa.me/${profileData.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/967773703388'} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>{language === 'ar' ? 'محادثة فورية عبر واتساب' : 'Instant Chat on WhatsApp'}</span>
                </a>
              </Button>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
