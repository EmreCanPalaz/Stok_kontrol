import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const { translate, user } = useAppContext();

  const isAdmin = user?.role === 'admin';
  const isStockManager = user?.role === 'stock_manager' || isAdmin;

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Yönetim Paneli</h2>
      
      <div className="admin-dashboard">
        <div className="row">
          {isStockManager && (
            <>
              <div className="col-md-4 mb-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <i className="bi bi-box-seam"></i>
                    <h3>{translate('stock_tracking')}</h3>
                  </div>
                  <div className="admin-card-body">
                    <p>Stok durumunu takip edin, düşük stok uyarılarını görüntüleyin.</p>
                    <Link to="/admin/stock" className="admin-card-link">
                      Stok Takibine Git <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <i className="bi bi-inboxes"></i>
                    <h3>{translate('inventory_tracking')}</h3>
                  </div>
                  <div className="admin-card-body">
                    <p>Envanter giriş-çıkışlarını takip edin ve yönetin.</p>
                    <Link to="/admin/inventory" className="admin-card-link">
                      Envanter Takibine Git <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <i className="bi bi-box"></i>
                    <h3>Ürün Yönetimi</h3>
                  </div>
                  <div className="admin-card-body">
                    <p>Ürünleri görüntüleyin, düzenleyin ve yeni ürünler ekleyin.</p>
                    <Link to="/admin/products" className="admin-card-link">
                      Ürün Yönetimine Git <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {isAdmin && (
            <>
              <div className="col-md-4 mb-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <i className="bi bi-cash-coin"></i>
                    <h3>{translate('finance_tracking')}</h3>
                  </div>
                  <div className="admin-card-body">
                    <p>Gelir ve giderleri takip edin, finansal raporları görüntüleyin.</p>
                    <Link to="/admin/finance" className="admin-card-link">
                      Finans Takibine Git <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <i className="bi bi-activity"></i>
                    <h3>{translate('activity_log')}</h3>
                  </div>
                  <div className="admin-card-body">
                    <p>Sistem üzerindeki tüm aktiviteleri görüntüleyin ve takip edin.</p>
                    <Link to="/admin/activity" className="admin-card-link">
                      Aktivite Loglarına Git <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <i className="bi bi-star"></i>
                    <h3>{translate('review_management')}</h3>
                  </div>
                  <div className="admin-card-body">
                    <p>Kullanıcı yorumlarını yönetin, onaylayın veya silin.</p>
                    <Link to="/admin/reviews" className="admin-card-link">
                      Yorum Yönetimine Git <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <i className="bi bi-plus-circle"></i>
                    <h3>{translate('add_product')}</h3>
                  </div>
                  <div className="admin-card-body">
                    <p>Sisteme yeni ürünler ekleyin.</p>
                    <Link to="/admin/products/add" className="admin-card-link">
                      Ürün Ekle <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;