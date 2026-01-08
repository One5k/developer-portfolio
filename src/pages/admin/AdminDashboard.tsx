import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FolderKanban,
  Lightbulb,
  Award,
  Mail,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { projects, skills, certificates, education, messages } = useAdminData();

  const translations = {
    en: {
      title: 'Dashboard',
      subtitle: 'Welcome back! Here\'s an overview of your portfolio.',
      projects: 'Projects',
      skills: 'Skills',
      certificates: 'Certificates',
      education: 'Education',
      messages: 'Messages',
      unread: 'Unread',
      total: 'Total',
      featured: 'Featured',
      recentMessages: 'Recent Messages',
      noMessages: 'No messages yet',
      quickStats: 'Quick Stats',
    },
    ar: {
      title: 'لوحة التحكم',
      subtitle: 'مرحباً بعودتك! إليك نظرة عامة على ملفك الشخصي.',
      projects: 'المشاريع',
      skills: 'المهارات',
      certificates: 'الشهادات',
      education: 'التعليم',
      messages: 'الرسائل',
      unread: 'غير مقروءة',
      total: 'الإجمالي',
      featured: 'مميزة',
      recentMessages: 'آخر الرسائل',
      noMessages: 'لا توجد رسائل بعد',
      quickStats: 'إحصائيات سريعة',
    },
  };

  const texts = translations[language];

  const stats = [
    {
      title: texts.projects,
      value: projects.length,
      icon: FolderKanban,
      color: 'from-blue-500 to-purple-500',
      subValue: `${projects.filter(p => p.is_featured).length} ${texts.featured}`,
    },
    {
      title: texts.skills,
      value: skills.length,
      icon: Lightbulb,
      color: 'from-green-500 to-teal-500',
      subValue: `${texts.total}`,
    },
    {
      title: texts.certificates,
      value: certificates.length,
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      subValue: `${texts.total}`,
    },
    {
      title: texts.education,
      value: education.length,
      icon: GraduationCap,
      color: 'from-indigo-500 to-blue-500',
      subValue: `${texts.total}`,
    },
    {
      title: texts.messages,
      value: messages.length,
      icon: Mail,
      color: 'from-pink-500 to-red-500',
      subValue: `${messages.filter(m => !m.is_read).length} ${texts.unread}`,
    },
  ];

  const recentMessages = messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">{texts.title}</h1>
        <p className="text-muted-foreground mt-1">{texts.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card border-border/50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Messages */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {texts.recentMessages}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{texts.noMessages}</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border transition-colors ${message.is_read
                    ? 'bg-muted/30 border-border/50'
                    : 'bg-primary/5 border-primary/20'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{message.sender_name}</p>
                        {!message.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{message.sender_email}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {message.content}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
