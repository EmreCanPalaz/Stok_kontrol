import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './ProductCard.css';
import ReviewModal from '../Reviews/ReviewModal';

export interface ProductProps {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

interface ProductCardProps extends Omit<ProductProps, 'rating'> { 
  onAddToCart: () => void; 
}

const ProductCard: React.FC<ProductCardProps> = ({
  id, title, price, description, category, image, stock, onAddToCart
}) => {
  const { getStockStatus, getAverageRating } = useAppContext();
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Ortalama puanı al
  const averageRating = getAverageRating(id);
  
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
        </div>
        <div className="card-body d-flex flex-column">
          <div className="category-badge mb-2">
            <span className="badge bg-secondary">{category}</span>
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
          
          <p className="card-text product-description">{description.substring(0, 100)}...</p>

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
    </>
  );
};

export default ProductCard; 