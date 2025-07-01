import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryTransaction extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  previousStock: number;
  newStock: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const inventorySchema = new Schema<IInventoryTransaction>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Ürün ID gereklidir']
  },
  quantity: {
    type: Number,
    required: [true, 'Miktar gereklidir'],
    min: [1, 'Miktar en az 1 olmalıdır']
  },
  type: {
    type: String,
    required: [true, 'İşlem tipi gereklidir'],
    enum: ['in', 'out']
  },
  reason: {
    type: String,
    required: [true, 'İşlem sebebi gereklidir'],
    maxlength: [200, 'Sebep en fazla 200 karakter olabilir']
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
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
inventorySchema.index({ productId: 1, createdAt: -1 });
inventorySchema.index({ type: 1 });
inventorySchema.index({ createdAt: -1 });

export default mongoose.model<IInventoryTransaction>('InventoryTransaction', inventorySchema);