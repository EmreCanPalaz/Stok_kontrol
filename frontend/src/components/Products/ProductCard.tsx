import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './ProductCard.css';
import ReviewModal from '../Reviews/ReviewModal';

export interface ProductProps {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image: string;
  stock: number;
}

interface ProductCardProps extends Omit<ProductProps, 'rating'> {
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id, title, price, description, category, image, stock, onAddToCart
}) => {
  const { getStockStatus, getAverageRating, addToFavorites, removeFromFavorites, isFavorite } = useAppContext();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTooltip, setShareTooltip] = useState('Ürün linkini paylaş');

  // Check if product is in favorites
  const productIsFavorite = isFavorite(id);

  // Ortalama puanı al
  const averageRating = getAverageRating(id);

  // Generate product URL
  const productUrl = `${window.location.origin}/product/${id}`;

  // Stok durumuna göre rozet rengini belirle
  const getStockBadge = () => {
    if (stock <= 0) {
      return <span className="badge bg-danger">Stokta Yok</span>;
    } else if (stock < 10) {
      return <span className="badge bg-warning text-dark">Stok Azalıyor: {stock}</span>;
    } else {
      return <span className="badge bg-success">Stokta: {stock}</span>;
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    // Stok kontrolü
    if (stock <= 0) {
      alert('Bu ürün stokta bulunmamaktadır!');
      return;
    }

    onAddToCart();
    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.textContent || 'Sepete Ekle';
    button.innerHTML = '<i class="bi bi-check"></i> Eklendi!';
    button.disabled = true;
    setTimeout(() => {
      button.innerHTML = `<i class="bi bi-cart-plus"></i> ${originalText.includes('Sepete Ekle') ? 'Sepete Ekle' : originalText}`;
      button.disabled = false;
    }, 1500);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    // Detayları görüntüle - şimdilik bir şey yapmıyoruz
  };

  const toggleReviewModal = () => {
    setShowReviewModal(!showReviewModal);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    const product = { id, title, price, description, category, image, stock };

    if (productIsFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(product);
    }
  };

  const handleShareProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    // Copy to clipboard
    navigator.clipboard.writeText(productUrl).then(() => {
      // Show success message
      setShareTooltip('Link kopyalandı!');

      // Reset tooltip after 2 seconds
      setTimeout(() => {
        setShareTooltip('Ürün linkini paylaş');
        setShowShareModal(false);
      }, 2000);
    }).catch(err => {
      console.error('Clipboard write failed:', err);
      alert('Link kopyalanamadı. Lütfen tekrar deneyin.');
    });
  };

  const shareViaWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${productUrl}`)}`, '_blank');
    setShowShareModal(false);
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
    setShowShareModal(false);
  };

  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}`)}&url=${encodeURIComponent(productUrl)}`, '_blank');
    setShowShareModal(false);
  };

  const shareViaEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(`Ürün Önerisi: ${title}`)}&body=${encodeURIComponent(`Bu ürüne göz atmanı öneririm: ${title}\n\n${productUrl}`)}`, '_blank');
    setShowShareModal(false);
  };

  // Yıldız gösterimi için yardımcı fonksiyon
  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning"></i>);
      }
    }

    return <div className="product-stars">{stars}</div>;
  };

  return (
    <>
      <div className="card product-card h-100">
        <div className="product-image-container">
          <img src={image} className="card-img-top product-image" alt={title} />

          {/* Favorite button in the corner of the image */}
          <button
            className={`favorite-button ${productIsFavorite ? 'favorited' : ''}`}
            onClick={handleFavoriteToggle}
            title={productIsFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          >
            <i className={`bi ${productIsFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
        </div>
        <div className="card-body d-flex flex-column">
          <div className="category-badge mb-2">
            {category ? (
              <span className="badge bg-secondary">{category}</span>
            ) : (
              <span className="badge bg-secondary">Kategori belirtilmemiş</span>
            )}
            {/* Stok durum rozetini ekliyoruz */}
            <div className="mt-1">
              {getStockBadge()}
            </div>
          </div>
          <h5 className="card-title product-title">{title}</h5>

          {/* Puanlama bilgisi */}
          <div className="product-rating mb-2">
            {averageRating > 0 ? (
              <>
                {renderStars(averageRating)}
                <span className="rating-text">({averageRating.toFixed(1)})</span>
              </>
            ) : (
              <span className="no-rating">Henüz puanlanmamış</span>
            )}
          </div>

          <p className="card-text product-description">
            {description ? `${description.substring(0, 100)}...` : 'Ürün açıklaması bulunmuyor.'}
          </p>

          <div className="d-flex justify-content-between align-items-center mt-auto">
            <h5 className="product-price mb-0">${price.toFixed(2)}</h5>
            <div>
              {/* Yorumlar butonu */}
              <button
                className="btn btn-sm btn-outline-info me-1"
                onClick={toggleReviewModal}
                title="Yorumları görüntüle ve puan ver"
              >
                <i className="bi bi-chat-left-text"></i>
              </button>

              {/* Share button */}
              <button
                className="btn btn-sm btn-outline-success me-1"
                onClick={handleShareProduct}
                title={shareTooltip}
              >
                <i className="bi bi-share"></i>
              </button>

              <button
                className="btn btn-sm btn-outline-secondary me-1"
                onClick={handleViewDetails}
                title="Ürün detaylarını görüntüle"
              >
                <i className="bi bi-eye"></i>
              </button>

              <button
                className="btn btn-sm btn-primary"
                onClick={handleAddToCart}
                title="Sepete ekle"
                disabled={stock <= 0}
              >
                <i className="bi bi-cart-plus"></i> Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Yorum ve Puanlama Modal */}
      <ReviewModal
        show={showReviewModal}
        onClose={toggleReviewModal}
        productId={id}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-content" onClick={e => e.stopPropagation()}>
            <div className="share-modal-header">
              <h5>Ürün Linkini Paylaş</h5>
              <button type="button" className="btn-close" onClick={() => setShowShareModal(false)}></button>
            </div>
            <div className="share-modal-body">
              <div className="product-share-preview">
                <img src={image} alt={title} className="share-product-image" />
                <div className="share-product-info">
                  <h6>{title}</h6>
                  <p className="share-product-price">${price.toFixed(2)}</p>
                </div>
              </div>

              <div className="input-group mb-3 mt-3">
                <input
                  type="text"
                  className="form-control"
                  value={productUrl}
                  readOnly
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={handleCopyLink}
                  type="button"
                >
                  <i className="bi bi-clipboard"></i> Kopyala
                </button>
              </div>

              <div className="share-buttons">
                <button className="btn btn-outline-success" onClick={shareViaWhatsapp}>
                  <i className="bi bi-whatsapp"></i> WhatsApp
                </button>
                <button className="btn btn-outline-primary" onClick={shareViaFacebook}>
                  <i className="bi bi-facebook"></i> Facebook
                </button>
                <button className="btn btn-outline-info" onClick={shareViaTwitter}>
                  <i className="bi bi-twitter"></i> Twitter
                </button>
                <button className="btn btn-outline-secondary" onClick={shareViaEmail}>
                  <i className="bi bi-envelope"></i> E-posta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard; 