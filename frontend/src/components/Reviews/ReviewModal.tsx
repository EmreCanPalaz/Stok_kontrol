import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
//import './ReviewModal.css';
import { Review, ProductProps } from '../../types/product';
import { format } from 'date-fns';

interface ReviewModalProps {
  productId: string;
  productTitle?: string;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ productId, productTitle, onClose }) => {
  const { user, products, reviews, addReview, deleteReview, approveReview, getReviewsByProduct, getAverageRating } = useAppContext();

  const [product, setProduct] = useState<ProductProps | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  const [newReviewRating, setNewReviewRating] = useState<number>(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (productId) {
      const productData = products.find(p => p._id === productId);
      setProduct(productData || null);

      const reviewsForProduct = getReviewsByProduct(productId);
      setProductReviews(reviewsForProduct);

      const avgRating = getAverageRating(productId);
      setAverageRating(avgRating);
    }
  }, [productId, products, getReviewsByProduct, getAverageRating]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    if (!user) {
        alert('Yorum yapmak için giriş yapmalısınız.');
        return;
    }
     if (!productId) {
         setReviewError('Ürün bilgisi eksik.');
         return;
     }
    if (newReviewRating <= 0 || newReviewRating > 5) {
      setReviewError('Lütfen 1 ile 5 arasında bir puan seçin.');
      return;
    }
    if (newReviewComment.trim() === '') {
      setReviewError('Lütfen yorumunuzu yazın.');
      return;
    }

    const reviewData = {
      productId: productId,
      rating: newReviewRating,
      comment: newReviewComment,
    };

    try {
        await addReview(reviewData);
        setNewReviewRating(0);
        setNewReviewComment('');
        alert('Yorumunuz gönderildi ve onay bekliyor!');

    } catch (error) {
        console.error('Yorum gönderme hatası:', error);
        setReviewError('Yorum gönderilirken bir hata oluştu.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      try {
        await deleteReview(reviewId);
        alert('Yorum başarıyla silindi!');
      } catch (error) {
        console.error('Yorum silme hatası:', error);
        alert('Yorum silinirken bir hata oluştu.');
      }
    }
  };

  const handleApproveReview = async (reviewId: string) => {
     try {
        await approveReview(reviewId);
        alert('Yorum başarıyla onaylandı!');
     } catch (error) {
        console.error('Yorum onaylama hatası:', error);
        alert('Yorum onaylanırken bir hata oluştu.');
     }
  };

  const isAdmin = (): boolean => {
      return user !== null && user.role === 'admin';
  };

  const canDeleteReview = (review: Review): boolean => {
      return user !== null && review.userId === user._id;
  };

  if (!product) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <div className="modal-header">
          <h5>"{productTitle || product.title}" Ürünü Yorumları</h5>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="average-rating-section mb-3">
             {averageRating > 0 ? (
                 <p>Ortalama Puan: {averageRating.toFixed(1)} / 5</p>
             ) : (
                 <p>Bu ürün için henüz yorum yapılmamış.</p>
             )}
          </div>

          {user ? (
               <div className="new-review-form mb-4">
                   <h6>Yeni Yorum Yap</h6>
                   <form onSubmit={handleSubmitReview}>
                       <div className="form-group">
                           <label>Puanınız (1-5):</label>
                           <input
                               type="number"
                               value={newReviewRating}
                               onChange={e => setNewReviewRating(parseInt(e.target.value))}
                               min="1"
                               max="5"
                               required
                               className="form-control"
                           />
                       </div>
                       <div className="form-group">
                           <label>Yorumunuz:</label>
                           <textarea
                               value={newReviewComment}
                               onChange={e => setNewReviewComment(e.target.value)}
                               required
                               className="form-control"
                           ></textarea>
                       </div>
                       {reviewError && <div className="text-danger">{reviewError}</div>}
                       <button type="submit" className="btn btn-primary mt-2">Yorumu Gönder</button>
                   </form>
               </div>
           ) : (
             <div className="alert alert-info mb-4">Yorum yapmak için lütfen giriş yapın.</div>
           )}

          <h6>Tüm Yorumlar</h6>
          {productReviews.length === 0 ? (
              <p>Henüz bu ürün için yorum bulunmamaktadır.</p>
          ) : (
              <ul className="review-list">
                {productReviews.map(review => (
                  <li key={review._id} className={`review-item ${review.isApproved ? '' : 'review-pending'}`}>
                     <div className="review-header">
                         <strong>{review.username}</strong>
                         <span>Puan: {review.rating}/5</span>
                          <span className="review-date">{format(new Date(review.date), 'dd.MM.yyyy HH:mm')}</span>
                     </div>
                     <p>{review.comment}</p>
                      <div className="review-actions">
                          {!review.isApproved && (
                              <span className="badge bg-warning me-2">Onay Bekliyor</span>
                          )}
                           {isAdmin() || canDeleteReview(review) && (
                               <>
                                   {!review.isApproved && isAdmin() && (
                                       <button onClick={() => handleApproveReview(review._id)} className="btn btn-success btn-sm me-2">Onayla</button>
                                   )}
                                    <button onClick={() => handleDeleteReview(review._id)} className="btn btn-danger btn-sm">Sil</button>
                               </>
                           )}
                      </div>
                  </li>
                ))}
              </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
