import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Favorites.css';

interface FavoritesProps {
    onClose: () => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onClose }) => {
    const { favoriteItems, removeFromFavorites, addToCart, isFavorite } = useAppContext();

    if (favoriteItems.length === 0) {
        return (
            <div className="favorites-overlay">
                <div className="favorites-container">
                    <div className="favorites-header">
                        <h5>Favorileriniz</h5>
                        <button className="close-button" onClick={onClose}>×</button>
                    </div>
                    <div className="favorites-empty">
                        <p>Henüz favorilerinize ürün eklemediniz</p>
                        <button className="btn btn-primary" onClick={onClose}>Alışverişe Devam Et</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleRemoveFromFavorites = (id: number) => {
        removeFromFavorites(id);
    };

    const handleAddToCart = (product: any) => {
        addToCart(product);
    };

    return (
        <div className="favorites-overlay">
            <div className="favorites-container">
                <div className="favorites-header">
                    <h5>Favorileriniz</h5>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="favorites-items">
                    {favoriteItems.map(item => (
                        <div key={item.id} className="favorite-item">
                            <img src={item.image} alt={item.title} className="favorite-item-image" />
                            <div className="favorite-item-details">
                                <h6>{item.title}</h6>
                                <p>${item.price.toFixed(2)}</p>
                                <div className="favorite-item-actions">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <i className="bi bi-cart-plus"></i> Sepete Ekle
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromFavorites(item.id)}
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        <i className="bi bi-heart-fill"></i> Favorilerden Çıkar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="favorites-footer">
                    <div className="favorites-actions">
                        <button className="btn btn-outline-secondary" onClick={onClose}>
                            Alışverişe Devam Et
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorites; 