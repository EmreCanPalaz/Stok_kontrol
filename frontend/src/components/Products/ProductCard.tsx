import React from 'react';
import './ProductCard.css';
import { useAppContext } from '../../context/AppContext';

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
  const { getStockStatus } = useAppContext();
  
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
    
    //alert(${title} detayları görüntüleniyor... (Bu bir placeholder));
  };

  return (
    <div className="card product-card h-100">
      <div className="product-image-container">
        <img src={image} className="card-img-top product-image" alt={title} />
      </div>
      <div className="card-body d-flex flex-column">
        <div className="category-badge mb-2">
          <span className="badge bg-secondary">{category}</span>
          <div className="mt-1">
            {getStockBadge()}
          </div>
        </div>
        <h5 className="card-title product-title">{title}</h5>
        <p className="card-text product-description">{description.substring(0, 100)}...</p>

        <div className="d-flex justify-content-between align-items-center mt-auto"> 
          <h5 className="product-price mb-0">${price.toFixed(2)}</h5>
          <div>
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
  );
};

export default ProductCard;