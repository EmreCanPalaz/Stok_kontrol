import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  barcode?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true,
    maxlength: [200, 'Ürün adı en fazla 200 karakter olabilir']
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması gereklidir'],
    maxlength: [1000, 'Açıklama en fazla 1000 karakter olabilir']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat gereklidir'],
    min: [0, 'Fiyat negatif olamaz']
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: ['Giyim', 'Elektronik', 'Aksesuar', 'Ev & Yaşam', 'Kozmetik']
  },
  image: {
    type: String,
    required: [true, 'Ürün resmi gereklidir']
  },
  stock: {
    type: Number,
    required: [true, 'Stok miktarı gereklidir'],
    min: [0, 'Stok negatif olamaz'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Düşük stok eşiği negatif olamaz']
  },
  sku: {
    type: String,
    required: [true, 'SKU gereklidir'],
    unique: true,
    uppercase: true
  },
  barcode: {
    type: String,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index'ler
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ stock: 1 });
//productSchema.index({ sku: 1 });

export default mongoose.model<IProduct>('Product', productSchema);