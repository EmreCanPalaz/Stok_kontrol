import express from 'express';
import {
  getInventoryTransactions,
  getInventoryTransactionById,
  createInventoryTransaction,
  getInventorySummary
} from '../controllers/inventoryController';
<<<<<<< HEAD

=======
import { authenticate, requireStockAccess } from '../middleware/auth';
>>>>>>> e0c8134 (third one commit)

const router = express.Router();

// All inventory routes require stock access
<<<<<<< HEAD
router.get('/transactions',requireStockAccess, getInventoryTransactions);
router.get('/transactions/:id', requireStockAccess, getInventoryTransactionById);
router.post('/transactions', requireStockAccess, createInventoryTransaction);
router.get('/summary', requireStockAccess, getInventorySummary);
=======
router.get('/transactions', authenticate, requireStockAccess, getInventoryTransactions);
router.get('/transactions/:id', authenticate, requireStockAccess, getInventoryTransactionById);
router.post('/transactions', authenticate, requireStockAccess, createInventoryTransaction);
router.get('/summary', authenticate, requireStockAccess, getInventorySummary);
>>>>>>> e0c8134 (third one commit)

export default router;