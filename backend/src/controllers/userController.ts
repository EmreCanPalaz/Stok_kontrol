import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product'; // Product modelini import ediyoruz
import { AuthRequest } from '../middleware/auth';

// Get user profile
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Favori ürün bilgilerini de getirmek için .populate() kullanıyoruz
    const user = await User.findById(req.user?.userId).select('-password').populate('favorites');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'stock_manager'].includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// ==================================================
// YENİ EKLENEN FAVORİ FONKSİYONLARI
// ==================================================

// Add a product to user's favorites
export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // DÜZELTME: ObjectId dizisinde bir elemanın varlığını kontrol etmenin doğru yolu .some() ve .equals() metodlarıdır.
    const isAlreadyFavorite = user.favorites.some(favId => favId.equals(productId));

    if (!isAlreadyFavorite) {
      user.favorites.push(productId);
      await user.save();
    }

    const populatedUser = await User.findById(userId).populate('favorites');
    res.status(200).json({ message: 'Product added to favorites', favorites: populatedUser?.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove a product from user's favorites
export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(favId => favId.toString() !== productId);
    await user.save();

    const populatedUser = await User.findById(userId).populate('favorites');
    res.status(200).json({ message: 'Product removed from favorites', favorites: populatedUser?.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
