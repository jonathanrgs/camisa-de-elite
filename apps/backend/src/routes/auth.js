import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword,
  createAdmin 
} from '../controllers/authController.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';

const router = Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas (requer autenticação)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

// Rotas de admin
router.post('/admin', authenticate, authorizeAdmin, createAdmin);

export default router;
