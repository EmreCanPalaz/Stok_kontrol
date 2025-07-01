// /Users/emrepalaz/Desktop/EmKaHan/Stok_kontrol/frontend/src/components/Products/ProductDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ProductProps, Review } from '../../types/product';

import { format } from 'date-fns';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { 
    products, 
    addToCart, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    translate,
   
  } = useAppContext();
 
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  // Yorum ve puanlama için state'ler
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [newReviewRating, setNewReviewRating] = useState<number>(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (products && products.length > 0 && productId) {
      const foundProduct = products.find(p => p._id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Ürün yorumlarını ve ortalama puanı al
       
        
        
      } else {
        // Ürün bulunamadı, ana sayfaya yönlendir
        navigate('/products');
      }
    }
    setLoading(false);
  }, [productId, products, navigate, ]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite(product._id)) {
        removeFromFavorites(product._id);
      } else {
        addToFavorites(product);
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || 'Ürün Detayı',
          text: product?.description || 'Ürün detaylarını görüntüleyin',
          url: url
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (error) {
        console.error('Paylaşım hatası:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };
  
  // Yorum gönderme işlemi
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    
    
    if (!productId) {
      setReviewError('Ürün bilgisi eksik.');
      return;
    }
    if (newReviewRating <= 0 || newReviewRating > 5) {
      setReviewError('Lütfen 1 ile 5 arasında bir puan seçin.');
      return;
    }
    if (newReviewComment.trim().length < 3) {
      setReviewError('Lütfen en az 3 karakter içeren bir yorum yazın.');
      return;
    }

    const newReview: Review = {
      _id: Date.now().toString(), // Geçici ID, backend tarafında değiştirilecek
      productId,
      
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString(),
     
    };


  
  
  };
  
  // Yorum onaylama işlemi (sadece admin için)
  
  
  
  // Yıldız puanlama gösterimi

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!product) {
    return <div className="error">Ürün bulunamadı.</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <Link to="/products" className="back-button">
          <i className="bi bi-arrow-left"></i> {translate('back_to_products')}
        </Link>
        <div className="product-actions">
          <button onClick={handleShare} className="share-button">
            <i className="bi bi-share"></i> {translate('share')}
          </button>
          {shareSuccess && <span className="success-message">{translate('shared_successfully')}</span>}
          {copySuccess && <span className="success-message">{translate('link_copied')}</span>}
        </div>
      </div>

      <div className="product-detail-content">
        <div className="product-image-section">
          <img src={product.image} alt={product.title} className="product-image" />
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>
          
          {/* Ortalama puan gösterimi */}
          
          
          <p className="product-price">{product.price.toFixed(2)} TL</p>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-meta">
            <span className="product-category">
              <strong>Kategori:</strong> {product.category || 'Belirtilmemiş'}
            </span>
            <span className="product-stock">
              <strong>Stok Durumu:</strong> {product.stock > 0 ? `${product.stock} adet` : 'Stokta Yok'}
            </span>
          </div>
          
          <div className="product-buttons">
            <button 
              onClick={handleAddToCart} 
              className="add-to-cart-button"
              disabled={product.stock <= 0}
            >
              <i className="bi bi-cart-plus"></i> {translate('add_to_cart')}
            </button>
            
            <button 
              onClick={handleToggleFavorite} 
              className={`favorite-button ${isFavorite(product._id) ? 'active' : ''}`}
            >
              <i className={`bi bi-heart${isFavorite(product._id) ? '-fill' : ''}`}></i>
              {isFavorite(product._id) ? translate('remove_from_favorites') : translate('add_to_favorites')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Yorum ve Puanlama Bölümü */}
      <div className="product-reviews-section">
        <h2 className="section-title">Yorumlar ve Değerlendirmeler</h2>
        
        {/* Yeni yorum ekleme formu */}
        
        
        {/* Mevcut yorumlar listesi */}
        <div className="reviews-list">
          <h3>Tüm Yorumlar ({productReviews.length})</h3>
          
          {productReviews.length > 0 ? (
            productReviews.map(review => (
              <div key={review._id} className={`review-item ${!review.isApproved ? 'pending' : ''}`}>
                <div className="review-header">
                  <span className="username">{review.username}</span>
                  <span className="date">{format(new Date(review.date), 'dd.MM.yyyy')}</span>
                </div>
                
                <div className="stars">
                  
                </div>
                
                <p className="comment">{review.comment}</p>
                
                
              </div>
            ))
          ) : (
            <p className="no-reviews">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;