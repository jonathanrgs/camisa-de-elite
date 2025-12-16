import { api } from './api.js';

export const couponApi = {
    // Ativa/Inativa cupom
    async toggleActive(id) {
      return api.patch(`/coupons/${id}/toggle`);
    },
  // Lista todos os cupons
  async list() {
    return api.get('/coupons');
  },
  // Cria um novo cupom
  async create(data) {
    return api.post('/coupons', data);
  },
  // Atualiza um cupom existente
  async update(id, data) {
    return api.put(`/coupons/${id}`, data);
  },
  // Remove um cupom
  async remove(id) {
    return api.delete(`/coupons/${id}`);
  },
  // Valida cupom no backend
  async checkCoupon(code, cartTotal) {
    return api.post('/coupons/validate', { code, cartTotal });
  },
  // Aplica cupom no backend
  async calculateDiscount(coupon, cartTotal, shipping) {
    return api.post('/coupons/apply', { coupon, cartTotal, shipping });
  }
};

// Valida cupom no backend
