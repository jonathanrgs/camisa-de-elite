import { Router } from 'express';
import { healthController } from '../controllers/healthController.js';

import productRoutes from './productRoutes.js';
import adminRoutes from './adminRoutes.js';
import checkoutRoutes from './checkoutRoutes.js';
import orderLinkRoutes from './orderLinkRoutes.js';
import whatsappRoutes from './whatsappRoutes.js';
import alertRoutes from './alertRoutes.js';

const router = Router();

// Health check
router.get('/health', healthController.check);

// Rotas públicas
router.use('/products', productRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/order-link', orderLinkRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/alerts', alertRoutes);

// Rotas admin (TODO: adicionar middleware de autenticação)
router.use('/admin', adminRoutes);

export default router;
