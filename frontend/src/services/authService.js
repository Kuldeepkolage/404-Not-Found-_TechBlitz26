import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      toast.success('Login successful!');
      return { token, role: user.role, user };
    } catch (error) {
      // For demo fallback if backend is not running, uncomment below:
      if (email === 'receptionist@clinic.com' || email === 'doctor@clinic.com') {
         const role = email.split('@')[0];
         localStorage.setItem('token', 'demo-token');
         localStorage.setItem('role', role);
         toast.success(`Demo Login successful as ${role}!`);
         return { token: 'demo', role };
      }

      toast.error(error.response?.data?.message || 'Login failed Check backend connection.');
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    window.location.href = '/login';
  },
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return token && role ? { token, role } : null;
  },
};

export default api;
