import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Footer.css';

const Footer: React.FC = () => {
  const { translate, translateCustom } = useAppContext();
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform: string, e: React.MouseEvent) => {
    e.preventDefault();
    alert(translateCustom(
      `${platform} sayfasına yönlendiriliyorsunuz...`,
      `Redirecting you to ${platform}...`
    ));
  };

  const handleLinkClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    alert(translateCustom(
      `${page} sayfasına yönlendiriliyorsunuz...`,
      `Redirecting you to ${page}...`
    ));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '') {
      alert(translateCustom(
        'Lütfen bir e-posta adresi girin.',
        'Please enter an email address.'
      ));
      return;
    }
    alert(translateCustom(
      `${email} adresi bülten listemize kaydedildi!`,
      `${email} has been added to our newsletter list!`
    ));
    setEmail('');
  };

  return (
    <footer className="modern-footer">
      <div className="footer-top">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="widget-title">EmKaHan Stok</h4>
                <p className="footer-description">
                  {translateCustom(
                    'Profesyonel stok yönetimi çözümü. Envanter takibi, sipariş yönetimi ve analiz araçlarıyla işletmenizi büyütün.',
                    'Professional inventory management solution. Grow your business with inventory tracking, order management, and analytics tools.'
                  )}
                </p>
                <div className="social-links">
                  <a href="#" onClick={(e) => handleSocialClick('Facebook', e)} aria-label="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" onClick={(e) => handleSocialClick('Twitter', e)} aria-label="Twitter">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="#" onClick={(e) => handleSocialClick('Instagram', e)} aria-label="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" onClick={(e) => handleSocialClick('LinkedIn', e)} aria-label="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" onClick={(e) => handleSocialClick('GitHub', e)} aria-label="GitHub">
                    <i className="bi bi-github"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="widget-title">{translateCustom('Hızlı Erişim', 'Quick Links')}</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('Ürünler', 'Products'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('Ürünler', 'Products')}
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('Stok Takibi', 'Stock Tracking'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('Stok Takibi', 'Stock Tracking')}
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('Envanter', 'Inventory'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('Envanter', 'Inventory')}
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('Finans', 'Finance'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('Finans', 'Finance')}
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('Raporlar', 'Reports'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('Raporlar', 'Reports')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="widget-title">{translateCustom('Destek', 'Support')}</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('Yardım Merkezi', 'Help Center'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('Yardım Merkezi', 'Help Center')}
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('Kullanım Kılavuzu', 'User Guide'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('Kullanım Kılavuzu', 'User Guide')}
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('İletişim', 'Contact Us'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('İletişim', 'Contact Us')}
                    </a>
                  </li>
                  
                  <li>
                    <a href="#" onClick={(e) => handleLinkClick(translateCustom('SSS', 'FAQ'), e)}>
                      <i className="bi bi-chevron-right"></i> {translateCustom('SSS', 'FAQ')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="widget-title">{translateCustom('Bülten', 'Newsletter')}</h4>
                <p className="newsletter-text">
                  {translateCustom(
                    'Yeni özellikler, güncellemeler ve özel teklifler hakkında bilgi almak için abone olun.',
                    'Subscribe to receive information about new features, updates, and special offers.'
                  )}
                </p>
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder={translateCustom('E-posta adresiniz', 'Your email address')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary" type="submit">
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </div>
                </form>
                <div className="app-badges">
                  <p className="mt-3 mb-2">{translateCustom('Mobil uygulamamızı indirin', 'Download our mobile app')}</p>
                  <div className="badge-container">
                    <a href="#" onClick={(e) => handleLinkClick('App Store', e)} className="app-badge">
                      <i className="bi bi-apple me-2"></i>
                      <span>App Store</span>
                    </a>
                    <a href="#" onClick={(e) => handleLinkClick('Google Play', e)} className="app-badge">
                      <i className="bi bi-google-play me-2"></i>
                      <span>Google Play</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright-text mb-md-0">
                &copy; {currentYear} EmKaHan Stok Kontrol. {translateCustom('Tüm hakları saklıdır.', 'All rights reserved.')}
              </p>
            </div>
            <div className="col-md-6">
              <ul className="footer-bottom-links">
                <li>
                  <a href="#" onClick={(e) => handleLinkClick(translateCustom('Gizlilik Politikası', 'Privacy Policy'), e)}>
                    {translateCustom('Gizlilik Politikası', 'Privacy Policy')}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => handleLinkClick(translateCustom('Kullanım Şartları', 'Terms of Use'), e)}>
                    {translateCustom('Kullanım Şartları', 'Terms of Use')}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => handleLinkClick(translateCustom('Çerez Politikası', 'Cookie Policy'), e)}>
                    {translateCustom('Çerez Politikası', 'Cookie Policy')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;