import { api } from './api.js';

// Gerar ou recuperar sessionId do carrinho
const getSessionId = () => {
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
};

export const cartService = {
  getSessionId,

  // Reservar estoque ao adicionar item ao carrinho
  async reserveStock(productId, size, quantity) {
    const sessionId = getSessionId();
    return api.post('/cart/reserve', {
      sessionId,
      productId,
      size,
      quantity
    });
  },

  // Liberar reserva ao remover item
  async releaseStock(productId, size) {
    const sessionId = getSessionId();
    return api.delete('/cart/release', { sessionId, productId, size });
  },

  // Liberar todo o carrinho (ao finalizar pedido ou limpar)
  async releaseAll() {
    const sessionId = getSessionId();
    return api.delete('/cart/release', { sessionId });
  },

  // Atualizar tempo de expiração (heartbeat)
  async refresh() {
    const sessionId = getSessionId();
    return api.post('/cart/refresh', { sessionId });
  },

  // Verificar estoque disponível
  async checkStock(productId, size) {
    const sessionId = getSessionId();
    return api.get(`/cart/check-stock/${productId}/${size}?sessionId=${sessionId}`);
  },

  // Listar reservas da sessão
  async getReservations() {
    const sessionId = getSessionId();
    return api.get(`/cart/reservations/${sessionId}`);
  }
};

export default cartService;
