import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Cart.css';
import { CartItem } from '../../types/product';

interface CartProps {
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const { cartItems, cartTotal, removeFromCart, updateItemQuantity, clearCart, translate } = useAppContext();

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateItemQuantity(productId, newQuantity);
  };

  const handleClearCart = () => {
    if (window.confirm('Sepetinizi tamamen boşaltmak istediğinize emin misiniz?')) {
      clearCart();
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <h5>{translate('cart')}</h5>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Sepetiniz boş.</p>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h6>{item.title}</h6>
                  <p>{item.price.toFixed(2)} TL</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="btn btn-sm btn-outline-secondary"
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="btn btn-sm btn-outline-secondary"
                    >+</button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-button"
                >×</button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <h5>Toplam: {cartTotal.toFixed(2)} TL</h5>
          <button className="btn btn-primary btn-block" onClick={() => {
            alert('Ödeme sayfasına yönlendiriliyor...');
          }} disabled={cartItems.length === 0}>Ödemeye Geç</button>
          <button className="btn btn-danger btn-sm mt-2" onClick={handleClearCart} disabled={cartItems.length === 0}>Sepeti Boşalt</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
