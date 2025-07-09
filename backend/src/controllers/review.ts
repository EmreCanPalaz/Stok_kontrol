import { Request, Response } from 'express';
import Review, { ReviewDocument } from '../models/Review';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';

// Tüm yorumları getir
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Yorumlar alınırken bir hata oluştu'
    });
  }
};

// Belirli bir ürüne ait yorumları getir
export const getReviewsByProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        error: 'Geçersiz ürün ID'
      });
    }
    
    const reviews = await Review.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ürün yorumları alınırken bir hata oluştu'
    });
  }
};

// Belirli bir kullanıcıya ait yorumları getir
export const getReviewsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        error: 'Geçersiz kullanıcı ID'
      });
    }
    
    const reviews = await Review.find({ userId });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Kullanıcı yorumları alınırken bir hata oluştu'
    });
  }
};

// Yeni yorum ekle
export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.userId;
    
    // Kullanıcı bilgisini veritabanından al
    const User = mongoose.model('User');
    const userInfo = await User.findById(userId);
    const username = userInfo?.username || userInfo?.email.split('@')[0] || 'Anonim';
    
    if (!productId || !rating || !comment) {
      res.status(400).json({
        success: false,
        error: 'Ürün ID, puan ve yorum alanları zorunludur'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        error: 'Geçersiz ürün ID'
      });
    }
    
    // Admin kullanıcılar için otomatik onay
    const isApproved = req.user?.isAdmin === true;
    
    const newReview = new Review({
      productId,
      userId,
      username,
      rating,
      comment,
      isApproved
    });
    
    await newReview.save();
    
    res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Yorum eklenirken bir hata oluştu'
    });
  }
};

// Yorum sil
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({
        success: false,
        error: 'Geçersiz yorum ID'
      });
      return;
    }
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      res.status(404).json({
        success: false,
        error: 'Yorum bulunamadı'
      });
      return;
    }
    
    // Sadece admin veya yorumu yazan kullanıcı silebilir
    if (!req.user?.isAdmin && review.userId.toString() !== req.user?.userId?.toString()) {
      res.status(403).json({
        success: false,
        error: 'Bu işlem için yetkiniz yok'
      });
      return;
    }
    
    await Review.findByIdAndDelete(reviewId);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Yorum silinirken bir hata oluştu'
    });
  }
};

// Yorumu onayla (sadece admin)
export const approveReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    
    if (!req.user?.isAdmin) {
      res.status(403).json({
        success: false,
        error: 'Bu işlem için admin yetkisi gereklidir'
      });
      return;
    }
    
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({
        success: false,
        error: 'Geçersiz yorum ID'
      });
      return;
    }
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      res.status(404).json({
        success: false,
        error: 'Yorum bulunamadı'
      });
      return;
    }
    
    review.isApproved = true;
    await review.save();
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Yorum onaylanırken bir hata oluştu'
    });
  }
};