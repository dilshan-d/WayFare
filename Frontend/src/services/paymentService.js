import api from './api';

export const paymentService = {
  // Process payment
  processPayment: async (paymentData) => {
    const response = await api.post('/payments/process', paymentData);
    return response.data;
  },

  // Get user payments
  getMyPayments: async () => {
    const response = await api.get('/payments/my');
    return response.data;
  },

  // Get all payments (Admin)
  getAllPayments: async () => {
    const response = await api.get('/payments/admin');
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
};

export default paymentService;
