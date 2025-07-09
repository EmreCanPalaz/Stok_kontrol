import express from 'express';
import {
  getInventoryTransactions,
  getInventoryTransactionById,
  createInventoryTransaction,
  getInventorySummary
} from '../controllers/inventoryController';
import { authenticate, requireStockAccess } from '../middleware/auth';

const router = express.Router();

// All inventory routes require stock access
router.get('/transactions', authenticate, requireStockAccess, getInventoryTransactions);
router.get('/transactions/:id', authenticate, requireStockAccess, getInventoryTransactionById);
router.post('/transactions', authenticate, requireStockAccess, createInventoryTransaction);
router.get('/summary', authenticate, requireStockAccess, getInventorySummary);

export default router;