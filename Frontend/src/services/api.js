import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('wayfare_user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear user on token expiration if unauthorized on protected endpoints
    }
    return Promise.reject(error);
  }
);

export default API;
