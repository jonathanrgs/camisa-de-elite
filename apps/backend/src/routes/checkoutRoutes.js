import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/', optionalAuth, asyncHandler(orderController.checkout));

export default router;
