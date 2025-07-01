import express from 'express';
import {
  updateStock,
  getStockHistory,
  getStockReport
} from '../controllers/stockController';

const router = express.Router();


router.use(requireStockAccess);

router.post('/update', updateStock);
router.get('/history/:productId', getStockHistory);
router.get('/report', getStockReport);

export default router;