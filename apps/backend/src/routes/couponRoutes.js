// Ativar/Inativar cupom

import express from 'express';
import couponController from '../controllers/couponController.js';

const router = express.Router();

// CRUD de cupons
router.get('/', couponController.list);
router.post('/', couponController.create);
router.put('/:id', couponController.update);
router.delete('/:id', couponController.remove);
router.patch('/:id/toggle', couponController.toggleActive);

// Validação e aplicação
router.post('/validate', couponController.validate);
router.post('/apply', couponController.apply);

export default router;
