import API from './api';

export const destinationService = {
  getDestinations: async (params = {}) => {
    const response = await API.get('/destinations', { params });
    return response.data;
  },

  getDestinationById: async (id) => {
    const response = await API.get(`/destinations/${id}`);
    return response.data;
  },

  createDestination: async (data) => {
    const response = await API.post('/destinations', data);
    return response.data;
  },

  updateDestination: async (id, data) => {
    const response = await API.put(`/destinations/${id}`, data);
    return response.data;
  },

  deleteDestination: async (id) => {
    const response = await API.delete(`/destinations/${id}`);
    return response.data;
  },
};

export default destinationService;
