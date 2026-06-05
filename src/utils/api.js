import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://erp-backend-0ab5.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if token is actually invalid, not for permission issues
      const token = localStorage.getItem('token');
      const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/';
      if (!isLoginPage && (!token || error.response?.data?.message?.includes('Invalid token') || error.response?.data?.message?.includes('No token'))) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { BASE_URL };
export default api;
