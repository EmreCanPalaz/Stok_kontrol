import React, { useState } from 'react';
import './ProductCard.css';
import ReviewModal from '../Reviews/ReviewModal';
import { useAppContext } from '../../context/AppContext';
import { ProductProps } from '../../types/product';

export interface ProductCardProps extends ProductProps {
  onAddToCart: (product: ProductProps) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  title,
  price,
  description,
  image,
  stock,
  onAddToCart,
  category
  _id,
  title,
  price,
  description,
  image,
  stock,
  onAddToCart,
  category
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites, getAverageRating, getReviewsByProduct, user } = useAppContext();

  const productId = _id;
  const productIsFavorite = isFavorite(productId);
  const averageRating = getAverageRating(productId);
  const { isFavorite, addToFavorites, removeFromFavorites, getAverageRating, getReviewsByProduct, user } = useAppContext();

  const productId = _id;
  const productIsFavorite = isFavorite(productId);
  const averageRating = getAverageRating(productId);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleToggleFavorite = () => {
    if (productIsFavorite) {
      removeFromFavorites(productId);

  const handleToggleFavorite = () => {
    if (productIsFavorite) {
      removeFromFavorites(productId);
    } else {
      addToFavorites({ _id: productId, title, price, description, category, image, stock, sku: productId });
      addToFavorites({ _id: productId, title, price, description, category, image, stock, sku: productId });
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onAddToCart({ _id: productId, title, price, description, category, image, stock, sku: productId });

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onAddToCart({ _id: productId, title, price, description, category, image, stock, sku: productId });

    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.innerHTML;
    const originalClass = button.className;

    const originalText = button.innerHTML;
    const originalClass = button.className;

    button.innerHTML = '<i class="bi bi-check"></i> Eklendi!';
    button.className = 'add-to-cart-btn';

    button.className = 'add-to-cart-btn';

    setTimeout(() => {
      button.innerHTML = originalText;
      button.className = originalClass;
    }, 1000);
      button.innerHTML = originalText;
      button.className = originalClass;
    }, 1000);
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  // Ürün detay sayfasına yönlendirme
  const navigateToProductDetail = () => {
    window.location.href = `/products/${productId}#reviews`;
  };

  // Stok durumuna göre rozet rengi belirleme
  const getStockBadgeClass = () => {
    if (stock <= 0) return "badge bg-danger";
    if (stock < 10) return "badge bg-warning";
    return "badge bg-success";
  };

  // Stok durumuna göre metin belirleme
  const getStockText = () => {
    if (stock <= 0) return "Stokta Yok";
    if (stock < 10) return `Son ${stock} Ürün`;
    return "Stokta Var";
  };

  // Yıldız puanlama gösterimi
  const renderStars = () => {
  // Yıldız puanlama gösterimi
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(averageRating * 2) / 2; // En yakın 0.5'e yuvarla
    
    const rating = Math.round(averageRating * 2) / 2; // En yakın 0.5'e yuvarla
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="bi bi-star-fill"></i>);
      } else if (i - 0.5 === rating) {
        stars.push(<i key={i} className="bi bi-star-half"></i>);
      if (i <= rating) {
        stars.push(<i key={i} className="bi bi-star-fill"></i>);
      } else if (i - 0.5 === rating) {
        stars.push(<i key={i} className="bi bi-star-half"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star"></i>);
        stars.push(<i key={i} className="bi bi-star"></i>);
      }
    }
    
    return stars;
    
    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={title} className="product-image" />
      </div>
      
      <div className="product-info">
        {category && (
          <div className="category-badge">
            <span className="badge bg-info">{category}</span>
          </div>
        )}
        
        {averageRating > 0 && (
          <div className="product-rating">
            <div className="product-stars">
              {renderStars()}
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={title} className="product-image" />
      </div>
      
      <div className="product-info">
        {category && (
          <div className="category-badge">
            <span className="badge bg-info">{category}</span>
          </div>
        )}
        
        {averageRating > 0 && (
          <div className="product-rating">
            <div className="product-stars">
              {renderStars()}
            </div>
            <span className="rating-text">({getReviewsByProduct(productId).length})</span>
            <span className="rating-text">({getReviewsByProduct(productId).length})</span>
          </div>
        )}
        
        <h3 className="product-title">{title}</h3>
        
        {description && (
          <p className="product-description">{description}</p>
        )}
        
        <div className="product-price">
          {price.toFixed(2)} TL
        </div>
        
        <div className="product-footer">
          <span className={getStockBadgeClass()}>
            {getStockText()}
          </span>
        </div>
        
        <div className="product-actions">
          <button
            onClick={handleAddToCartClick}
            className="action-btn add-to-cart-btn"
            disabled={stock <= 0}
          >
            <i className="bi bi-cart-plus"></i>
            <span>Sepete Ekle</span>
          </button>
          
          <button
            onClick={handleToggleFavorite}
            className={`action-btn favorite-btn ${productIsFavorite ? 'active' : ''}`}
          >
            <i className={`bi bi-heart${productIsFavorite ? '-fill' : ''}`}></i>
            <span>{productIsFavorite ? 'Favorilerde' : 'Favorilere Ekle'}</span>
          </button>
        </div>
        
        <div className="reviews-section">
          <button
            onClick={navigateToProductDetail}
            className="reviews-btn"
          >
            <i className="bi bi-chat-square-text"></i>
            <span>Yorumlar ({getReviewsByProduct(productId).length})</span>
          </button>
        </div>
      </div>
      
      {showReviewModal && (
        <ReviewModal
          productId={productId}
          productTitle={title}
          onClose={handleCloseReviewModal}
        />
      )}
    </div>
  );
};

export default ProductCard;
export default ProductCard;