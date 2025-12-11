import { api } from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    
    // Só adiciona parâmetros que existem e não são undefined
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    
    const queryString = query.toString();
    const response = await api.get(`/products${queryString ? `?${queryString}` : ''}`);
    return response;
  },

  list: (params = {}) => productService.getProducts(params),

  getBySlug: (slug) => api.get(`/products/${slug}`),

  getInventory: (id) => api.get(`/products/${id}/inventory`),

  getReviews: (id) => api.get(`/products/${id}/reviews`),

  createReview: (id, data) => api.post(`/products/${id}/reviews`, data)
};
