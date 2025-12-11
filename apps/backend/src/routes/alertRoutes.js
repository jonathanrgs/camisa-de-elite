import { Router } from 'express';
import { inventoryController } from '../controllers/inventoryController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.post('/back-in-stock', asyncHandler(inventoryController.createAlert));

export default router;
