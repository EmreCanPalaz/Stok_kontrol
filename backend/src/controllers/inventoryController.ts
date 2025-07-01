import { Request, Response } from 'express';
import InventoryTransaction from '../models/Inventory';
import Product from '../models/Product';
<<<<<<< HEAD

=======
import { AuthRequest } from '../middleware/auth';
>>>>>>> e0c8134 (third one commit)

// Get all inventory transactions
export const getInventoryTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, productId, type } = req.query;

    const filter: any = {};
    if (productId) filter.productId = productId;
    if (type) filter.type = type;

    const transactions = await InventoryTransaction.find(filter)
      .populate('productId', 'name sku')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await InventoryTransaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get inventory transaction by ID
export const getInventoryTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const transaction = await InventoryTransaction.findById(id)
      .populate('productId', 'name sku')
      .populate('createdBy', 'firstName lastName');

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create manual inventory transaction
<<<<<<< HEAD
export const createInventoryTransaction = async ( res: Response): Promise<void> => {
=======
export const createInventoryTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
>>>>>>> e0c8134 (third one commit)
  try {
    const { productId, type, quantity, reason, notes } = req.body;

    // Frontend'den gelen 'inbound'/'outbound' değerlerini 'in'/'out' olarak dönüştür
    const mappedType = type === 'inbound' ? 'in' : (type === 'outbound' ? 'out' : type);

    // Tip kontrolü yap - sadece 'in' veya 'out' olabilir
    if (mappedType !== 'in' && mappedType !== 'out') {
      res.status(400).json({ 
        message: 'Invalid type value', 
        validTypes: ['in', 'out'],
        receivedType: type,
        mappedType: mappedType
      });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (mappedType === 'out' && product.stock < quantity) {
      res.status(400).json({ 
        message: 'Insufficient stock', 
        available: product.stock,
        requested: quantity
      });
      return;
    }

    // Kullanıcı ID kontrolü
<<<<<<< HEAD
   
    
=======
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
>>>>>>> e0c8134 (third one commit)

    // Yeni ve önceki stok değerlerini hesapla
    const previousStock = product.stock;
    const newStock = mappedType === 'in' ? previousStock + quantity : previousStock - quantity;

    const transaction = new InventoryTransaction({
      productId,
      type: mappedType,
      quantity,
      reason,
      notes,
<<<<<<< HEAD
=======
      createdBy: req.user.userId,
>>>>>>> e0c8134 (third one commit)
      previousStock: previousStock,
      newStock: newStock
    });

    await transaction.save();

    const stockChange = mappedType === 'in' ? quantity : -quantity;
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: stockChange }
    });

    const populatedTransaction = await InventoryTransaction.findById(transaction._id)
      .populate('productId', 'name sku')
      .populate('createdBy', 'firstName lastName');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get inventory summary
export const getInventorySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    const lowStockProducts = await Product.countDocuments({ 
      stock: { $lte: 10 }, 
      isDeleted: false 
    });
    const outOfStockProducts = await Product.countDocuments({ 
      stock: 0, 
      isDeleted: false 
    });

    const products = await Product.find({ isDeleted: false });
    const totalValue = products.reduce((sum, product) => {
      return sum + (product.price * product.stock);
    }, 0);

    const recentTransactions = await InventoryTransaction.find()
      .populate('productId', 'name sku')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};