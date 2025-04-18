import React, { useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import AuthForms from '../Auth/Auth';
import './Navbar.css';


interface NavbarProps {
  onCartClick: () => void;
  cartItemCount: number;
  onFavoritesClick: () => void;
  favoritesCount: number;
  onSearch?: (searchTerm: string) => void;
}


const Navbar: React.FC<NavbarProps> = ({ onCartClick, cartItemCount, onFavoritesClick, favoritesCount, onSearch }) => {

  const { translate, translateCustom, user, logout, activeAdminPanel, setActiveAdminPanel, language, setLanguage } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [initialAuthForm, setInitialAuthForm] = useState<'login' | 'register' | 'deleteAccount' | 'updateUser' | 'feedback'>('login');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const handleNavigation = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
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
    setShowAdminDropdown(false);
  };

  const toggleAdminDropdown = () => {
    setShowAdminDropdown(!showAdminDropdown);
    setShowDropdown(false);
  };

  const handleAdminPanelSelect = (panel: string) => {
    console.log('Panel seçildi:', panel);
    setActiveAdminPanel(panel);
    setShowAdminDropdown(false);
  };

  const toggleAdminModal = () => {
    setShowAdminModal(!showAdminModal);
  };

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (showDropdown || showAdminDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-dropdown-container') && !target.closest('.admin-dropdown-container')) {
          setShowDropdown(false);
          setShowAdminDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showDropdown, showAdminDropdown]);

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
                  {translate('home')}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#products-section" onClick={(e) => handleNavigation('products-section', e)}>
                  {translate('products')}
                </a>
              </li>

              {/* Dil Seçeneği */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link"
                  onClick={() => {
                    console.log("Dil değiştirme butonu tıklandı");
                    console.log("Mevcut dil:", language);
                    try {
                      setShowDropdown(false);
                      setShowAdminDropdown(false);
                      setLanguage(language === 'tr' ? 'en' : 'tr');
                      console.log("Dil değiştirildi:", language === 'tr' ? 'en' : 'tr');
                    } catch (error) {
                      console.error("Dil değiştirme hatası:", error);
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <i className="bi bi-globe me-1"></i>
                  {language === 'tr' ? 'EN' : 'TR'}
                </button>
              </li>

              {/* Yönetim Paneli Dropdown - Yalnızca giriş yapmış kullanıcılar için */}
              {user && user.isLoggedIn && (
                <li className="nav-item admin-dropdown-container">
                  <button
                    className="nav-link admin-dropdown-toggle"
                    onClick={toggleAdminDropdown}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {translate('management')} <i className={`bi bi-chevron-${showAdminDropdown ? 'up' : 'down'}`}></i>
                  </button>

                  {showAdminDropdown && (
                    <div className="admin-dropdown-menu">
                      <button
                        className={`dropdown-menu-item ${activeAdminPanel === 'stock' ? 'active' : ''}`}
                        onClick={() => handleAdminPanelSelect('stock')}
                      >
                        <i className="bi bi-box"></i> {translate('stock_tracking')}
                      </button>
                      <button
                        className={`dropdown-menu-item ${activeAdminPanel === 'inventory' ? 'active' : ''}`}
                        onClick={() => handleAdminPanelSelect('inventory')}
                      >
                        <i className="bi bi-arrow-left-right"></i> {translate('inventory_tracking')}
                      </button>
                      <button
                        className={`dropdown-menu-item ${activeAdminPanel === 'finance' ? 'active' : ''}`}
                        onClick={() => handleAdminPanelSelect('finance')}
                      >
                        <i className="bi bi-cash-stack"></i> {translate('finance_tracking')}
                      </button>
                      <button
                        className={`dropdown-menu-item ${activeAdminPanel === 'activity' ? 'active' : ''}`}
                        onClick={() => handleAdminPanelSelect('activity')}
                      >
                        <i className="bi bi-clock-history"></i> {translate('activity_log')}
                      </button>
                      <button
                        className={`dropdown-menu-item ${activeAdminPanel === 'reviews' ? 'active' : ''}`}
                        onClick={() => handleAdminPanelSelect('reviews')}
                      >
                        <i className="bi bi-star"></i> {translate('review_management')}
                      </button>
                      <button
                        className={`dropdown-menu-item ${activeAdminPanel === 'product' ? 'active' : ''}`}
                        onClick={() => handleAdminPanelSelect('product')}
                      >
                        <i className="bi bi-plus-circle"></i> {translate('add_product')}
                      </button>
                      {activeAdminPanel && (
                        <>
                          <div className="dropdown-divider"></div>
                          <button
                            className="dropdown-menu-item text-danger"
                            onClick={() => setActiveAdminPanel(null)}
                          >
                            <i className="bi bi-x"></i> {translate('close_panel')}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </li>
              )}
            </ul>

            {/* Search Form */}
            <form className="d-flex mx-auto my-2 my-lg-0" onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder={translate('search_product')}
                  aria-label={translate('search_product')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-outline-secondary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            <div className="d-flex align-items-center my-2 my-lg-0">
              {/* Favorites Button */}
              <button
                className="btn btn-outline-danger me-2 position-relative"
                onClick={onFavoritesClick}
                title={translate('favorites')}
              >
                <i className="bi bi-heart"></i>
                {favoritesCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                className="btn btn-outline-primary me-2 position-relative"
                onClick={onCartClick}
                title={translate('cart')}
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
                      <button className="dropdown-menu-item" onClick={() => openAuthModal('updateUser')}>{translate('profile')}</button>
                      <button className="dropdown-menu-item" onClick={() => openAuthModal('feedback')}>{translate('feedback')}</button>
                      <button className="dropdown-menu-item text-danger" onClick={() => openAuthModal('deleteAccount')}>{translate('delete_account')}</button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-menu-item" onClick={handleLogout}>{translate('logout')}</button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
                  {translate('login_register')}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && <AuthForms onClose={toggleAuthModal} initialForm={initialAuthForm} />}

      {/* Yönetim Paneli Modalı */}
      {showAdminModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Yönetim Paneli</h3>
              <button className="close-button" onClick={toggleAdminModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-menu">
                <div className="admin-menu-item" onClick={() => handleAdminPanelSelect('stock')}>
                  <div className="admin-menu-icon">
                    <i className="bi bi-box"></i>
                  </div>
                  <div className="admin-menu-text">
                    <h4>Stok Takibi</h4>
                    <p>Ürünlerin stok durumunu takip etme ve güncelleme</p>
                  </div>
                </div>
                <div className="admin-menu-item" onClick={() => handleAdminPanelSelect('inventory')}>
                  <div className="admin-menu-icon">
                    <i className="bi bi-arrow-left-right"></i>
                  </div>
                  <div className="admin-menu-text">
                    <h4>Depo Giriş-Çıkış</h4>
                    <p>Depoya giren ve çıkan ürünleri takip etme</p>
                  </div>
                </div>
                <div className="admin-menu-item" onClick={() => handleAdminPanelSelect('finance')}>
                  <div className="admin-menu-icon">
                    <i className="bi bi-cash-stack"></i>
                  </div>
                  <div className="admin-menu-text">
                    <h4>Gelir-Gider Takibi</h4>
                    <p>Satış ve harcamaları izleyerek finansal durumu kontrol etme</p>
                  </div>
                </div>
                <div className="admin-menu-item" onClick={() => handleAdminPanelSelect('activity')}>
                  <div className="admin-menu-icon">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div className="admin-menu-text">
                    <h4>İşlem Geçmişi</h4>
                    <p>Yapılan tüm işlemlerin kaydını tutarak geçmişe dönük inceleme yapma</p>
                  </div>
                </div>
                <div className="admin-menu-item" onClick={() => handleAdminPanelSelect('reviews')}>
                  <div className="admin-menu-icon">
                    <i className="bi bi-chat-left-text"></i>
                  </div>
                  <div className="admin-menu-text">
                    <h4>Yorum Yönetimi</h4>
                    <p>Kullanıcı yorumlarını ve puanlarını yönetme, onaylama ve silme</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;