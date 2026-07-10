import React, { useState, useEffect } from 'react';
import { Send, Mail, MapPin, Phone, Github, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { messagesApi, profileApi } from '@/lib/api';

const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
            title: language === 'ar' ? 'تم الإرسال!' : 'Message Sent!',
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
      value: profileData?.phone || '+1 234 567 890', 
      href: profileData?.phone ? `tel:${profileData.phone}` : 'tel:+1234567890' 
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
    { icon: MessageCircle, label: 'WhatsApp', href: profileData?.phone ? `https://wa.me/${profileData.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/1234567890' },
  ].filter(link => link.href);

  return (
    <section id="contact" className="py-24 relative bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-display">
            {t('contact.title')}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="obsidian-card rounded-none p-8 md:p-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                    {t('contact.form.name')}
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="rounded-none border-border bg-background/50 focus-visible:ring-primary/40 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:border-primary"
                    placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                    {t('contact.form.email')}
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-none border-border bg-background/50 focus-visible:ring-primary/40 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:border-primary"
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                  {t('contact.form.subject')}
                </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="rounded-none border-border bg-background/50 focus-visible:ring-primary/40 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:border-primary"
                  placeholder={language === 'ar' ? 'موضوع الرسالة' : 'Message subject'}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                  {t('contact.form.message')}
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="rounded-none border-border bg-background/50 resize-none focus-visible:ring-primary/40 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:border-primary"
                  placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-premium rounded-none py-6 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t('contact.form.send')}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info Ledger */}
          <div className="animate-fade-in space-y-6">
            <div className="obsidian-card rounded-none p-8 md:p-10 space-y-8">
              <h3 className="text-xl font-bold text-foreground pb-4 border-b border-border/60">
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="p-3 bg-secondary rounded-none text-primary">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Channels inside the ledger */}
              <div className="pt-8 border-t border-border/60">
                <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                  {language === 'ar' ? 'تابعني على' : 'Connect on Socials'}
                </h4>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 bg-secondary text-muted-foreground hover:text-primary hover:border-primary/40 border border-border/40 transition-all duration-300 rounded-none"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Styled Premium */}
            <Button
              asChild
              className="w-full bg-secondary border border-border hover:bg-secondary/70 hover:border-primary/40 text-foreground rounded-none py-6 gap-2"
            >
              <a href={profileData?.phone ? `https://wa.me/${profileData.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/1234567890'} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 text-primary" />
                {language === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
