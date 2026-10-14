import API from './api';

export const bookingService = {
  // Tour bookings
  createTourBooking: async (data) => {
    const response = await API.post('/tour-bookings', data);
    return response.data;
  },

  getMyTourBookings: async () => {
    const response = await API.get('/tour-bookings/my');
    return response.data;
  },

  getTourBookingById: async (id) => {
    const response = await API.get(`/tour-bookings/${id}`);
    return response.data;
  },

  cancelTourBooking: async (id) => {
    const response = await API.put(`/tour-bookings/${id}/cancel`);
    return response.data;
  },

  // Hotel bookings
  createHotelBooking: async (data) => {
    const response = await API.post('/hotel-bookings', data);
    return response.data;
  },

  getMyHotelBookings: async () => {
    const response = await API.get('/hotel-bookings/my');
    return response.data;
  },

  getHotelBookingById: async (id) => {
    const response = await API.get(`/hotel-bookings/${id}`);
    return response.data;
  },

  cancelHotelBooking: async (id) => {
    const response = await API.put(`/hotel-bookings/${id}/cancel`);
    return response.data;
  },

  // Admin booking management
  getAllAdminBookings: async (params = {}) => {
    const response = await API.get('/admin/bookings', { params });
    return response.data;
  },

  updateAdminBookingStatus: async (id, data) => {
    const response = await API.put(`/admin/bookings/${id}/status`, data);
    return response.data;
  },

  getAdminStats: async () => {
    const response = await API.get('/admin/stats');
    return response.data;
  },
};

export default bookingService;
