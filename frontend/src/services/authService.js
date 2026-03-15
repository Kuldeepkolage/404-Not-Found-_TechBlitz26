import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      // Check if it's a network error (backend not running)
      if (!error.response || error.code === 'ECONNREFUSED') {
        // For demo fallback if backend is not running
        if ((email === 'receptionist@clinic.com' || email === 'reception@test.com') && (password === 'password' || password === 'password123')) {
           const role = 'receptionist';
           localStorage.setItem('token', 'demo-token');
           localStorage.setItem('role', role);
           toast.success(`Demo Login successful as ${role}! (Offline Mode)`);
           return { token: 'demo', role, user: { name: 'Demo Receptionist', role } };
        }
        if ((email === 'doctor@clinic.com' || email === 'doctor@test.com') && (password === 'password' || password === 'password123')) {
           const role = 'doctor';
           localStorage.setItem('token', 'demo-token');
           localStorage.setItem('role', role);
           toast.success(`Demo Login successful as ${role}! (Offline Mode)`);
           return { token: 'demo', role, user: { name: 'Demo Doctor', role } };
        }
        toast.error('Cannot connect to backend server. Please make sure the server is running.');
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
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
