import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';

const router = Router();

// Reservar estoque ao adicionar item ao carrinho
router.post('/reserve', cartController.reserveStock);

// Liberar reserva ao remover item do carrinho
router.delete('/release', cartController.releaseStock);

// Atualizar tempo de expiração (heartbeat)
router.post('/refresh', cartController.refreshReservations);

// Verificar estoque disponível de um produto/tamanho
router.get('/check-stock/:productId/:size', cartController.checkAvailableStock);

// Listar reservas de uma sessão
router.get('/reservations/:sessionId', cartController.getReservations);

export default router;
