import API from './api';

export const roomService = {
  getRooms: async (params = {}) => {
    const response = await API.get('/rooms', { params });
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await API.get(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (data) => {
    const response = await API.post('/rooms', data);
    return response.data;
  },

  updateRoom: async (id, data) => {
    const response = await API.put(`/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await API.delete(`/rooms/${id}`);
    return response.data;
  },
};

export default roomService;
