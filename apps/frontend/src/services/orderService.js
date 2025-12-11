import { api } from './api';

export const orderService = {
  checkout: (data) => api.post('/checkout', data),

  getByToken: (token) => api.get(`/order-link/${token}`),

  getWhatsAppUrl: (orderId) => api.get(`/whatsapp/message/${orderId}`)
};
