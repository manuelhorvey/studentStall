import axios from 'axios';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Intercept requests to attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle token expiration
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:3000/auth/refresh', { refreshToken });
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        
        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        } else {
          const router = useRouter();
          router.push('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
