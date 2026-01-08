const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Generic API call helper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Authentication API
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await apiCall<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getMe: () => apiCall<{ user: any }>('/auth/me'),
};

// Profile API
export const profileApi = {
  getProfile: () => apiCall<{ profile: any }>('/profile'),
  updateProfile: (data: any) => apiCall<{ success: boolean; profile: any }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Hero Section API
export const heroApi = {
  getHero: () => apiCall<{ hero: any }>('/hero'),
  updateHero: (data: any) => apiCall<{ success: boolean; hero: any }>('/hero', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// About Section API
export const aboutApi = {
  getAbout: () => apiCall<{ about: any }>('/about'),
  updateAbout: (data: any) => apiCall<{ success: boolean; about: any }>('/about', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Projects API
export const projectsApi = {
  getAll: () => apiCall<{ projects: any[] }>('/projects'),
  getOne: (id: string) => apiCall<{ project: any }>(`/projects/${id}`),
  create: (data: any) => apiCall<{ success: boolean; projectId: number }>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<{ success: boolean }>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<{ success: boolean }>(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Skills API
export const skillsApi = {
  getAll: () => apiCall<{ skills: any[] }>('/skills'),
  getOne: (id: string) => apiCall<{ skill: any }>(`/skills/${id}`),
  create: (data: any) => apiCall<{ success: boolean; skillId: number }>('/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<{ success: boolean }>(`/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<{ success: boolean }>(`/skills/${id}`, {
    method: 'DELETE',
  }),
};

// Experiences API
export const experiencesApi = {
  getAll: () => apiCall<{ experiences: any[] }>('/experiences'),
  create: (data: any) => apiCall<{ success: boolean; experienceId: number }>('/experiences', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<{ success: boolean }>(`/experiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<{ success: boolean }>(`/experiences/${id}`, {
    method: 'DELETE',
  }),
};

// Certificates API
export const certificatesApi = {
  getAll: () => apiCall<{ certificates: any[] }>('/certificates'),
  create: (data: any) => apiCall<{ success: boolean; certificateId: number }>('/certificates', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<{ success: boolean }>(`/certificates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<{ success: boolean }>(`/certificates/${id}`, {
    method: 'DELETE',
  }),
};

// Messages API
export const messagesApi = {
  getAll: () => apiCall<{ messages: any[] }>('/messages'),
  create: (data: any) => apiCall<{ success: boolean; messageId: number }>('/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  markAsRead: (id: string) => apiCall<{ success: boolean }>(`/messages/${id}/read`, {
    method: 'PUT',
  }),
  delete: (id: string) => apiCall<{ success: boolean }>(`/messages/${id}`, {
    method: 'DELETE',
  }),
};

// Education API
export const educationApi = {
  getAll: () => apiCall<{ education: any[] }>('/education'),
  create: (data: any) => apiCall<{ success: boolean; educationId: number }>('/education', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<{ success: boolean }>(`/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<{ success: boolean }>(`/education/${id}`, {
    method: 'DELETE',
  }),
};

