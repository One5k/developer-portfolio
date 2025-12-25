import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminData } from '@/contexts/AdminDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Trash2, Check, Clock } from 'lucide-react';

const MessagesPanel: React.FC = () => {
  const { language } = useLanguage();
  const { messages, markMessageAsRead, deleteMessage } = useAdminData();
  const { toast } = useToast();

  const translations = {
    en: {
      title: 'Messages',
      subtitle: 'View and manage contact form messages',
      noMessages: 'No messages yet.',
      markRead: 'Mark as Read',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this message?',
      deleted: 'Message deleted!',
      read: 'Read',
      unread: 'Unread',
      from: 'From',
      subject: 'Subject',
    },
    ar: {
      title: 'الرسائل',
      subtitle: 'عرض وإدارة رسائل نموذج الاتصال',
      noMessages: 'لا توجد رسائل بعد.',
      markRead: 'تحديد كمقروء',
      delete: 'حذف',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الرسالة؟',
      deleted: 'تم حذف الرسالة!',
      read: 'مقروءة',
      unread: 'غير مقروءة',
      from: 'من',
      subject: 'الموضوع',
    },
  };

  const texts = translations[language];

  const handleDelete = (id: string) => {
    if (window.confirm(texts.deleteConfirm)) {
      deleteMessage(id);
      toast({ title: texts.deleted });
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    // Unread first, then by date
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{texts.title}</h1>
        <p className="text-muted-foreground mt-1">{texts.subtitle}</p>
      </div>

      {messages.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{texts.noMessages}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`glass-card border-border/50 transition-all ${
                !message.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.read 
                      ? 'bg-muted' 
                      : 'bg-gradient-to-br from-primary to-accent'
                  }`}>
                    <Mail className={`h-5 w-5 ${message.read ? 'text-muted-foreground' : 'text-white'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold">{message.name}</h3>
                      <Badge variant={message.read ? 'secondary' : 'default'} className="w-fit">
                        {message.read ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            {texts.read}
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            {texts.unread}
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-primary">{texts.subject}: {message.subject}</p>
                      <p className="text-sm mt-2 whitespace-pre-wrap">{message.message}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                      
                      <div className="flex gap-2">
                        {!message.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markMessageAsRead(message.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {texts.markRead}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(message.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {texts.delete}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPanel;
