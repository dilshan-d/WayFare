import API from './api';

export const authService = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('wayfare_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('wayfare_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('wayfare_user');
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('wayfare_user') || 'null');
  },
};

export default authService;
