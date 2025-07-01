import express from 'express';
import {
  getInventoryTransactions,
  getInventoryTransactionById,
  createInventoryTransaction,
  getInventorySummary
} from '../controllers/inventoryController';


const router = express.Router();

// All inventory routes require stock access
router.get('/transactions',requireStockAccess, getInventoryTransactions);
router.get('/transactions/:id', requireStockAccess, getInventoryTransactionById);
router.post('/transactions', requireStockAccess, createInventoryTransaction);
router.get('/summary', requireStockAccess, getInventorySummary);

export default router;