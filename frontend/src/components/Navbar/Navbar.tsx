import React, { useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import AuthForms from '../Auth/Auth';
import './Navbar.css';


interface NavbarProps {
  onCartClick: () => void; 
  cartItemCount: number;  
}


const Navbar: React.FC<NavbarProps> = ({ onCartClick, cartItemCount }) => {
 
  const { translate, user, logout, activeAdminPanel, setActiveAdminPanel } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [initialAuthForm, setInitialAuthForm] = useState<'login' | 'register' | 'deleteAccount' | 'updateUser' | 'feedback'>('login');
  const [showAdminModal, setShowAdminModal] = useState(false);

  
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
                  Anasayfa
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#products-section" onClick={(e) => handleNavigation('products-section', e)}>
                  Ürünler
                </a>
              </li>
              
              {/* Yönetim Paneli Dropdown - Yalnızca giriş yapmış kullanıcılar için */}
              {user && user.isLoggedIn && (
                <li className="nav-item admin-dropdown-container">
                  <button 
                    className="nav-link admin-dropdown-toggle"
                    onClick={toggleAdminDropdown}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Yönetim <i className={`bi bi-chevron-${showAdminDropdown ? 'up' : 'down'}`}></i>
                  </button>
                  
                  {showAdminDropdown && (
                    <div className="admin-dropdown-menu">
                      <button 
                        className={`dropdown-menu-item ${activeAdminPanel === 'stock' ? 'active' : ''}`} 
                        onClick={() => handleAdminPanelSelect('stock')}
                      >
                        <i className="bi bi-box"></i> Stok Takibi
                      </button>
                      <button 
                        className={`dropdown-menu-item ${activeAdminPanel === 'inventory' ? 'active' : ''}`} 
                        onClick={() => handleAdminPanelSelect('inventory')}
                      >
                        <i className="bi bi-arrow-left-right"></i> Depo Giriş-Çıkış
                      </button>
                      <button 
                        className={`dropdown-menu-item ${activeAdminPanel === 'finance' ? 'active' : ''}`} 
                        onClick={() => handleAdminPanelSelect('finance')}
                      >
                        <i className="bi bi-cash-stack"></i> Gelir-Gider Takibi
                      </button>
                      <button 
                        className={`dropdown-menu-item ${activeAdminPanel === 'activity' ? 'active' : ''}`} 
                        onClick={() => handleAdminPanelSelect('activity')}
                      >
                        <i className="bi bi-clock-history"></i> İşlem Geçmişi
                      </button>
                      {activeAdminPanel && (
                        <>
                          <div className="dropdown-divider"></div>
                          <button 
                            className="dropdown-menu-item text-danger" 
                            onClick={() => setActiveAdminPanel(null)}
                          >
                            <i className="bi bi-x"></i> Paneli Kapat
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </li>
              )}
            </ul>
            <div className="ms-3 d-flex align-items-center">
              <button
                className="btn btn-outline-primary me-2 position-relative"
                onClick={onCartClick} 
                title="Alışveriş Sepeti" 
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
                      <button className="dropdown-menu-item" onClick={() => openAuthModal('updateUser')}>Profil</button>
                      <button className="dropdown-menu-item" onClick={() => openAuthModal('feedback')}>Geribildirim</button>
                      <button className="dropdown-menu-item text-danger" onClick={() => openAuthModal('deleteAccount')}>Hesabı Sil</button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-menu-item" onClick={handleLogout}>Çıkış Yap</button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
                  Giriş / Kayıt
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
                {/* Yeni Yorum Yönetimi seçeneği */}
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