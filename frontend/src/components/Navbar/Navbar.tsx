import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './Navbar.css';
import Cart from '../Cart/Cart';

interface NavbarProps {
  onCartClick?: () => void;
  cartItemCount?: number;
  onFavoritesClick?: () => void;
  favoritesCount?: number;
  onSearch?: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onCartClick: propOnCartClick, 
  cartItemCount: propCartItemCount,
  onFavoritesClick: propOnFavoritesClick,
  favoritesCount: propFavoritesCount,
  onSearch: propOnSearch
}) => {
  const { 
     
    translate, 

    language, 
    setLanguage,
    cartItems,
    favoriteItems
  } = useAppContext();
  
  const navigate = useNavigate();
  
  // Context'ten gelen değerleri kullan veya props'tan gelenleri kullan
  const cartCount = propCartItemCount !== undefined ? propCartItemCount : cartItems.length;
  const favCount = propFavoritesCount !== undefined ? propFavoritesCount : favoriteItems.length;
  
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
 
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  
 
  const langDropdownRef = useRef<HTMLLIElement>(null);
  

  // Dropdown dışına tıklandığında dropdown'ları kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
     
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      
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

 

  const toggleLangDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLangDropdownOpen(!isLangDropdownOpen);
    
  };

  const toggleUserDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
   
    setIsLangDropdownOpen(false);
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



  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Stok Kontrol</Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                <i className="bi bi-house-door me-1"></i>
                {translate('home')}
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="bi bi-box me-1"></i>
                {translate('products')}
              </Link>
            </li>

            {(
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">
                  <i className="bi bi-heart me-1"></i>
                  {translate('favorites')}
                </Link>
              </li>
            )}

            {(
             
               
                  {translate()}
                </a>
                <ul className={}>
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
                  >
                    English
                  </button>
                </li>
              </ul>
            </li>
          

          <form className="d-flex me-2" onSubmit={handleSearchSubmit}>
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder={translate('search_product')}
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn btn-outline-secondary" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <div className="d-flex align-items-center">
            <Link to="/cart" className="btn btn-outline-secondary me-2 position-relative">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/favorites"
              className="btn btn-outline-secondary position-relative me-2"
            >
              <i className="bi bi-heart"></i>
              {favCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {favCount}
                </span>
              )}
            </Link>

            { (
              <div className="user-dropdown" ref={}>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={toggleUserDropdown}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {}
                </button>
                <div className={}>
                  <Link 
                    className="dropdown-item" 
                    to="/profile"
                    onClick={}
                  >
                    {translate('profile')}
                  </Link>
                  <Link 
                    className="dropdown-item" 
                    to="/feedback"
                    onClick={}
                  >
                    {translate('feedback')}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item" 
                    onClick={}
                  >
                    {translate('logout')}
                  </button>
                </div>
              </div>
            ) 
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;