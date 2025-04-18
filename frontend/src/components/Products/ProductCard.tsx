import React from 'react';

import './ProductCard.css';



export interface ProductProps {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  
}


interface ProductCardProps extends Omit<ProductProps, 'rating'> { 
  onAddToCart: () => void; 
}


const ProductCard: React.FC<ProductCardProps> = ({
  id, title, price, description, category, image, onAddToCart
}) => {
  

  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart(); 
    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.textContent || 'Add to Cart'; // Fallback metin
    button.innerHTML = '<i class="bi bi-check"></i> Added!';
    button.disabled = true;
    setTimeout(() => {
      button.innerHTML = `<i class="bi bi-cart-plus"></i> ${originalText.includes('Add to Cart') ? 'Add to Cart' : originalText}`; // İkonu geri ekle
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
        </div>
       
        <h5 className="card-title product-title">{title}</h5>
       
        <p className="card-text product-description">{description.substring(0, 100)}...</p>

        
        <div className="d-flex justify-content-between align-items-center mt-auto"> 
          
          <h5 className="product-price mb-0">${price.toFixed(2)}</h5>
          <div>
            
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={handleViewDetails}
              title="Ürün detaylarını görüntüle" // title'ı güncellemek iyi olabilir
            >
              <i className="bi bi-eye"></i>
            </button>

          
            <button
              className="btn btn-sm btn-primary"
              onClick={handleAddToCart}
              title="Sepete ekle"
            >
              <i className="bi bi-cart-plus"></i> Add to Cart
           
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ProductCard;