import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Footer.css';

const Footer: React.FC = () => {
  const { translate, translateCustom } = useAppContext();
  const [email, setEmail] = useState('');

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
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">E-Shop</h5>
            <p>
              {translateCustom(
                'Tüm alışveriş ihtiyaçlarınız için tek adres. Kaliteli ürünler, rekabetçi fiyatlar ve mükemmel müşteri hizmeti.',
                'Your one-stop shop for all your shopping needs. Quality products, competitive prices, and excellent customer service.'
              )}
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon me-2" onClick={(e) => handleSocialClick('Facebook', e)}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon me-2" onClick={(e) => handleSocialClick('Twitter', e)}>
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-icon me-2" onClick={(e) => handleSocialClick('Instagram', e)}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-icon" onClick={(e) => handleSocialClick('LinkedIn', e)}>
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">{translateCustom('Mağaza', 'Shop')}</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('Erkek Giyim', "Men's Clothing"), e)}>
                  {translate('categoryMen')}
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('Kadın Giyim', "Women's Clothing"), e)}>
                  {translate('categoryWomen')}
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('Elektronik', 'Electronics'), e)}>
                  {translate('categoryElectronics')}
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('Takı', 'Jewelry'), e)}>
                  {translate('categoryJewelry')}
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('İndirimli Ürünler', 'Sale Items'), e)}>
                  {translateCustom('İndirimli Ürünler', 'Sale Items')}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">{translateCustom('Müşteri Hizmetleri', 'Customer Service')}</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('İletişim', 'Contact Us'), e)}>
                  {translate('footerContact')}
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('Kargo ve İadeler', 'Shipping & Returns'), e)}>
                  {translateCustom('Kargo ve İadeler', 'Shipping & Returns')}
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick('FAQ', e)}>
                  {translateCustom('SSS', 'FAQ')}
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('Beden Rehberi', 'Size Guide'), e)}>
                  {translateCustom('Beden Rehberi', 'Size Guide')}
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" onClick={(e) => handleLinkClick(translateCustom('Siparişini Takip Et', 'Track Your Order'), e)}>
                  {translateCustom('Siparişini Takip Et', 'Track Your Order')}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">{translateCustom('Bülten', 'Newsletter')}</h5>
            <p>{translateCustom(
              'Güncellemeleri almak, özel fırsatlara erişmek ve daha fazlası için abone olun.',
              'Subscribe to receive updates, access to exclusive deals, and more.'
            )}</p>
            <form onSubmit={handleSubscribe}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder={translateCustom('E-posta adresiniz', 'Your email address')}
                  aria-label="Email"
                  aria-describedby="button-addon2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="btn btn-outline-light" type="submit" id="button-addon2">
                  {translateCustom('Abone Ol', 'Subscribe')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="copyright text-center py-3 mt-4 border-top border-secondary">
        <div className="container">
          <p className="mb-0">
            &copy; 2025 E-Shop. {translate('footerRights')}.
            Created By EmKaHan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 