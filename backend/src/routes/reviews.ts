import express from 'express';
import { 
  getAllReviews, 
  getReviewsByProduct, 
  getReviewsByUser, 
  addReview, 
  deleteReview, 
  approveReview 
} from '../controllers/review';
import { authenticate as protect, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Tüm yorumları getir - Admin erişimi
<<<<<<< HEAD
router.get('/', protect,  getAllReviews);
=======
router.get('/', protect, requireAdmin, getAllReviews);
>>>>>>> e0c8134 (third one commit)

// Belirli bir ürüne ait yorumları getir - Herkes erişebilir
router.get('/product/:productId', getReviewsByProduct);

// Belirli bir kullanıcıya ait yorumları getir - Sadece o kullanıcı ve admin erişebilir
router.get('/user/:userId', protect, getReviewsByUser);

// Yeni yorum ekle - Giriş yapmış kullanıcılar
router.post('/', protect, addReview);

// Yorum sil - Yorumu yazan kullanıcı veya admin
router.delete('/:reviewId', protect, deleteReview);

// Yorumu onayla - Sadece admin
<<<<<<< HEAD
router.patch('/:reviewId/approve', protect,  approveReview);
=======
router.patch('/:reviewId/approve', protect, requireAdmin, approveReview);
>>>>>>> e0c8134 (third one commit)

// Debug rotası - Herkes erişebilir
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Reviews API test rotası çalışıyor!'
  });
});

export default router;