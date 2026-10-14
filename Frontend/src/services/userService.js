import API from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await API.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData);
    // Update local storage if current user was updated
    const currentUser = JSON.parse(localStorage.getItem('wayfare_user') || 'null');
    if (currentUser && currentUser._id === id) {
      const updated = { ...currentUser, ...response.data };
      localStorage.setItem('wayfare_user', JSON.stringify(updated));
    }
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
