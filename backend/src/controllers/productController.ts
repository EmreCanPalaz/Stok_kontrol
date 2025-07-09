import { Request, Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Ürün listesi getirme
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (search) filter.$text = { $search: search as string };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStockOnly === 'true') {
      filter.stock = { $gt: 0 };
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'username')
        .lean(),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Ürünler getirilirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

// Tek ürün getirme
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('createdBy', 'username')
      .lean();

    if (!product) {
      res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
      return;
    }

    res.json({ success: true, data: { product } });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Ürün getirilirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

// Yeni ürün oluşturma
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Debug logları
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request files:', req.files);
    console.log('Content-Type:', req.headers['content-type']);
    
    const productData = {
      ...req.body,
      createdBy: req.user?.userId
    };

    console.log('Product data after spread:', productData);
    console.log('imageUrl in productData:', productData.imageUrl);

    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      res.status(400).json({ success: false, message: 'Bu SKU zaten kullanılıyor' });
      return;
    }

    // Görsel işleme
    if (req.file) {
      // Dosya yüklendiyse, dosya yolunu image alanına ata
      console.log('Dosya yüklendi:', req.file.filename);
      productData.image = `/uploads/products/${req.file.filename}`;
    } else if (productData.imageUrl) {
      // imageUrl gönderildiyse, image alanına kopyala
      console.log('Image URL kullanılıyor:', productData.imageUrl);
      productData.image = productData.imageUrl;
      // imageUrl alanını kaldır (model bunu tanımıyor)
      delete productData.imageUrl;
    } else {
      console.warn('Görsel verisi bulunamadı!');
    }

    // Image alanı kontrolünü güncelleyelim
    console.log('Final product data before save:', productData);
    console.log('Image field:', productData.image);

    // Image alanı yoksa hata döndür
    if (!productData.image) {
      res.status(400).json({ 
        success: false, 
        message: 'Ürün resmi gereklidir. Lütfen bir dosya yükleyin veya resim URL\'si girin.' 
      });
      return;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: { product }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Ürün oluşturulurken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

// Ürün güncelleme
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.sku) {
      const existingProduct = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } });
      if (existingProduct) {
        res.status(400).json({ success: false, message: 'Bu SKU zaten kullanılıyor' });
        return;
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!product) {
      res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
      return;
    }

    res.json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      data: { product }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

// Ürün silme (soft delete)
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!product) {
      res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
      return;
    }

    res.json({ success: true, message: 'Ürün başarıyla silindi' });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Ürün silinirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

// Düşük stoklu ürünleri getirme
export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    })
      .sort({ stock: 1 })
      .populate('createdBy', 'username')
      .lean();

    res.json({ success: true, data: { products } });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Düşük stoklu ürünler getirilirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};
