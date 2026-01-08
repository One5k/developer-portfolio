import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectsApi, skillsApi, certificatesApi, messagesApi, profileApi, experiencesApi, heroApi, aboutApi, educationApi } from '@/lib/api';

export interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  technologies: string[];
  live_url?: string;
  github_url?: string;
  is_featured: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name_en: string;
  name_ar: string;
  category: 'frontend' | 'backend' | 'mobile' | 'tools' | 'soft';
  proficiency: number;
  icon_name?: string;
}

export interface Experience {
  id: string;
  company_en: string;
  company_ar: string;
  position_en: string;
  position_ar: string;
  start_date: string;
  end_date?: string;
  description_en: string;
  description_ar: string;
  company_url?: string;
  location_en?: string;
  location_ar?: string;
}

export interface Education {
  id: string;
  degree_en: string;
  degree_ar: string;
  institution_en: string;
  institution_ar: string;
  field_of_study_en?: string;
  field_of_study_ar?: string;
  start_date: string;
  end_date?: string;
  description_en?: string;
  description_ar?: string;
  location_en?: string;
  location_ar?: string;
  gpa?: string;
}

export interface Certificate {
  id: string;
  title_en: string;
  title_ar: string;
  issuer_en: string;
  issuer_ar: string;
  issue_date: string;
  credential_url?: string;
}

export interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  bio_en: string;
  bio_ar: string;
  created_at?: string;
  updated_at?: string;
  email: string;
  phone: string;
  location_en: string;
  location_ar: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  resume_url?: string;
  avatar_url?: string;
}

export interface HeroData {
  greeting_en: string;
  greeting_ar: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
  hero_image_url: string;
}

export interface AboutData {
  bio_en: string;
  bio_ar: string;
  years_of_experience: number;
  completed_projects_count: number;
  happy_clients_count: number;
}

interface AdminDataContextType {
  // Profile
  profile: Profile | null;
  updateProfile: (data: Partial<Profile>) => Promise<void>;

  // Hero & About
  hero: HeroData | null;
  about: AboutData | null;
  updateHero: (data: Partial<HeroData>) => Promise<void>;
  updateAbout: (data: Partial<AboutData>) => Promise<void>;

  // Projects
  projects: Project[];
  loading: boolean;
  addProject: (project: any) => Promise<void>;
  updateProject: (id: string, data: any) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;

  // Skills
  skills: Skill[];
  addSkill: (skill: any) => Promise<void>;
  updateSkill: (id: string, data: any) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  refreshSkills: () => Promise<void>;

  // Certificates
  certificates: Certificate[];
  addCertificate: (certificate: any) => Promise<void>;
  updateCertificate: (id: string, data: any) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  refreshCertificates: () => Promise<void>;

  // Messages
  messages: Message[];
  markMessageAsRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  refreshMessages: () => Promise<void>;

  // Experiences
  experiences: Experience[];
  addExperience: (experience: any) => Promise<void>;
  updateExperience: (id: string, data: any) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  refreshExperiences: () => Promise<void>;

  // Education
  education: Education[];
  addEducation: (education: any) => Promise<void>;
  updateEducation: (id: string, data: any) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  refreshEducation: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          refreshProjects(),
          refreshSkills(),
          refreshExperiences(),
          refreshEducation(),
          refreshCertificates(),
          refreshMessages(),
          refreshProfile(),
          refreshHero(),
          refreshAbout(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Profile functions
  const refreshProfile = async () => {
    try {
      const { profile: data } = await profileApi.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const { profile: updated } = await profileApi.updateProfile(data);
      setProfile(updated);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Hero functions
  const refreshHero = async () => {
    try {
      const { hero: data } = await heroApi.getHero();
      setHero(data);
    } catch (error) {
      console.error('Error fetching hero:', error);
    }
  };

  const updateHero = async (data: Partial<HeroData>) => {
    try {
      const { hero: updated } = await heroApi.updateHero(data);
      setHero(updated);
    } catch (error) {
      console.error('Error updating hero:', error);
      throw error;
    }
  };

  // About functions
  const refreshAbout = async () => {
    try {
      const { about: data } = await aboutApi.getAbout();
      setAbout(data);
    } catch (error) {
      console.error('Error fetching about:', error);
    }
  };

  const updateAbout = async (data: Partial<AboutData>) => {
    try {
      const { about: updated } = await aboutApi.updateAbout(data);
      setAbout(updated);
    } catch (error) {
      console.error('Error updating about:', error);
      throw error;
    }
  };

  // Projects functions
  const refreshProjects = async () => {
    try {
      const { projects: data } = await projectsApi.getAll();
      setProjects(data.map(p => ({ ...p, id: String(p.id) })));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const addProject = async (project: any) => {
    try {
      await projectsApi.create({
        title_en: project.title,
        title_ar: project.titleAr,
        description_en: project.description,
        description_ar: project.descriptionAr,
        category: project.category,
        image_url: project.image,
        live_url: project.liveUrl,
        github_url: project.githubUrl,
        is_featured: project.featured,
        skill_ids: [], // Handle skill mapping if needed
      });
      await refreshProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, data: any) => {
    try {
      await projectsApi.update(id, {
        title_en: data.title,
        title_ar: data.titleAr,
        description_en: data.description,
        description_ar: data.descriptionAr,
        category: data.category,
        image_url: data.image,
        live_url: data.liveUrl,
        github_url: data.githubUrl,
        is_featured: data.featured,
      });
      await refreshProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsApi.delete(id);
      await refreshProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  // Skills functions
  const refreshSkills = async () => {
    try {
      const { skills: data } = await skillsApi.getAll();
      setSkills(data.map(s => ({ ...s, id: String(s.id) })));
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const addSkill = async (skill: any) => {
    try {
      await skillsApi.create({
        name_en: skill.name,
        name_ar: skill.nameAr,
        category: skill.category,
        proficiency: skill.level,
        icon_name: skill.icon,
      });
      await refreshSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  };

  const updateSkill = async (id: string, data: any) => {
    try {
      await skillsApi.update(id, {
        name_en: data.name,
        name_ar: data.nameAr,
        category: data.category,
        proficiency: data.level,
        icon_name: data.icon,
      });
      await refreshSkills();
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await skillsApi.delete(id);
      await refreshSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  };

  // Experiences functions
  const refreshExperiences = async () => {
    try {
      const { experiences: data } = await experiencesApi.getAll();
      setExperiences(data.map(e => ({ ...e, id: String(e.id) })));
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const addExperience = async (experience: any) => {
    try {
      // Pass the payload directly since it's now formatted correctly in the component
      await experiencesApi.create(experience);
      await refreshExperiences();
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  };

  const updateExperience = async (id: string, data: any) => {
    try {
      // Pass the payload directly
      await experiencesApi.update(id, data);
      await refreshExperiences();
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await experiencesApi.delete(id);
      await refreshExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  };

  // Education functions
  const refreshEducation = async () => {
    try {
      const { education: data } = await educationApi.getAll();
      setEducation(data.map(e => ({ ...e, id: String(e.id) })));
    } catch (error) {
      console.error('Error fetching education:', error);
    }
  };

  const addEducation = async (education: any) => {
    try {
      await educationApi.create(education);
      await refreshEducation();
    } catch (error) {
      console.error('Error adding education:', error);
      throw error;
    }
  };

  const updateEducation = async (id: string, data: any) => {
    try {
      await educationApi.update(id, data);
      await refreshEducation();
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      await educationApi.delete(id);
      await refreshEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  };

  // Certificates functions
  const refreshCertificates = async () => {
    try {
      const { certificates: data } = await certificatesApi.getAll();
      setCertificates(data.map(c => ({ ...c, id: String(c.id) })));
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const addCertificate = async (certificate: any) => {
    try {
      await certificatesApi.create({
        title_en: certificate.title,
        title_ar: certificate.titleAr,
        issuer_en: certificate.issuer,
        issuer_ar: certificate.issuerAr,
        issue_date: certificate.date,
        credential_url: certificate.credentialUrl,
      });
      await refreshCertificates();
    } catch (error) {
      console.error('Error adding certificate:', error);
      throw error;
    }
  };

  const updateCertificate = async (id: string, data: any) => {
    try {
      await certificatesApi.update(id, {
        title_en: data.title,
        title_ar: data.titleAr,
        issuer_en: data.issuer,
        issuer_ar: data.issuerAr,
        issue_date: data.date,
        credential_url: data.credentialUrl,
      });
      await refreshCertificates();
    } catch (error) {
      console.error('Error updating certificate:', error);
      throw error;
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      await certificatesApi.delete(id);
      await refreshCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      throw error;
    }
  };

  // Messages functions
  const refreshMessages = async () => {
    try {
      const { messages: data } = await messagesApi.getAll();
      setMessages(data.map(m => ({ ...m, id: String(m.id) })));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      await messagesApi.markAsRead(id);
      await refreshMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await messagesApi.delete(id);
      await refreshMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  return (
    <AdminDataContext.Provider value={{
      profile,
      updateProfile,
      hero,
      about,
      updateHero,
      updateAbout,
      projects,
      loading,
      addProject,
      updateProject,
      deleteProject,
      refreshProjects,
      skills,
      addSkill,
      updateSkill,
      deleteSkill,
      refreshSkills,
      certificates,
      addCertificate,
      updateCertificate,
      deleteCertificate,
      refreshCertificates,
      messages,
      markMessageAsRead,
      deleteMessage,
      refreshMessages,
      experiences,
      addExperience,
      updateExperience,
      deleteExperience,
      refreshExperiences,
      education,
      addEducation,
      updateEducation,
      deleteEducation,
      refreshEducation,
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
