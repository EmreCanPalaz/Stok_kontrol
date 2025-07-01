import mongoose, { Document, Schema } from 'mongoose';

export interface ReviewDocument extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  rating: number;
  comment: string;
  date: Date;
  isApproved: boolean;
}

const ReviewSchema = new Schema<ReviewDocument>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model<ReviewDocument>('Review', ReviewSchema);