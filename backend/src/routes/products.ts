import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} from '../controllers/productController';

import { validateRequest, productSchema } from '../middleware/validation';
import { upload } from '../config/multer';

const router = express.Router();


// Public routes
router.get('/low-stock', getLowStockProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);




export default router;