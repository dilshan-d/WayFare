import API from './api';

export const tourService = {
  getTours: async (params = {}) => {
    const response = await API.get('/tours', { params });
    return response.data;
  },

  getTourById: async (id) => {
    const response = await API.get(`/tours/${id}`);
    return response.data;
  },

  createTour: async (data) => {
    const response = await API.post('/tours', data);
    return response.data;
  },

  updateTour: async (id, data) => {
    const response = await API.put(`/tours/${id}`, data);
    return response.data;
  },

  deleteTour: async (id) => {
    const response = await API.delete(`/tours/${id}`);
    return response.data;
  },
};

export default tourService;
