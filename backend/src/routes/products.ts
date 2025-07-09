import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} from '../controllers/productController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateRequest, productSchema } from '../middleware/validation';
import { upload } from '../config/multer';

const router = express.Router();


// Public routes
router.get('/low-stock', getLowStockProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);



// Protected routes (Admin only)
router.post('/', 
  authenticate, 
  requireAdmin, 
  upload.single('image'),
  validateRequest(productSchema), 
  createProduct
);
router.put('/:id', 
  authenticate, 
  requireAdmin, 
  upload.single('image'),
  validateRequest(productSchema),
  updateProduct
);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;