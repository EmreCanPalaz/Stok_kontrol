import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { useAppContext } from '../../context/AppContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './HomePage.css';

const HomePage: React.FC = () => {

  const { translate, language } = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  // Özel çeviri fonksiyonu
  const translateCustom = (turkish: string, english: string) => {
    return language === 'tr' ? turkish : english;
  };

  // Initialize AOS animation library
=======
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { translate, language } = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  // Özel çeviri fonksiyonu
  const translateCustom = (turkish: string, english: string) => {
    return language === 'tr' ? turkish : english;
  };

>>>>>>> e0c8134 (third one commit)
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    
    // Cleanup
    return () => {
      AOS.refresh();
<<<<<<< HEAD
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    
    // Cleanup
    return () => {
      AOS.refresh();
=======
>>>>>>> e0c8134 (third one commit)
    };
  }, []);

  // Set loaded state after component mounts
<<<<<<< HEAD
  // Set loaded state after component mounts
=======
>>>>>>> e0c8134 (third one commit)
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Features data
  const features = [
    {
      icon: "bi bi-graph-up",
      title: translate('stockTracking'),
      description: translate('stockTrackingDesc')
    },
    {
      icon: "bi bi-search",
      title: translate('detailedSearch'),
      description: translate('detailedSearchDesc')
    },
    {
      icon: "bi bi-phone",
      title: translate('mobileCompatible'),
      description: translate('mobileCompatibleDesc')
    },
    {
      icon: "bi bi-bar-chart",
      title: translate('reporting'),
      description: translate('reportingDesc')
    }
  ];

  // Steps data
  const steps = [
    {
      number: 1,
      title: translate('register'),
      description: translate('registerDesc')
    },
    {
      number: 2,
      title: translate('addProducts'),
      description: translate('addProductsDesc')
    },
    {
      number: 3,
      title: translate('trackStock'),
      description: translate('trackStockDesc')
    }
  ];

  return (
    <div className={`home-container ${isLoaded ? 'loaded' : ''}`}>
      <div className="hero-section" data-aos="fade-up">
        <div className="hero-background"></div>
        <h1 className="hero-title">{translate('stockControlSystem')}</h1>
        <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
          {translate('modernStockSolution')}
        </p>
<<<<<<< HEAD
        
        (
=======
        {!user ? (
          <div className="hero-buttons" data-aos="fade-up" data-aos-delay="400">
            <Link to="/login" className="btn btn-primary btn-lg btn-with-icon">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>{translate('login')}</span>
              <div className="btn-hover-effect"></div>
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg btn-with-icon">
              <i className="bi bi-person-plus"></i>
              <span>{translate('register')}</span>
              <div className="btn-hover-effect"></div>
            </Link>
          </div>
        ) : (
>>>>>>> e0c8134 (third one commit)
          <div className="hero-buttons" data-aos="fade-up" data-aos-delay="400">
            <Link to="/products" className="btn btn-primary btn-lg btn-with-icon">
              <i className="bi bi-grid-3x3-gap"></i>
              <span>{translate('viewProducts')}</span>
              <div className="btn-hover-effect"></div>
            </Link>
          </div>
        )}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title" data-aos="fade-up">
          <span className="highlight">{translate('features')}</span>
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              data-aos="zoom-in"
              data-aos-delay={100 * index}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="feature-icon">
                <i className={feature.icon}></i>
<<<<<<< HEAD
      <div className="features-section">
        <h2 className="section-title" data-aos="fade-up">
          <span className="highlight">{translate('features')}</span>
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              data-aos="zoom-in"
              data-aos-delay={100 * index}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="feature-icon">
                <i className={feature.icon}></i>
=======
>>>>>>> e0c8134 (third one commit)
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">
                {feature.description}
              </p>
              <div className="feature-hover-effect"></div>
<<<<<<< HEAD
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">
                {feature.description}
              </p>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
          ))}
        </div>
      </div>
      </div>
=======
            </div>
          ))}
        </div>
      </div>
>>>>>>> e0c8134 (third one commit)

      <div className="how-it-works-section" data-aos="fade-up">
        <h2 className="section-title">
          <span className="highlight">{translate('howItWorks')}</span>
        </h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step-item"
              data-aos="fade-right"
              data-aos-delay={150 * index}
            >
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
<<<<<<< HEAD
      <div className="how-it-works-section" data-aos="fade-up">
        <h2 className="section-title">
          <span className="highlight">{translate('howItWorks')}</span>
        </h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step-item"
              data-aos="fade-right"
              data-aos-delay={150 * index}
            >
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      
      
=======

      {!user && (
        <div className="cta-section" data-aos="fade-up">
          <div className="cta-background"></div>
          <h2 className="cta-title">{translate('startNow')}</h2>
          <p className="cta-description" data-aos="fade-up" data-aos-delay="200">
            {translate('startNowDesc')}
          </p>
          <Link 
            to="/register" 
            className="btn btn-light btn-lg btn-with-icon"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <i className="bi bi-arrow-right-circle"></i>
            <span>{translate('registerFree')}</span>
            <div className="btn-hover-effect"></div>
          </Link>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
          </div>
        </div>
      )}
>>>>>>> e0c8134 (third one commit)
      
      <div className="stats-section" data-aos="fade-up">
        <div className="stats-grid">
          <div className="stat-item" data-aos="zoom-in" data-aos-delay="100">
            <div className="stat-value counter">5000+</div>
            <div className="stat-label">{translateCustom('Aktif Kullanıcı', 'Active Users')}</div>
          </div>
          <div className="stat-item" data-aos="zoom-in" data-aos-delay="200">
            <div className="stat-value counter">10M+</div>
            <div className="stat-label">{translateCustom('Yönetilen Ürün', 'Products Managed')}</div>
          </div>
          <div className="stat-item" data-aos="zoom-in" data-aos-delay="300">
            <div className="stat-value counter">98%</div>
            <div className="stat-label">{translateCustom('Müşteri Memnuniyeti', 'Customer Satisfaction')}</div>
          </div>
          <div className="stat-item" data-aos="zoom-in" data-aos-delay="400">
            <div className="stat-value counter">24/7</div>
            <div className="stat-label">{translateCustom('Destek', 'Support')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
