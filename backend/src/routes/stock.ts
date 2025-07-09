import express from 'express';
import {
  updateStock,
  getStockHistory,
  getStockReport
} from '../controllers/stockController';
import { authenticate, requireStockAccess } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and stock access
router.use(authenticate);
router.use(requireStockAccess);

router.post('/update', updateStock);
router.get('/history/:productId', getStockHistory);
router.get('/report', getStockReport);

export default router;