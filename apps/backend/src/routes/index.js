import { Router } from 'express';
import { healthController } from '../controllers/healthController.js';

import productRoutes from './productRoutes.js';
import adminRoutes from './adminRoutes.js';
import checkoutRoutes from './checkoutRoutes.js';
import orderLinkRoutes from './orderLinkRoutes.js';
import whatsappRoutes from './whatsappRoutes.js';
import alertRoutes from './alertRoutes.js';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import adminNewRoutes from './admin.js';

const router = Router();

// Health check
router.get('/health', healthController.check);

// Autenticação
router.use('/auth', authRoutes);

// Rotas públicas
router.use('/products', productRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/order-link', orderLinkRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/alerts', alertRoutes);

// Rotas de usuário logado
router.use('/user', userRoutes);

// Rotas admin (novas com autenticação)
router.use('/admin', adminNewRoutes);

// Rotas admin antigas (legado)
router.use('/admin-legacy', adminRoutes);

export default router;
