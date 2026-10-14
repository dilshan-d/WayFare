import API from './api';

export const reviewService = {
  getReviews: async (params = {}) => {
    const response = await API.get('/reviews', { params });
    return response.data;
  },

  createReview: async (data) => {
    const response = await API.post('/reviews', data);
    return response.data;
  },

  updateReview: async (id, data) => {
    const response = await API.put(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await API.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
