import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/password', passwordData)
};

// Projects API calls
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getUserProjects: (userId) => api.get(`/projects/user/${userId}`),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  addPage: (id, pageData) => api.post(`/projects/${id}/pages`, pageData),
  updatePage: (id, pageId, pageData) => api.put(`/projects/${id}/pages/${pageId}`, pageData),
  deletePage: (id, pageId) => api.delete(`/projects/${id}/pages/${pageId}`),
  publish: (id, publishData) => api.put(`/projects/${id}/publish`, publishData)
};

// Components API calls
export const componentsAPI = {
  getAll: () => api.get('/components'),
  getByCategory: (category) => api.get(`/components/category/${category}`),
  getUserComponents: (userId) => api.get(`/components/user/${userId}`),
  getById: (id) => api.get(`/components/${id}`),
  create: (componentData) => api.post('/components', componentData),
  update: (id, componentData) => api.put(`/components/${id}`, componentData),
  delete: (id) => api.delete(`/components/${id}`),
  clone: (id, cloneData) => api.post(`/components/${id}/clone`, cloneData)
};

// Templates API calls
export const templatesAPI = {
  getAll: () => api.get('/templates'),
  getByCategory: (category) => api.get(`/templates/category/${category}`),
  getUserTemplates: () => api.get('/templates/user'),
  getById: (id) => api.get(`/templates/${id}`),
  create: (templateData) => api.post('/templates', templateData),
  update: (id, templateData) => api.put(`/templates/${id}`, templateData),
  delete: (id) => api.delete(`/templates/${id}`)
};

export const formValidationsAPI = {
  getAll: () => api.get('/form-validations'),
  getById: (id) => api.get(`/form-validations/${id}`),
  create: (formValidationData) => api.post('/form-validations', formValidationData),
  update: (id, formValidationData) => api.put(`/form-validations/${id}`, formValidationData),
  delete: (id) => api.delete(`/form-validations/${id}`),
  validate: (formId, formData) => api.post('/form-validations/validate', { formId, formData })
};

export default api;
