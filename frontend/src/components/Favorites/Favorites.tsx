import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Favorites.css';
import { ProductProps } from '../../types/product';

interface FavoritesProps {
    onClose: () => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onClose }) => {
    const { favoriteItems, removeFromFavorites, addToCart, translate } = useAppContext();

    const handleRemoveFromFavorites = (id: string) => {
        removeFromFavorites(id);
    };

    const handleAddToCart = (product: ProductProps) => {
        addToCart(product);
    };

    return (
        <div className="favorites-overlay">
            <div className="favorites-sidebar">
                <div className="favorites-header">
                    <h5>{translate('favorites')}</h5>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="favorites-items">
                    {favoriteItems.length === 0 ? (
                        <p>Favori ürününüz bulunmamaktadır.</p>
                    ) : (
                        favoriteItems.map(item => (
                            <div key={item._id} className="favorite-item">
                                <img src={item.image} alt={item.title} className="favorite-item-image" />
                                <div className="favorite-item-details">
                                    <h6>{item.title}</h6>
                                    <p>{item.price.toFixed(2)} TL</p>
                                </div>
                                <div className="favorite-item-actions">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="btn btn-sm btn-outline-primary me-2"
                                    >
                                        <i className="bi bi-cart"></i> Sepete Ekle
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromFavorites(item._id)}
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        <i className="bi bi-heart-fill"></i> Favorilerden Çıkar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites; 