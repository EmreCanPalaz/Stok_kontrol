// /Users/emrepalaz/Desktop/EmKaHan/Stok_kontrol/backend/src/controllers/feedbackController.ts
import { Response } from 'express';
import Feedback from '../models/Feedback';
import { AuthRequest } from '../middleware/auth';

export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { rating, comment } = req.body;

    const feedback = new Feedback({
      user: userId,
      rating,
      comment
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Geri bildirim başarıyla gönderildi',
      data: {
        feedback: {
          id: feedback._id,
          rating: feedback.rating,
          comment: feedback.comment,
          createdAt: feedback.createdAt
        }
      }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

export const getFeedbacks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const isAdmin = req.user?.isAdmin;

    // Sadece admin tüm geri bildirimleri görebilir
    const query = isAdmin ? {} : { user: userId };

    const feedbacks = await Feedback.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        feedbacks
      }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};