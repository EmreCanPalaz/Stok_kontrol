import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import ProductList from '../Products/ProductList';
import Footer from '../Footer/Footer';
import Cart from '../Cart/Cart';
import { useAppContext } from '../../context/AppContext';
import './HomePage.css';
import AdminPanel from '../Admin/AdminPanel';

// HomePage component'i
const HomePage: React.FC = () => {
  const {
    cartItems, 
    addToCart,
    translate,
    activeAdminPanel
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
      
      {activeAdminPanel && <AdminPanel />}

      {/* Sayfa içeriğini container içine alarak kenarlarda boşluk bırakalım */}
      <div className="container">
        {/* Hero bölümü */}
        <div className="hero-section" id="hero-section">
          <div className="hero-background">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="hero-content">
                    <h1 className="hero-title">Inventory Management System</h1>
                    <p className="hero-subtitle">Efficiently track, manage, and optimize your inventory with our powerful solution.</p>
                    <div className="hero-features">
                      <div className="feature-item">
                        <i className="bi bi-check-circle"></i>
                        <span>Real-time stock tracking</span>
                      </div>
                      <div className="feature-item">
                        <i className="bi bi-graph-up"></i>
                        <span>Performance analytics</span>
                      </div>
                      <div className="feature-item">
                        <i className="bi bi-bell"></i>
                        <span>Low stock alerts</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary mt-4"
                      onClick={handleShopNow}
                    >
                      Explore Products
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="hero-graphics">
                    <div className="graphic-container">
                      <div className="floating-card card-1">
                        <i className="bi bi-box-seam"></i>
                        <span>Inventory</span>
                      </div>
                      <div className="floating-card card-2">
                        <i className="bi bi-bar-chart"></i>
                        <span>Analytics</span>
                      </div>
                      <div className="floating-card card-3">
                        <i className="bi bi-truck"></i>
                        <span>Shipping</span>
                      </div>
                      <div className="hero-circle"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ürünler bölümü */}
        <div id="products-section">
          <h2 className="section-title">All Products</h2>
          <ProductList
            onAddToCart={addToCart} 
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
