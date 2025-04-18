import React from 'react';

import { useAppContext } from '../../context/AppContext';
import './Navbar.css';


interface NavbarProps {
  onCartClick: () => void; 
  cartItemCount: number;  
}


const Navbar: React.FC<NavbarProps> = ({ onCartClick, cartItemCount }) => {
 
  const { translate } = useAppContext();

  
  const handleNavigation = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Marka adı temel UI elemanı */}
        <a className="navbar-brand" href="#hero-section">ShopApp</a>

        {/* Mobil menü butonu temel UI elemanı */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Temel Navigasyon Linkleri */}
            <li className="nav-item">
              <a className="nav-link active" href="#hero-section" onClick={(e) => handleNavigation('hero-section', e)}>
                {translate ? translate('navHome') : 'Home'} {/* translate fonksiyonu kullanılıyor */}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#products-section" onClick={(e) => handleNavigation('products-section', e)}>
                {translate ? translate('navProducts') : 'Products'} {/* translate fonksiyonu kullanılıyor */}
              </a>
            </li>
          </ul>
          <div className="ms-3 d-flex align-items-center"> {/* d-flex align-items-center korundu */}
            <button
              className="btn btn-outline-primary me-2 position-relative"
              onClick={onCartClick} 
              title={translate ? translate('navCart') : 'Shopping Cart'} 
            >
              <i className="bi bi-cart"></i>
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </button>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;