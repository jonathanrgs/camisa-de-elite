import { Router } from 'express';
import { 
  getMyOrders,
  getOrderById,
  createOrder,
  getMyReviews,
  createReview,
  getProductsToReview
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Pedidos
router.get('/orders', getMyOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);

// Avaliações
router.get('/reviews', getMyReviews);
router.post('/reviews', createReview);
router.get('/reviews/pending', getProductsToReview);

export default router;
