import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
//import './AdminReviews.css';
import { Review, ProductProps } from '../../types/product';
import { format } from 'date-fns';

const AdminReviews: React.FC = () => {
  const { reviews, products, deleteReview, approveReview, getReviewsByProduct, getReviewsByUser } = useAppContext();
  const [filterProduct, setFilterProduct] = useState<string | ''>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  const filteredReviews = useMemo(() => {
    let tempReviews = [...reviews];

    if (filterProduct) {
      tempReviews = tempReviews.filter(review => review.productId === filterProduct);
    }

    if (filterStatus !== 'all') {
      tempReviews = tempReviews.filter(review =>
        filterStatus === 'approved' ? review.isApproved : !review.isApproved
      );
    }

    tempReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return tempReviews;
  }, [reviews, filterProduct, filterStatus]);

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

  const getProductTitle = (productId: string): string => {
    const product = products.find(p => p._id === productId);
    return product ? product.title : 'Bilinmeyen Ürün';
  };

  return (
    <div className="admin-reviews">
      <h2>Yorum Yönetimi</h2>

      <div className="filters mb-3">
        <div className="form-group me-2">
          <label>Ürün:</label>
          <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="form-control">
            <option value="">Tüm Ürünler</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group me-2">
          <label>Durum:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | 'approved' | 'pending')} className="form-control">
            <option value="all">Tümü</option>
            <option value="approved">Onaylanmış</option>
            <option value="pending">Onay Bekleyenler</option>
          </select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="alert alert-info">Gösterilecek yorum bulunamadı.</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Kullanıcı</th>
              <th>Puan</th>
              <th>Yorum</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(review => (
              <tr key={review._id}>
                <td>{getProductTitle(review.productId)}</td>
                <td>{review.username}</td>
                <td>{review.rating}/5</td>
                <td>{review.comment}</td>
                <td>{format(new Date(review.date), 'dd.MM.yyyy HH:mm')}</td>
                <td>{review.isApproved ? 'Onaylandı' : 'Beklemede'}</td>
                <td>
                  {!review.isApproved && (
                    <button onClick={() => handleApproveReview(review._id)} className="btn btn-success btn-sm me-2">Onayla</button>
                  )}
                  <button onClick={() => handleDeleteReview(review._id)} className="btn btn-danger btn-sm">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviews;
