import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import InventoryTransaction from '../models/Inventory';


// Stok güncelleme
export const updateStock = async ( res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity, type, reason } = req.body;

    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
      return;
    }

    const previousStock = product.stock;
    let newStock: number;

    if (type === 'in') {
      newStock = previousStock + quantity;
    } else if (type === 'out') {
      if (previousStock < quantity) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: 'Yetersiz stok' });
        return;
      }
      newStock = previousStock - quantity;
    } else {
      await session.abortTransaction();
      res.status(400).json({ success: false, message: 'Geçersiz işlem tipi' });
      return;
    }

    product.stock = newStock;
    await product.save({ session });

    const transaction = new InventoryTransaction({
      productId,
      quantity,
      type,
      reason,
      previousStock,
      newStock,
      createdBy: req.user?.userId
    });
    await transaction.save({ session });

    await session.commitTransaction();
    res.json({
      success: true,
      message: 'Stok başarıyla güncellendi',
      data: {
        product: {
          id: product._id,
          title: product.title,
          previousStock,
          newStock,
          stock: newStock
        },
        transaction
      }
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Stok güncellenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  } finally {
    session.endSession();
  }
};

// Stok geçmişi getirme
export const getStockHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      InventoryTransaction.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'username')
        .populate('productId', 'title sku')
        .lean(),
      InventoryTransaction.countDocuments({ productId })
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Stok geçmişi getirilirken hata oluştu'
    });
  }
};

// Genel stok raporu
export const getStockReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage: any = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate as string);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate as string);
    }

    const report = await InventoryTransaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          totalQuantity: { $sum: '$quantity' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    const lowStockCount = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });

    const totalProducts = await Product.countDocuments({ isActive: true });

    const outOfStockCount = await Product.countDocuments({
      isActive: true,
      stock: 0
    });

    res.json({
      success: true,
      data: {
        report,
        summary: {
          totalProducts,
          lowStockCount,
          outOfStockCount,
          inStockCount: totalProducts - outOfStockCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Stok raporu oluşturulurken hata oluştu'
    });
  }
};
