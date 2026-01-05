import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdminData } from '@/contexts/AdminDataContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Lightbulb,
  MessageSquare,
  Award,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Globe,
  Mail,
  Grid,
  Home,
  Briefcase,
  LayoutTemplate
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, direction } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { messages } = useAdminData();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = messages.filter(m => !m.is_read).length;

  const translations = {
    en: {
      dashboard: 'Dashboard',
      profile: 'Profile',
      projects: 'Projects',
      skills: 'Skills',
      homeContent: 'Home Content',
      experiences: 'Experience',
      certificates: 'Certificates',
      messages: 'Messages',
      logout: 'Logout',
      admin: 'Admin Panel',
      management: 'Management',
      backToSite: 'Back to Site',
    },
    ar: {
      dashboard: 'لوحة التحكم',
      profile: 'الملف الشخصي',
      projects: 'المشاريع',
      skills: 'المهارات',
      homeContent: 'محتوى الرئيسية',
      experiences: 'الخبرات',
      certificates: 'الشهادات',
      messages: 'الرسائل',
      logout: 'تسجيل الخروج',
      admin: 'لوحة الإدارة',
      management: 'الإدارة',
      backToSite: 'العودة للموقع',
    },
  };

  const texts = translations[language];

  const menuItems = [
    { title: texts.dashboard, url: '/admin', icon: LayoutDashboard },
    { title: texts.profile, url: '/admin/profile', icon: User },
    { title: texts.homeContent, url: '/admin/home-content', icon: LayoutTemplate },
    { title: texts.projects, url: '/admin/projects', icon: FolderOpen },
    { title: texts.skills, url: '/admin/skills', icon: Lightbulb },
    { title: texts.experiences, url: '/admin/experiences', icon: Briefcase },
    { title: texts.certificates, url: '/admin/certificates', icon: Award },
    { title: texts.messages, url: '/admin/messages', icon: Mail, badge: unreadCount },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div dir={direction} className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-border">
            <SidebarHeader className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm">{texts.admin}</h2>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
              <SidebarGroup>
                <SidebarGroupLabel>{texts.management}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.url)}
                          className={`w-full justify-start gap-3 ${
                            isActive(item.url) 
                              ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="flex-1"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  className="flex-1"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full gap-2"
              >
                <Home className="h-4 w-4" />
                {texts.backToSite}
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full gap-2"
              >
                <LogOut className="h-4 w-4" />
                {texts.logout}
              </Button>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 overflow-auto">
            <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
              <SidebarTrigger />
              <h1 className="font-semibold gradient-text">{texts.admin}</h1>
            </header>
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
