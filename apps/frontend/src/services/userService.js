import { api } from './api';

export const userService = {
  // Pedidos
  getMyOrders: () => api.get('/user/orders'),
  getOrderById: (id) => api.get(`/user/orders/${id}`),
  createOrder: (data) => api.post('/user/orders', data),

  // Avaliações
  getMyReviews: () => api.get('/user/reviews'),
  createReview: (data) => api.post('/user/reviews', data),
  getProductsToReview: () => api.get('/user/reviews/pending')
};
