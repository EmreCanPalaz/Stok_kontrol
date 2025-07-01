import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ProductProps } from '../../types/product';
import { Link } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const { favoriteItems, removeFromFavorites, addToCart, translate } = useAppContext();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          {translate('login_to_view_favorites')}
          <Link to="/login" className="ms-2">{translate('login')}</Link>.
        </div>
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="container mt-5">
        <h2>{translate('favorites')}</h2>
        <div className="alert alert-info">
          {translate('no_favorites')}
        </div>
        <Link to="/products" className="btn btn-primary">
          {translate('browse_products')}
        </Link>
      </div>
    );
  }

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId);
  };

  const handleAddToCart = (product: ProductProps) => {
    addToCart(product);
  };

  return (
    <div className="container mt-5">
      <h2>{translate('favorites')}</h2>
      <div className="row">
        {favoriteItems.map((product) => (
          <div key={product._id} className="col-md-4 mb-4">
            <div className="card h-100">
              {product.image && (
                <img 
                  src={product.image} 
                  className="card-img-top" 
                  alt={product.title} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong>{translate('price')}:</strong> {product.price.toFixed(2)} TL
                </p>
                <p className="card-text">
                  <strong>{translate('stock')}:</strong> {product.stock}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveFromFavorites(product._id)}
                >
                  <i className="bi bi-heart-fill me-1"></i>
                  {translate('remove_from_favorites')}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <i className="bi bi-cart-plus me-1"></i>
                  {product.stock > 0 ? translate('add_to_cart') : translate('out_of_stock')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link to="/products" className="btn btn-secondary">
          {translate('back_to_products')}
        </Link>
      </div>
    </div>
  );
};

export default FavoritesPage;