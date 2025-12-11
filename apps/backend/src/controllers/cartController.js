import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Tempo de expiração da reserva: 30 minutos
const RESERVATION_TIMEOUT_MS = 30 * 60 * 1000;

export const cartController = {
  /**
   * POST /api/cart/reserve
   * Reserva estoque para um item do carrinho
   */
  async reserveStock(req, res) {
    try {
      const { sessionId, productId, size, quantity } = req.body;

      if (!sessionId || !productId || !size || quantity === undefined) {
        return errorResponse(res, 'Dados incompletos', 'INVALID_DATA', 400);
      }

      // Buscar inventário do produto
      const inventory = await prisma.inventory.findUnique({
        where: { productId }
      });

      if (!inventory) {
        return errorResponse(res, 'Produto não encontrado', 'PRODUCT_NOT_FOUND', 404);
      }

      const stock = JSON.parse(inventory.stock || '{}');
      const availableStock = stock[size] || 0;

      // Buscar reserva existente deste mesmo item (para atualizar)
      const existingReservation = await prisma.cartReservation.findUnique({
        where: {
          sessionId_productId_size: { sessionId, productId, size }
        }
      });

      // Buscar todas as reservas ativas deste produto/tamanho (exceto a atual)
      const otherReservations = await prisma.cartReservation.aggregate({
        where: {
          productId,
          size,
          expiresAt: { gt: new Date() },
          NOT: existingReservation ? { id: existingReservation.id } : undefined
        },
        _sum: { quantity: true }
      });

      const reservedByOthers = otherReservations._sum.quantity || 0;
      const realAvailable = availableStock - reservedByOthers;

      // Verificar se a quantidade solicitada está disponível
      if (quantity > realAvailable) {
        return errorResponse(
          res, 
          `Estoque insuficiente. Disponível: ${realAvailable}`, 
          'INSUFFICIENT_STOCK', 
          400,
          { available: realAvailable, requested: quantity }
        );
      }

      // Criar ou atualizar reserva
      const expiresAt = new Date(Date.now() + RESERVATION_TIMEOUT_MS);

      const reservation = await prisma.cartReservation.upsert({
        where: {
          sessionId_productId_size: { sessionId, productId, size }
        },
        update: {
          quantity,
          expiresAt,
          updatedAt: new Date()
        },
        create: {
          sessionId,
          productId,
          size,
          quantity,
          expiresAt
        }
      });

      return successResponse(res, {
        reservation,
        availableStock: realAvailable - quantity,
        expiresAt
      });
    } catch (error) {
      console.error('Erro ao reservar estoque:', error);
      return errorResponse(res, 'Erro interno', 'INTERNAL_ERROR', 500);
    }
  },

  /**
   * DELETE /api/cart/release
   * Libera reserva de um item do carrinho
   */
  async releaseStock(req, res) {
    try {
      const { sessionId, productId, size } = req.body;

      if (!sessionId) {
        return errorResponse(res, 'Session ID obrigatório', 'INVALID_DATA', 400);
      }

      // Se productId e size fornecidos, remove item específico
      if (productId && size) {
        await prisma.cartReservation.deleteMany({
          where: { sessionId, productId, size }
        });
      } else {
        // Senão, limpa todo o carrinho da sessão
        await prisma.cartReservation.deleteMany({
          where: { sessionId }
        });
      }

      return successResponse(res, { message: 'Reserva liberada' });
    } catch (error) {
      console.error('Erro ao liberar reserva:', error);
      return errorResponse(res, 'Erro interno', 'INTERNAL_ERROR', 500);
    }
  },

  /**
   * POST /api/cart/refresh
   * Atualiza o tempo de expiração de todas as reservas da sessão
   */
  async refreshReservations(req, res) {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return errorResponse(res, 'Session ID obrigatório', 'INVALID_DATA', 400);
      }

      const expiresAt = new Date(Date.now() + RESERVATION_TIMEOUT_MS);

      await prisma.cartReservation.updateMany({
        where: { sessionId },
        data: { expiresAt, updatedAt: new Date() }
      });

      return successResponse(res, { expiresAt });
    } catch (error) {
      console.error('Erro ao atualizar reservas:', error);
      return errorResponse(res, 'Erro interno', 'INTERNAL_ERROR', 500);
    }
  },

  /**
   * GET /api/cart/check-stock/:productId/:size
   * Verifica estoque disponível (real - reservado)
   */
  async checkAvailableStock(req, res) {
    try {
      const { productId, size } = req.params;
      const { sessionId } = req.query;

      const inventory = await prisma.inventory.findUnique({
        where: { productId }
      });

      if (!inventory) {
        return successResponse(res, { available: 0, total: 0 });
      }

      const stock = JSON.parse(inventory.stock || '{}');
      const totalStock = stock[size] || 0;

      // Somar todas as reservas ativas (exceto a do próprio sessionId se fornecido)
      const reservations = await prisma.cartReservation.aggregate({
        where: {
          productId,
          size,
          expiresAt: { gt: new Date() },
          ...(sessionId ? { NOT: { sessionId } } : {})
        },
        _sum: { quantity: true }
      });

      const reserved = reservations._sum.quantity || 0;
      const available = Math.max(0, totalStock - reserved);

      return successResponse(res, { 
        available, 
        total: totalStock, 
        reserved 
      });
    } catch (error) {
      console.error('Erro ao verificar estoque:', error);
      return errorResponse(res, 'Erro interno', 'INTERNAL_ERROR', 500);
    }
  },

  /**
   * GET /api/cart/reservations/:sessionId
   * Lista todas as reservas de uma sessão
   */
  async getReservations(req, res) {
    try {
      const { sessionId } = req.params;

      const reservations = await prisma.cartReservation.findMany({
        where: { 
          sessionId,
          expiresAt: { gt: new Date() }
        }
      });

      return successResponse(res, reservations);
    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      return errorResponse(res, 'Erro interno', 'INTERNAL_ERROR', 500);
    }
  },

  /**
   * Limpa reservas expiradas (chamado pelo job)
   */
  async cleanupExpiredReservations() {
    try {
      const result = await prisma.cartReservation.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
      
      if (result.count > 0) {
        console.log(`🧹 Limpeza: ${result.count} reservas expiradas removidas`);
      }
      
      return result.count;
    } catch (error) {
      console.error('Erro na limpeza de reservas:', error);
      return 0;
    }
  }
};
