import { Router } from 'express';
import { 
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductPermanent,
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
import { sizeController } from '../controllers/sizeController.js';
import { categoryController } from '../controllers/categoryController.js';
import { productTypeController } from '../controllers/productTypeController.js';
import { imageController } from '../controllers/imageController.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';
import { handleProductUpload, handleSingleUpload } from '../middlewares/upload.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();


// Rotas públicas (sem autenticação)
router.get('/shipping-config', getShippingConfig);

// Todas as demais rotas requerem autenticação de admin
router.use(authenticate, authorizeAdmin);

// Dashboard
router.get('/stats', getStats);

// Produtos
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProductPermanent);
router.get('/products/export/csv', exportProductsCSV);

// Grupos de Tamanho (ADMIN)
router.get('/size-groups', asyncHandler(sizeController.listAll));
router.post('/size-groups', asyncHandler(sizeController.createGroup));
router.put('/size-groups/:id', asyncHandler(sizeController.updateGroup));
router.delete('/size-groups/:id', asyncHandler(sizeController.deleteGroup));
router.post('/size-groups/:id/sizes', asyncHandler(sizeController.createSize));
router.put('/size-groups/:id/sizes/reorder', asyncHandler(sizeController.reorderSizes));
router.put('/sizes/:id', asyncHandler(sizeController.updateSize));
router.delete('/sizes/:id', asyncHandler(sizeController.deleteSize));

// Categorias (ADMIN)
router.get('/categories', asyncHandler(categoryController.listAll));
router.post('/categories', asyncHandler(categoryController.create));
router.put('/categories/:id', asyncHandler(categoryController.update));
router.delete('/categories/:id', asyncHandler(categoryController.delete));

// Tipos de Produto (ADMIN)
router.get('/product-types', asyncHandler(productTypeController.listAll));
router.post('/product-types', asyncHandler(productTypeController.create));
router.put('/product-types/:id', asyncHandler(productTypeController.update));
router.delete('/product-types/:id', asyncHandler(productTypeController.delete));

// Upload de imagens de produtos
router.post('/products/:id/images', handleProductUpload, asyncHandler(imageController.uploadProductImages));
router.delete('/products/:id/images', asyncHandler(imageController.deleteProductImage));
router.put('/products/:id/images/reorder', asyncHandler(imageController.reorderProductImages));


// Listar todas as mídias enviadas
router.get('/media', asyncHandler(imageController.listAllMedia));
// Deletar uma ou mais mídias
router.delete('/media', asyncHandler(imageController.deleteMedia));
// Renomear uma mídia
router.put('/media/rename', asyncHandler(imageController.renameMedia));

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
