import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.get('/:token', asyncHandler(orderController.getByToken));

export default router;
