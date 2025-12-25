import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  nameAr: string;
  category: 'frontend' | 'backend' | 'mobile' | 'tools' | 'soft';
  level: number;
  icon?: string;
}

export interface Certificate {
  id: string;
  title: string;
  titleAr: string;
  issuer: string;
  issuerAr: string;
  date: string;
  credentialUrl?: string;
  image?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Profile {
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  bio: string;
  bioAr: string;
  email: string;
  phone: string;
  location: string;
  locationAr: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  avatar?: string;
}

interface AdminDataContextType {
  // Profile
  profile: Profile;
  updateProfile: (data: Partial<Profile>) => void;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Skills
  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  // Certificates
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  updateCertificate: (id: string, data: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  
  // Messages
  messages: Message[];
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
}

const defaultProfile: Profile = {
  name: 'Your Name',
  nameAr: 'اسمك هنا',
  title: 'Full-Stack Developer',
  titleAr: 'مطور ويب متكامل',
  bio: 'I craft elegant solutions to complex problems, specializing in web development with a passion for clean code and intuitive user experiences.',
  bioAr: 'أصمم حلولاً أنيقة للمشكلات المعقدة، متخصص في تطوير الويب مع شغف بالكود النظيف وتجربة المستخدم البديهية.',
  email: 'hello@portfolio.com',
  phone: '+1 234 567 890',
  location: 'San Francisco, CA',
  locationAr: 'سان فرانسيسكو، كاليفورنيا',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
};

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    titleAr: 'منصة تجارة إلكترونية',
    description: 'A full-featured online store with cart, payments, and admin dashboard.',
    descriptionAr: 'متجر إلكتروني متكامل مع سلة التسوق والدفع ولوحة التحكم.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    category: 'fullstack',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Task Management App',
    titleAr: 'تطبيق إدارة المهام',
    description: 'A collaborative project management tool with real-time updates.',
    descriptionAr: 'أداة إدارة مشاريع تعاونية مع تحديثات فورية.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
    category: 'frontend',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

const defaultSkills: Skill[] = [
  { id: '1', name: 'React', nameAr: 'رياكت', category: 'frontend', level: 90 },
  { id: '2', name: 'TypeScript', nameAr: 'تايب سكريبت', category: 'frontend', level: 85 },
  { id: '3', name: 'Node.js', nameAr: 'نود جي إس', category: 'backend', level: 80 },
  { id: '4', name: 'Python', nameAr: 'بايثون', category: 'backend', level: 75 },
  { id: '5', name: 'React Native', nameAr: 'رياكت نيتف', category: 'mobile', level: 70 },
  { id: '6', name: 'Git', nameAr: 'جيت', category: 'tools', level: 85 },
];

const defaultCertificates: Certificate[] = [
  {
    id: '1',
    title: 'AWS Solutions Architect',
    titleAr: 'مهندس حلول AWS',
    issuer: 'Amazon Web Services',
    issuerAr: 'أمازون ويب سيرفيسز',
    date: '2024-01',
    credentialUrl: 'https://aws.amazon.com',
  },
  {
    id: '2',
    title: 'Google Cloud Professional',
    titleAr: 'محترف Google Cloud',
    issuer: 'Google',
    issuerAr: 'جوجل',
    date: '2023-06',
    credentialUrl: 'https://cloud.google.com',
  },
];

const defaultMessages: Message[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'Hi, I would like to discuss a potential project with you.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('portfolio-profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio-projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('portfolio-skills');
    return saved ? JSON.parse(saved) : defaultSkills;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('portfolio-certificates');
    return saved ? JSON.parse(saved) : defaultCertificates;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('portfolio-messages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio-skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('portfolio-certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('portfolio-messages', JSON.stringify(messages));
  }, [messages]);

  // Profile
  const updateProfile = (data: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  // Projects
  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Skills
  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...skill, id: generateId() };
    setSkills(prev => [...prev, newSkill]);
  };

  const updateSkill = (id: string, data: Partial<Skill>) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  // Certificates
  const addCertificate = (certificate: Omit<Certificate, 'id'>) => {
    const newCertificate: Certificate = { ...certificate, id: generateId() };
    setCertificates(prev => [...prev, newCertificate]);
  };

  const updateCertificate = (id: string, data: Partial<Certificate>) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  // Messages
  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <AdminDataContext.Provider value={{
      profile,
      updateProfile,
      projects,
      addProject,
      updateProject,
      deleteProject,
      skills,
      addSkill,
      updateSkill,
      deleteSkill,
      certificates,
      addCertificate,
      updateCertificate,
      deleteCertificate,
      messages,
      markMessageAsRead,
      deleteMessage,
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
