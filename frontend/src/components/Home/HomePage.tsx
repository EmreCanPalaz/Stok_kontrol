import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import ProductList from '../Products/ProductList';
import Footer from '../Footer/Footer';
import Cart from '../Cart/Cart';
import { useAppContext } from '../../context/AppContext';
import './HomePage.css';

// HomePage component'i
const HomePage: React.FC = () => {
  const {
    cartItems, 
    addToCart
  } = useAppContext();

  const [showCart, setShowCart] = useState(false);
  
  // Bootstrap JS'i dropdown için import ediyoruz
  useEffect(() => {
    // Bootstrap JS'i dynamically import etme
    const loadBootstrapJS = async () => {
      try {
        const bootstrap = await import('bootstrap');
        // Dropdown'ların çalışması için gerekli
      } catch (error) {
        console.error('Bootstrap JS yüklenemedi:', error);
      }
    };
    
    loadBootstrapJS();
  }, []);

  const handleShopNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div className="home-page">
      <Navbar
        onCartClick={toggleCart}
        cartItemCount={cartItems.length}
      />
      
      {showCart && <Cart onClose={toggleCart} />}

      <div className="container mt-4">
        <div className="hero-section" id="hero-section">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="hero-title">Inventory <span>Management</span> System</h1>
              <p className="hero-subtitle">Efficiently track, manage, and optimize your inventory with our powerful solution.</p>
              
              <div className="feature-list mt-4">
                <div className="feature-item">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <span>Real-time stock tracking</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-graph-up text-success me-2"></i>
                  <span>Performance analytics</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-bell text-success me-2"></i>
                  <span>Low stock alerts</span>
                </div>
              </div>
              
              <button
                className="btn btn-primary mt-4"
                onClick={handleShopNow}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Explore Products
              </button>
            </div>
            
            <div className="col-md-6">
              <div className="hero-image-container">
                <div className="earth-globe">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg" alt="Earth" />
                  <div className="earth-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5" id="products-section">
          <h2 className="section-title">All Products</h2>
          <ProductList onAddToCart={addToCart} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
