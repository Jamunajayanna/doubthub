
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('doubtflow_token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const doubtApi = {
  getAll: () => api.get('/doubts'),
  getOne: (id: string) => api.get(`/doubts/${id}`),
  create: (data: any) => api.post('/doubts', data),
  vote: (id: string, type: 'up' | 'down') => api.post(`/doubts/${id}/vote`, { type }),
  addAnswer: (id: string, content: string) => api.post(`/doubts/${id}/answers`, { content }),
};

export default api;
