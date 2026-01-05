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
      error: 'An error occurred.',
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
      error: 'حدث خطأ.',
    },
  };

  const texts = translations[language];

  const handleDelete = async (id: string) => {
    if (window.confirm(texts.deleteConfirm)) {
      try {
        await deleteMessage(id);
        toast({ title: texts.deleted });
      } catch (error) {
        toast({ title: texts.error, variant: 'destructive' });
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
    } catch (error) {
      toast({ title: texts.error, variant: 'destructive' });
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    // Unread first, then by date
    if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
                !message.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.is_read 
                      ? 'bg-muted' 
                      : 'bg-gradient-to-br from-primary to-accent'
                  }`}>
                    <Mail className={`h-5 w-5 ${message.is_read ? 'text-muted-foreground' : 'text-white'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold">{message.sender_name}</h3>
                      <Badge variant={message.is_read ? 'secondary' : 'default'} className="w-fit">
                        {message.is_read ? (
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
                    
                    <p className="text-sm text-muted-foreground">{message.sender_email}</p>
                    
                    <div className="mt-3">
                      <p className="text-sm mt-2 whitespace-pre-wrap">{message.content}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                      
                      <div className="flex gap-2">
                        {!message.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(message.id)}
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
