import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './Navbar.css';
import Cart from '../Cart/Cart';
import Cart from '../Cart/Cart';
=======
import { useAppContext } from '../../context/AppContext';
import './Navbar.css';
import Cart from '../Cart/Cart';
>>>>>>> e0c8134 (third one commit)

interface NavbarProps {
  onCartClick?: () => void;
  cartItemCount?: number;
  onFavoritesClick?: () => void;
  favoritesCount?: number;
  onSearch?: (term: string) => void;
<<<<<<< HEAD
  onCartClick?: () => void;
  cartItemCount?: number;
  onFavoritesClick?: () => void;
  favoritesCount?: number;
  onSearch?: (term: string) => void;
=======
>>>>>>> e0c8134 (third one commit)
}

const Navbar: React.FC<NavbarProps> = ({ 
  onCartClick: propOnCartClick, 
  cartItemCount: propCartItemCount,
  onFavoritesClick: propOnFavoritesClick,
  favoritesCount: propFavoritesCount,
  onSearch: propOnSearch
}) => {
  const { 
<<<<<<< HEAD
    translate, 
=======
    user, 
    logout, 
    translate, 
    activeAdminPanel, 
    setActiveAdminPanel, 
>>>>>>> e0c8134 (third one commit)
    language, 
    setLanguage,
    cartItems,
    favoriteItems
  } = useAppContext();
  
  const navigate = useNavigate();
<<<<<<< HEAD
  const [isCartOpen, setIsCartOpen] = useState(false);
=======
>>>>>>> e0c8134 (third one commit)
  
  // Context'ten gelen değerleri kullan veya props'tan gelenleri kullan
  const cartCount = propCartItemCount !== undefined ? propCartItemCount : cartItems.length;
  const favCount = propFavoritesCount !== undefined ? propFavoritesCount : favoriteItems.length;
  
<<<<<<< HEAD
  const handleCartClick = () => {
    if (propOnCartClick) {
      propOnCartClick();
    } else {
      // Cart modal'ını aç
      setIsCartOpen(true);
    }
  };
  
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };
  
=======
>>>>>>> e0c8134 (third one commit)
  const handleFavoritesClick = () => {
    if (propOnFavoritesClick) {
      propOnFavoritesClick();
    } else {
      // Favoriler sayfasına yönlendir
      navigate('/favorites');
    }
  };
  
  // Diğer state'ler ve fonksiyonlar aynı kalır
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
<<<<<<< HEAD
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLLIElement>(null);
  
=======
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const adminDropdownRef = useRef<HTMLLIElement>(null);
  const langDropdownRef = useRef<HTMLLIElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
>>>>>>> e0c8134 (third one commit)

  // Dropdown dışına tıklandığında dropdown'ları kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
<<<<<<< HEAD
      
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      
=======
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
>>>>>>> e0c8134 (third one commit)
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (propOnSearch) {
      propOnSearch(searchTerm);
    } else {
      // Ürünler sayfasına yönlendir ve arama terimini query parametresi olarak ekle
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

<<<<<<< HEAD
  
=======
  const toggleAdminDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
    setIsLangDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };
>>>>>>> e0c8134 (third one commit)

  const toggleLangDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLangDropdownOpen(!isLangDropdownOpen);
<<<<<<< HEAD
    
=======
    setIsAdminDropdownOpen(false);
    setIsUserDropdownOpen(false);
>>>>>>> e0c8134 (third one commit)
  };

  const toggleUserDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
<<<<<<< HEAD
   
    setIsLangDropdownOpen(false);
  };

 
  const handleLanguageChange = (lang: 'tr' | 'en') => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  
=======
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsAdminDropdownOpen(false);
    setIsLangDropdownOpen(false);
  };

  const handleAdminPanelClick = (panelType: string | null) => {
    setActiveAdminPanel(panelType);
    setIsAdminDropdownOpen(false);
  };

  const handleLanguageChange = (lang: 'tr' | 'en') => {
    // 1. Uygulama içi state'i güncelle (mevcut işlevsellik)
    setLanguage(lang);

    // 2. Google Translate widget'ını bul ve dilini değiştir
    const googleTranslateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleTranslateSelect) {
      googleTranslateSelect.value = lang;
      // Değişikliği tetiklemek için bir 'change' olayı gönder
      googleTranslateSelect.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      console.warn('Google Translate dropdown not found. It might not be loaded yet.');
    }

    // 3. Dropdown menüsünü kapat
    setIsLangDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };
>>>>>>> e0c8134 (third one commit)

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Stok Kontrol</Link>
<<<<<<< HEAD
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Stok Kontrol</Link>
=======
>>>>>>> e0c8134 (third one commit)

        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
<<<<<<< HEAD
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
=======
>>>>>>> e0c8134 (third one commit)

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                <i className="bi bi-house-door me-1"></i>
                {translate('home')}
              </Link>
            </li>
<<<<<<< HEAD

            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="bi bi-box me-1"></i>
                {translate('products')}
              </Link>
            </li>

            

            
=======

            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="bi bi-box me-1"></i>
                {translate('products')}
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">
                  <i className="bi bi-heart me-1"></i>
                  {translate('favorites')}
                </Link>
              </li>
            )}

            {(user && (user.role === 'admin' || user.role === 'stock_manager')) && (
              <li 
                className={`nav-item dropdown ${isAdminDropdownOpen ? 'show' : ''}`}
                ref={adminDropdownRef}
              >
>>>>>>> e0c8134 (third one commit)
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  onClick={toggleAdminDropdown}
                >
                  {translate('management')}
                </a>
<<<<<<< HEAD
                
=======
                <ul className={`dropdown-menu ${isAdminDropdownOpen ? 'show' : ''}`}>
>>>>>>> e0c8134 (third one commit)
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      Yönetim Paneli
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/stock">
                      {translate('stock_tracking')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/inventory">
                      {translate('inventory_tracking')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/finance">
                      {translate('finance_tracking')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/activity">
                      {translate('activity_log')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/reviews">
                      {translate('review_management')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/products">
                      Ürün Yönetimi
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/products/add">
                      {translate('add_product')}
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            <li 
              className={`nav-item dropdown ${isLangDropdownOpen ? 'show' : ''}`}
              ref={langDropdownRef}
            >
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                onClick={toggleLangDropdown}
              >
                {language === 'tr' ? 'TR' : 'EN'}
              </a>
              <ul className={`dropdown-menu ${isLangDropdownOpen ? 'show' : ''}`}>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'tr' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('tr')}
                  >
                    Türkçe
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
<<<<<<< HEAD
            )}

            <li 
              className={`nav-item dropdown ${isLangDropdownOpen ? 'show' : ''}`}
              ref={langDropdownRef}
            >
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                onClick={toggleLangDropdown}
              >
                {language === 'tr' ? 'TR' : 'EN'}
              </a>
              <ul className={`dropdown-menu ${isLangDropdownOpen ? 'show' : ''}`}>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'tr' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('tr')}
                  >
                    Türkçe
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    English
                    English
                  </button>
                </li>
=======
                  >
                    English
                  </button>
                </li>
>>>>>>> e0c8134 (third one commit)
              </ul>
            </li>
          </ul>

          <form className="d-flex me-2" onSubmit={handleSearchSubmit}>
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder={translate('search_product')}
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
<<<<<<< HEAD
            <button className="btn btn-outline-primary" type="submit">
=======
            <button className="btn btn-outline-secondary" type="submit">
>>>>>>> e0c8134 (third one commit)
              <i className="bi bi-search"></i>
            </button>
          </form>

<<<<<<< HEAD
          <div className="d-flex">
            <button 
              className="btn btn-outline-primary position-relative me-2"
              onClick={handleCartClick}
            >
              <i className="bi bi-cart"></i>
=======
          <div className="d-flex align-items-center">
            <Link to="/cart" className="btn btn-outline-secondary me-2 position-relative">
              <i className="bi bi-bag"></i>
>>>>>>> e0c8134 (third one commit)
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
<<<<<<< HEAD
            </button>

            <button 
              className="btn btn-outline-primary position-relative me-2"
              onClick={handleFavoritesClick}
=======
            </Link>

            <Link
              to="/favorites"
              className="btn btn-outline-secondary position-relative me-2"
>>>>>>> e0c8134 (third one commit)
            >
              <i className="bi bi-heart"></i>
              {favCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {favCount}
                </span>
              )}
<<<<<<< HEAD
            </button>

            {
=======
            </Link>

            {user ? (
              <div className="user-dropdown" ref={userDropdownRef}>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={toggleUserDropdown}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.username}
                </button>
                <div className={`dropdown-menu dropdown-menu-end ${isUserDropdownOpen ? 'show' : ''}`}>
                  <Link 
                    className="dropdown-item" 
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    {translate('profile')}
                  </Link>
                  <Link 
                    className="dropdown-item" 
                    to="/feedback"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
>>>>>>> e0c8134 (third one commit)
                    {translate('feedback')}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                  >
                    {translate('logout')}
<<<<<<< HEAD
                    {translate('logout')}
=======
>>>>>>> e0c8134 (third one commit)
                  </button>
                </div>
              </div>
            ) : (
<<<<<<< HEAD
              <Link to="/login" className="btn btn-outline-primary">
=======
              <Link to="/login" className="btn btn-outline-secondary">
>>>>>>> e0c8134 (third one commit)
                {translate('login_register')}
              </Link>
            )}
          </div>
        </div>
      </div>
<<<<<<< HEAD
      {isCartOpen && <Cart onClose={handleCloseCart} />}
=======
>>>>>>> e0c8134 (third one commit)
    </nav>
  );
};

export default Navbar;