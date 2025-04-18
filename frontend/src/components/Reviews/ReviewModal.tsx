import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './ReviewModal.css';

interface ReviewModalProps {
  show: boolean;
  onClose: () => void;
  productId: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ show, onClose, productId }) => {
  const { 
    user, 
    products, 
    addReview, 
    getReviewsByProduct, 
    deleteReview, 
    approveReview,
    getAverageRating 
  } = useAppContext();
  
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [reviewTab, setReviewTab] = useState<'read' | 'write'>('read');
  
  useEffect(() => {
    if (productId) {
      const productData = products.find(p => p.id === productId);
      setProduct(productData || null);
      
      const productReviews = getReviewsByProduct(productId);
      setReviews(productReviews);
      
      const avgRating = getAverageRating(productId);
      setAverageRating(avgRating);
    }
  }, [productId, products, getReviewsByProduct, getAverageRating]);
  
  // Modal gösterildiğinde veya gizlendiğinde çalışır
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      // Modal kapandığında formu sıfırla
      setRating(5);
      setComment('');
      setReviewTab('read');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [show]);
  
  // Yorumlar güncellendiğinde yeniden listele
  useEffect(() => {
    if (productId) {
      const productReviews = getReviewsByProduct(productId);
      setReviews(productReviews);
      
      const avgRating = getAverageRating(productId);
      setAverageRating(avgRating);
    }
  }, [productId, getReviewsByProduct, getAverageRating]);
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Yorum yapabilmek için giriş yapmalısınız.');
      return;
    }
    
    if (!comment.trim()) {
      alert('Lütfen bir yorum yazınız.');
      return;
    }
    
    addReview({
      productId,
      userId: user.email,
      username: user.username,
      rating,
      comment: comment.trim()
    });
    
    // Formu sıfırla ve okuma sekmesine geç
    setRating(5);
    setComment('');
    setReviewTab('read');
  };
  
  const handleDeleteReview = (reviewId: number) => {
    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      deleteReview(reviewId);
    }
  };
  
  const handleApproveReview = (reviewId: number) => {
    approveReview(reviewId);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Kullanıcının admin olup olmadığını kontrol eden yardımcı fonksiyon
  const isAdmin = () => {
    return user?.isAdmin === true;
  };
  
  // Kullanıcının kendi yorumunu silme yetkisi var mı kontrol eden yardımcı fonksiyon
  const canDeleteReview = (review: any) => {
    return isAdmin() || (user && review.userId === user.email);
  };
  
  // Stars gösterimi için yardımcı fonksiyon
  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i}
          className={`star ${i <= (hoveredRating || rating) ? 'filled' : 'empty'}`}
          onClick={() => interactive && setRating(i)}
          onMouseEnter={() => interactive && setHoveredRating(i)}
          onMouseLeave={() => interactive && setHoveredRating(null)}
        >
          {i <= (hoveredRating || rating) ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };
  
  if (!show) return null;
  
  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>
            {product?.title} {' '}
            <span className="product-rating">
              {averageRating > 0 ? (
                <>
                  {renderStars(Math.round(averageRating))}
                  <span className="rating-text">({averageRating.toFixed(1)})</span>
                </>
              ) : (
                <span className="no-rating">Henüz değerlendirilmemiş</span>
              )}
            </span>
          </h3>
          <button className="close-button" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="review-modal-tabs">
          <button 
            className={`tab-button ${reviewTab === 'read' ? 'active' : ''}`}
            onClick={() => setReviewTab('read')}
          >
            Yorumları Oku
          </button>
          <button 
            className={`tab-button ${reviewTab === 'write' ? 'active' : ''}`}
            onClick={() => setReviewTab('write')}
          >
            Yorum Yap
          </button>
        </div>
        
        <div className="review-modal-body">
          {reviewTab === 'read' ? (
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <div className="no-reviews">
                  <p>Bu ürün için henüz yorum yapılmamış.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setReviewTab('write')}
                  >
                    İlk Yorumu Sen Yap
                  </button>
                </div>
              ) : (
                <div className="reviews-container">
                  {reviews.map(review => (
                    <div 
                      key={review.id} 
                      className={`review-item ${!review.isApproved ? 'pending-approval' : ''}`}
                    >
                      {!review.isApproved && (
                        <div className="approval-badge">
                          <i className="bi bi-hourglass"></i> Onay Bekliyor
                        </div>
                      )}
                      <div className="review-header">
                        <div className="review-user">
                          <i className="bi bi-person-circle"></i> {review.username}
                        </div>
                        <div className="review-date">
                          {formatDate(review.date)}
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <div className="review-comment">
                        {review.comment}
                      </div>
                      <div className="review-actions">
                        {isAdmin() && !review.isApproved && (
                          <button 
                            className="btn btn-sm btn-success me-2" 
                            onClick={() => handleApproveReview(review.id)}
                          >
                            <i className="bi bi-check"></i> Onayla
                          </button>
                        )}
                        {canDeleteReview(review) && (
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <i className="bi bi-trash"></i> Sil
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="review-form-container">
              {!user ? (
                <div className="login-required">
                  <p>Yorum yapabilmek için giriş yapmalısınız.</p>
                  <button className="btn btn-primary">Giriş Yap</button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="review-form">
                  <div className="form-group mb-3">
                    <label>Puanınız:</label>
                    <div className="rating-stars">
                      {renderStars(rating, true)}
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="comment">Yorumunuz:</label>
                    <textarea 
                      id="comment"
                      className="form-control" 
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      rows={5}
                      required
                    ></textarea>
                  </div>
                  <div className="form-submit">
                    <button type="submit" className="btn btn-primary">
                      Yorumu Gönder
                    </button>
                  </div>
                  <div className="form-note mt-3">
                    <small className="text-muted">
                      * Yorumunuz sistem yöneticileri tarafından onaylandıktan sonra yayınlanacaktır.
                    </small>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
