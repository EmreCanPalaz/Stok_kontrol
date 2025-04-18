import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Cart.css';

interface CartProps {
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const { cartItems, cartTotal, removeFromCart, updateItemQuantity } = useAppContext();

  if (cartItems.length === 0) {
    return (
      <div className="cart-overlay">
        <div className="cart-container">
          <div className="cart-header">
            <h5>Your Cart</h5>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <button className="btn btn-primary" onClick={onClose}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h5>Your Cart</h5>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h6>{item.title}</h6>
                <p>${item.price.toFixed(2)}</p>
                <div className="quantity-control">
                  <button 
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    className="btn btn-sm btn-outline-secondary"
                  >-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    className="btn btn-sm btn-outline-secondary"
                  >+</button>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-button"
              >×</button>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="cart-actions">
            <button className="btn btn-primary">Checkout</button>
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
