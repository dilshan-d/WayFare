import API from './api';

export const hotelService = {
  getHotels: async (params = {}) => {
    const response = await API.get('/hotels', { params });
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await API.get(`/hotels/${id}`);
    return response.data;
  },

  createHotel: async (data) => {
    const response = await API.post('/hotels', data);
    return response.data;
  },

  updateHotel: async (id, data) => {
    const response = await API.put(`/hotels/${id}`, data);
    return response.data;
  },

  deleteHotel: async (id) => {
    const response = await API.delete(`/hotels/${id}`);
    return response.data;
  },
};

export default hotelService;
