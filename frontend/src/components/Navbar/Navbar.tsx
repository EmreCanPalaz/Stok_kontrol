import React, { useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import AuthForms from '../Auth/Auth';
import './Navbar.css';


interface NavbarProps {
  onCartClick: () => void; 
  cartItemCount: number;  
}


const Navbar: React.FC<NavbarProps> = ({ onCartClick, cartItemCount }) => {
 
  const { translate, user, logout } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [initialAuthForm, setInitialAuthForm] = useState<'login' | 'register' | 'deleteAccount' | 'updateUser' | 'feedback'>('login');

  
  const handleNavigation = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const openAuthModal = (formType: 'login' | 'register' | 'deleteAccount' | 'updateUser' | 'feedback' = 'login') => {
    setInitialAuthForm(formType);
    setShowAuthModal(true);
    setShowDropdown(false);
  };
  
  const toggleAuthModal = () => {
    setShowAuthModal(!showAuthModal);
    setShowDropdown(false);
  };
  
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (showDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-dropdown-container')) {
          setShowDropdown(false);
        }
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showDropdown]);
  
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* Marka adı temel UI elemanı */}
          <a className="navbar-brand" href="#hero-section">Stok Kontrol</a>

          {/* Mobil menü butonu temel UI elemanı */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              {/* Temel Navigasyon Linkleri */}
              <li className="nav-item">
                <a className="nav-link active" href="#hero-section" onClick={(e) => handleNavigation('hero-section', e)}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#products-section" onClick={(e) => handleNavigation('products-section', e)}>
                  Products
                </a>
              </li>
            </ul>
            <div className="ms-3 d-flex align-items-center">
              <button
                className="btn btn-outline-primary me-2 position-relative"
                onClick={onCartClick} 
                title="Shopping Cart" 
              >
                <i className="bi bi-cart"></i>
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {/* Giriş/Kayıt veya Kullanıcı menüsü */}
              {user && user.isLoggedIn ? (
                <div className="user-dropdown-container position-relative">
                  <button 
                    className="btn btn-outline-success" 
                    onClick={toggleDropdown}
                  >
                    {user.username} <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'}`}></i>
                  </button>
                  
                  {showDropdown && (
                    <div className="user-dropdown-menu">
                      <button className="dropdown-menu-item" onClick={() => openAuthModal('updateUser')}>Profile</button>
                      <button className="dropdown-menu-item" onClick={() => openAuthModal('feedback')}>Feedback</button>
                      <button className="dropdown-menu-item text-danger" onClick={() => openAuthModal('deleteAccount')}>Delete Account</button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-menu-item" onClick={handleLogout}>Log Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Auth Modal */}
      {showAuthModal && <AuthForms onClose={toggleAuthModal} initialForm={initialAuthForm} />}
    </>
  );
};

export default Navbar;