import { api } from './api';

export const productService = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/products${query ? `?${query}` : ''}`);
  },

  getBySlug: (slug) => api.get(`/products/${slug}`),

  getInventory: (id) => api.get(`/products/${id}/inventory`),

  getReviews: (id) => api.get(`/products/${id}/reviews`),

  createReview: (id, data) => api.post(`/products/${id}/reviews`, data)
};
