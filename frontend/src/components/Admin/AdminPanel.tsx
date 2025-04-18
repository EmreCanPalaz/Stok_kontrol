import React from 'react';
import { useAppContext } from '../../context/AppContext';
import StockControl from '../Stock Control/StockControl';
import InventoryTracker from '../Inventory/InventoryTracker';
import FinanceTracker from '../Finance/FinanceTracker';
import ActivityLog from '../Activity/ActivityLog';
import AdminReviews from '../Reviews/AdminReviews';
import AddProduct from './AddProduct';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const { activeAdminPanel } = useAppContext();

  console.log('Active Admin Panel:', activeAdminPanel);

  if (!activeAdminPanel) return null;

  return (
    <div className="admin-panel-container">
      <h3 className="admin-panel-title">
        {activeAdminPanel === 'stock' ? 'Stok Takibi' :
          activeAdminPanel === 'inventory' ? 'Depo Giriş-Çıkış Takibi' :
            activeAdminPanel === 'finance' ? 'Gelir-Gider Takibi' :
              activeAdminPanel === 'activity' ? 'İşlem Geçmişi' :
                activeAdminPanel === 'reviews' ? 'Yorum Yönetimi' :
                  activeAdminPanel === 'product' ? 'Ürün Ekle' : 'Bilinmeyen Panel'}
      </h3>

      {activeAdminPanel === 'stock' && <StockControl />}
      {activeAdminPanel === 'inventory' && <InventoryTracker />}
      {activeAdminPanel === 'finance' && <FinanceTracker />}
      {activeAdminPanel === 'activity' && <ActivityLog />}
      {activeAdminPanel === 'reviews' && <AdminReviews />}
      {activeAdminPanel === 'product' && <AddProduct />}
    </div>
  );
};

export default AdminPanel;
