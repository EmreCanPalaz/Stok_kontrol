import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
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
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    
    // Cleanup
    return () => {
      AOS.refresh();
    };
  }, []);

  // Set loaded state after component mounts
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
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">
                {feature.description}
              </p>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>

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
