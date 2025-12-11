import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.get('/message/:orderId', asyncHandler(orderController.getWhatsAppMessage));

export default router;
