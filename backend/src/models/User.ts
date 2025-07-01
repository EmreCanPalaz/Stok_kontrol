import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  
  
  hasStockControlAccess: boolean;
  isActive: boolean;
 
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  
  hasStockControlAccess: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  

  timestamps: true
});




export default mongoose.model<IUser>( userSchema);