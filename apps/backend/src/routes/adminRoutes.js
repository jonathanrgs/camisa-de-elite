import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { inventoryController } from '../controllers/inventoryController.js';
import { orderController } from '../controllers/orderController.js';
import { reviewController } from '../controllers/reviewController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

// Produtos
router.post('/products', asyncHandler(productController.create));
router.put('/products/:id', asyncHandler(productController.update));
router.delete('/products/:id', asyncHandler(productController.delete));
router.put('/products/:id/inventory', asyncHandler(inventoryController.update));

// Pedidos
router.get('/orders', asyncHandler(orderController.list));
router.get('/orders/:id', asyncHandler(orderController.getById));
router.put('/orders/:id/status', asyncHandler(orderController.updateStatus));
router.post('/orders/:id/confirm', asyncHandler(orderController.confirm));
router.put('/orders/:id/expire', asyncHandler(orderController.updateExpiration));

// Reviews
router.get('/reviews', asyncHandler(reviewController.listPending));
router.put('/reviews/:id/approve', asyncHandler(reviewController.approve));
router.delete('/reviews/:id', asyncHandler(reviewController.delete));

export default router;
