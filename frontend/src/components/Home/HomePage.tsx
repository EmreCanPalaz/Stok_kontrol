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
    addToCart, 
   
    translate 
  } = useAppContext();

 
  const [showCart, setShowCart] = useState(false); 
  

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

      


      
      <div className="hero-section" id="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="hero-title">{translate ? translate('heroTitle') : 'Welcome to ShopApp'}</h1>
              <p className="hero-subtitle">{translate ? translate('heroSubtitle') : 'Find the best products here.'}</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleShopNow}
                title={translate ? translate('heroButtonTitle') : 'Shop Now'}
              >
                {translate ? translate('heroButton') : 'Shop Now'}
              </button>
            </div>
            <div className="col-md-6">
              
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2hvcHBpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                className="img-fluid hero-image"
                alt="Shopping banner" />
            </div>
          </div>
        </div>
      </div>

     
      <div className="container mt-5" id="products-section">
        <div className="row">
         

          
          <div className="col-lg-12"> 
            <h2 className="section-title mb-4">
              
              {translate ? translate('productsAllTitle') : 'All Products'}
            </h2>
            
            <ProductList
              
              onAddToCart={addToCart} 
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};



export default HomePage;
