import express from 'express';
import {
  updateStock,
  getStockHistory,
  getStockReport
} from '../controllers/stockController';
<<<<<<< HEAD

const router = express.Router();


=======
import { authenticate, requireStockAccess } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and stock access
router.use(authenticate);
>>>>>>> e0c8134 (third one commit)
router.use(requireStockAccess);

router.post('/update', updateStock);
router.get('/history/:productId', getStockHistory);
router.get('/report', getStockReport);

export default router;