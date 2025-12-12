import { Router } from 'express';
import { 
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsCSV,
  getAllOrders,
  updateOrderStatus,
  getStats,
  getPendingReviews,
  moderateReview,
  getAllUsers,
  getShippingConfig,
  saveShippingConfig
} from '../controllers/adminController.js';
import { imageController } from '../controllers/imageController.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';
import { handleProductUpload, handleSingleUpload } from '../middlewares/upload.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

// Todas as rotas requerem autenticação de admin
router.use(authenticate, authorizeAdmin);

// Dashboard
router.get('/stats', getStats);

// Produtos
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/export/csv', exportProductsCSV);

// Upload de imagens de produtos
router.post('/products/:id/images', handleProductUpload, asyncHandler(imageController.uploadProductImages));
router.delete('/products/:id/images', asyncHandler(imageController.deleteProductImage));
router.put('/products/:id/images/reorder', asyncHandler(imageController.reorderProductImages));

// Upload genérico (retorna só a URL)
router.post('/upload', handleSingleUpload, asyncHandler(imageController.uploadSingle));

// Pedidos
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Avaliações
router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:id/moderate', moderateReview);

// Usuários
router.get('/users', getAllUsers);

// Frete
router.get('/shipping-config', getShippingConfig);
router.post('/shipping-config', saveShippingConfig);

export default router;
