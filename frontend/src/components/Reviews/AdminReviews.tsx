import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './AdminReviews.css';

const AdminReviews: React.FC = () => {
  const { reviews, products, deleteReview, approveReview } = useAppContext();
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [filterProductId, setFilterProductId] = useState<number | null>(null);
  
  useEffect(() => {
    // Filtrele
    let result = [...reviews];
    
    // Durum filtresi
    if (filterStatus === 'pending') {
      result = result.filter(review => !review.isApproved);
    } else if (filterStatus === 'approved') {
      result = result.filter(review => review.isApproved);
    }
    
    // Ürün filtresi
    if (filterProductId !== null) {
      result = result.filter(review => review.productId === filterProductId);
    }
    
    // Tarihe göre sırala (en yeniler önce)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredReviews(result);
  }, [reviews, filterStatus, filterProductId]);
  
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getProductTitle = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.title : 'Bilinmeyen Ürün';
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i}
          className={`star ${i <= rating ? 'filled' : 'empty'}`}
        >
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };
  
  return (
    <div className="admin-reviews-container">
      <h2 className="mb-4">Yorum Yönetimi</h2>
      
      <div className="filters-container mb-4">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="statusFilter" className="form-label">Durum Filtresi</label>
              <select 
                id="statusFilter" 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">Tüm Yorumlar</option>
                <option value="pending">Onay Bekleyenler</option>
                <option value="approved">Onaylananlar</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="productFilter" className="form-label">Ürün Filtresi</label>
              <select 
                id="productFilter" 
                className="form-select"
                value={filterProductId || ''}
                onChange={(e) => setFilterProductId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Tüm Ürünler</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {filteredReviews.length === 0 ? (
        <div className="alert alert-info">Belirtilen kriterlere uygun yorum bulunamadı.</div>
      ) : (
        <div className="reviews-list">
          {filteredReviews.map(review => (
            <div 
              key={review.id} 
              className={`review-item ${!review.isApproved ? 'pending' : 'approved'}`}
            >
              <div className="review-meta">
                <div className="product-info">
                  <strong>Ürün:</strong> {getProductTitle(review.productId)}
                </div>
                <div className="user-date-info">
                  <div className="review-user">
                    <i className="bi bi-person-circle"></i> {review.username}
                  </div>
                  <div className="review-date">
                    {formatDate(review.date)}
                  </div>
                </div>
              </div>
              
              <div className="review-content">
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                <div className="review-comment">
                  {review.comment}
                </div>
              </div>
              
              <div className="review-status">
                {review.isApproved ? (
                  <span className="status-badge approved">
                    <i className="bi bi-check-circle"></i> Onaylandı
                  </span>
                ) : (
                  <span className="status-badge pending">
                    <i className="bi bi-hourglass"></i> Onay Bekliyor
                  </span>
                )}
              </div>
              
              <div className="review-actions">
                {!review.isApproved && (
                  <button 
                    className="btn btn-sm btn-success me-2" 
                    onClick={() => handleApproveReview(review.id)}
                  >
                    <i className="bi bi-check"></i> Onayla
                  </button>
                )}
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDeleteReview(review.id)}
                >
                  <i className="bi bi-trash"></i> Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
