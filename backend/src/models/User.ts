import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
<<<<<<< HEAD
  
  
  hasStockControlAccess: boolean;
  isActive: boolean;
 
=======
  username: string;
  email: string;
  password: string;
  firstName: string; 
  lastName: string;  
  phone: string;    
  address: string;   
  isAdmin: boolean;
  hasStockControlAccess: boolean;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  favorites: mongoose.Types.ObjectId[];
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
>>>>>>> e0c8134 (third one commit)
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
<<<<<<< HEAD
  
=======
  username: {
    type: String,
    required: [true, 'Kullanıcı adı gereklidir'],
    unique: true,
    trim: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
    maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olabilir']
  },
  email: {
    type: String,
    required: [true, 'Email gereklidir'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
>>>>>>> e0c8134 (third one commit)
  hasStockControlAccess: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
<<<<<<< HEAD
  

  timestamps: true
});




export default mongoose.model<IUser>( userSchema);
=======
  lastLogin: {
    type: Date
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
>>>>>>> e0c8134 (third one commit)
