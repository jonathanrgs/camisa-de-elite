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
  saveShippingConfig: (data) => api.post('/admin/shipping-config', data),

  // ========================
  // Grupos de Tamanho
  // ========================
  getSizeGroups: () => api.get('/admin/size-groups'),
  createSizeGroup: (data) => api.post('/admin/size-groups', data),
  updateSizeGroup: (id, data) => api.put(`/admin/size-groups/${id}`, data),
  deleteSizeGroup: (id) => api.delete(`/admin/size-groups/${id}`),
  createSize: (groupId, data) => api.post(`/admin/size-groups/${groupId}/sizes`, data),
  updateSize: (id, data) => api.put(`/admin/sizes/${id}`, data),
  deleteSize: (id) => api.delete(`/admin/sizes/${id}`),
  reorderSizes: (groupId, sizes) => api.put(`/admin/size-groups/${groupId}/sizes/reorder`, { sizes }),

  // ========================
  // Categorias
  // ========================
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // ========================
  // Tipos de Produto
  // ========================
  getProductTypes: () => api.get('/admin/product-types'),
  createProductType: (data) => api.post('/admin/product-types', data),
  updateProductType: (id, data) => api.put(`/admin/product-types/${id}`, data),
  deleteProductType: (id) => api.delete(`/admin/product-types/${id}`),
};
