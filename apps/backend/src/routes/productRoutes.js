import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { inventoryController } from '../controllers/inventoryController.js';
import { reviewController } from '../controllers/reviewController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

// Listagem pública
router.get('/', asyncHandler(productController.list));
router.get('/:slug', asyncHandler(productController.getBySlug));

// Estoque
router.get('/:id/inventory', asyncHandler(inventoryController.getByProduct));

// Avaliações
router.get('/:id/reviews', asyncHandler(reviewController.listByProduct));
router.post('/:id/reviews', asyncHandler(reviewController.create));

export default router;
