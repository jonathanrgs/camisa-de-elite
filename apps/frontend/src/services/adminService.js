import { api } from './api';

export const adminService = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),

  // Produtos
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/products${query ? `?${query}` : ''}`);
  },
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  exportProductsCSV: async () => {
    const response = await fetch('/api/admin/products/export/csv', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Erro ao exportar');
    return response.blob();
  },

  // Pedidos
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/orders${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),

  // Avaliações
  getPendingReviews: () => api.get('/admin/reviews/pending'),
  moderateReview: (id, approve) => api.put(`/admin/reviews/${id}/moderate`, { approve }),

  // Usuários
  getUsers: () => api.get('/admin/users'),

  // Criar novo admin
  createAdmin: (data) => api.post('/auth/admin', data),

  // Frete
  getShippingConfig: () => api.get('/admin/shipping-config'),
  saveShippingConfig: (data) => api.post('/admin/shipping-config', data)
};
