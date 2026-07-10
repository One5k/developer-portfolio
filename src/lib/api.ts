import { supabase } from './supabase';

// Token/Session helpers kept for backward compatibility (if any component uses them)
export const getAuthToken = (): string | null => {
  return localStorage.getItem('sb-access-token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('sb-access-token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('sb-access-token');
};

// Authentication API
export const authApi = {
  login: async (username: string, password: string) => {
    let email = username;
    // Helper to allow logging in with 'admin' or an email
    if (!username.includes('@')) {
      email = `${username}@example.com`;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      setAuthToken(data.session.access_token);
    }

    return {
      token: data.session?.access_token || '',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: 'admin',
      },
    };
  },

  logout: async () => {
    removeAuthToken();
    await supabase.auth.signOut();
  },

  getMe: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      throw new Error('No session');
    }
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: 'admin',
      },
    };
  },
};

// Profile API
export const profileApi = {
  getProfile: async () => {
    const { data, error } = await supabase.from('profile').select('*').limit(1).single();
    if (error) throw error;
    return { profile: data };
  },
  updateProfile: async (data: any) => {
    const { data: updated, error } = await supabase
      .from('profile')
      .update(data)
      .eq('id', data.id || 1)
      .select()
      .single();
    if (error) throw error;
    return { success: true, profile: updated };
  },
};

// Hero Section API
export const heroApi = {
  getHero: async () => {
    const { data, error } = await supabase.from('hero_section').select('*').limit(1).single();
    if (error) throw error;
    return { hero: data };
  },
  updateHero: async (data: any) => {
    const { data: updated, error } = await supabase
      .from('hero_section')
      .update(data)
      .eq('id', data.id || 1)
      .select()
      .single();
    if (error) throw error;
    return { success: true, hero: updated };
  },
};

// About Section API
export const aboutApi = {
  getAbout: async () => {
    const { data, error } = await supabase.from('about_section').select('*').limit(1).single();
    if (error) throw error;
    return { about: data };
  },
  updateAbout: async (data: any) => {
    const { data: updated, error } = await supabase
      .from('about_section')
      .update(data)
      .eq('id', data.id || 1)
      .select()
      .single();
    if (error) throw error;
    return { success: true, about: updated };
  },
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_skills (
          skills (
            name_en
          )
        )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const projectsWithSkills = data.map((project: any) => ({
      ...project,
      technologies: project.project_skills
        ? project.project_skills.map((ps: any) => ps.skills?.name_en).filter(Boolean)
        : [],
    }));
    return { projects: projectsWithSkills };
  },
  getOne: async (id: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_skills (
          skills (
            *
          )
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;

    const skills = data.project_skills
      ? data.project_skills.map((ps: any) => ps.skills).filter(Boolean)
      : [];
    return { project: { ...data, skills } };
  },
  create: async (data: any) => {
    const { skill_ids, ...projectData } = data;
    const { data: newProject, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    if (error) throw error;

    if (skill_ids && Array.isArray(skill_ids) && skill_ids.length > 0) {
      const relationRows = skill_ids.map((skillId: any) => ({
        project_id: newProject.id,
        skill_id: skillId,
      }));
      const { error: relError } = await supabase
        .from('project_skills')
        .insert(relationRows);
      if (relError) throw relError;
    }
    return { success: true, projectId: newProject.id };
  },
  update: async (id: string, data: any) => {
    const { skill_ids, ...projectData } = data;

    const { error: updateError } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id);
    if (updateError) throw updateError;

    if (skill_ids !== undefined && Array.isArray(skill_ids)) {
      // Clear current associations
      const { error: deleteError } = await supabase
        .from('project_skills')
        .delete()
        .eq('project_id', id);
      if (deleteError) throw deleteError;

      if (skill_ids.length > 0) {
        const relationRows = skill_ids.map((skillId: any) => ({
          project_id: parseInt(id),
          skill_id: skillId,
        }));
        const { error: insertError } = await supabase
          .from('project_skills')
          .insert(relationRows);
        if (insertError) throw insertError;
      }
    }
    return { success: true };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// Skills API
export const skillsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('name_en', { ascending: true });
    if (error) throw error;
    return { skills: data };
  },
  getOne: async (id: string) => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { skill: data };
  },
  create: async (data: any) => {
    const { data: newSkill, error } = await supabase
      .from('skills')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return { success: true, skillId: newSkill.id };
  },
  update: async (id: string, data: any) => {
    const { error } = await supabase
      .from('skills')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// Experiences API
export const experiencesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) throw error;
    return { experiences: data };
  },
  create: async (data: any) => {
    const { data: newExp, error } = await supabase
      .from('experiences')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return { success: true, experienceId: newExp.id };
  },
  update: async (id: string, data: any) => {
    const { error } = await supabase
      .from('experiences')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// Certificates API
export const certificatesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false });
    if (error) throw error;
    return { certificates: data };
  },
  create: async (data: any) => {
    const { data: newCert, error } = await supabase
      .from('certificates')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return { success: true, certificateId: newCert.id };
  },
  update: async (id: string, data: any) => {
    const { error } = await supabase
      .from('certificates')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// Messages API
export const messagesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { messages: data };
  },
  create: async (data: any) => {
    const { data: newMsg, error } = await supabase
      .from('messages')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return { success: true, messageId: newMsg.id };
  },
  markAsRead: async (id: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// Education API
export const educationApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) throw error;
    return { education: data };
  },
  create: async (data: any) => {
    const { data: newEdu, error } = await supabase
      .from('education')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return { success: true, educationId: newEdu.id };
  },
  update: async (id: string, data: any) => {
    const { error } = await supabase
      .from('education')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// SEO API
export const seoApi = {
  getSeo: async (page: string) => {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_identifier', page)
      .maybeSingle();
    if (error) throw error;
    return { seo: data };
  },
  updateSeo: async (page: string, data: any) => {
    const { error } = await supabase
      .from('seo_settings')
      .upsert({ ...data, page_identifier: page }, { onConflict: 'page_identifier' });
    if (error) throw error;
    return { success: true };
  },
};

// Upload API
export const uploadApi = {
  uploadFile: async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  },
};
