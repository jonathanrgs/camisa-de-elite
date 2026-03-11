// Ativar/Inativar cupom

import express from 'express';
import couponController from '../controllers/couponController.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public: validation and application
router.get('/', couponController.list);
router.post('/validate', couponController.validate);
router.post('/apply', couponController.apply);

// Admin-only: CRUD
router.post('/', authenticate, authorizeAdmin, couponController.create);
router.put('/:id', authenticate, authorizeAdmin, couponController.update);
router.delete('/:id', authenticate, authorizeAdmin, couponController.remove);
router.patch('/:id/toggle', authenticate, authorizeAdmin, couponController.toggleActive);

export default router;
