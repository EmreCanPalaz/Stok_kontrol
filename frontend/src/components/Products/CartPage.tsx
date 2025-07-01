import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import './CartPage.css'; // Stil dosyasını da oluşturacağız

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateItemQuantity, cartTotal, clearCart } = useAppContext();

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Alışveriş Sepetim</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Sepetinizde henüz ürün bulunmuyor.</p>
          <Link to="/products" className="btn btn-primary">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items-container">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item row mb-3 align-items-center">
                <div className="col-md-2">
                  <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.title} className="img-fluid" />
                </div>
                <div className="col-md-4">
                  <h5>{item.title}</h5>
                  <p>{item.price.toFixed(2)} TL</p>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-md-2 text-end">
                  <strong>{(item.price * item.quantity).toFixed(2)} TL</strong>
                </div>
                <div className="col-md-1 text-end">
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="cart-summary">
                <h4>Sepet Özeti</h4>
                <div className="d-flex justify-content-between">
                  <span>Ara Toplam:</span>
                  <span>{cartTotal.toFixed(2)} TL</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Genel Toplam:</strong>
                  <strong>{cartTotal.toFixed(2)} TL</strong>
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button className="btn btn-success">Ödemeye Geç</button>
                  <button className="btn btn-outline-danger" onClick={clearCart}>Sepeti Temizle</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;