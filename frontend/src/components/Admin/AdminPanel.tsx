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
  const { activeAdminPanel, translate } = useAppContext();

  console.log('Active Admin Panel:', activeAdminPanel);

  if (!activeAdminPanel) return null;

  return (
    <div className="admin-panel-container">
      <h3 className="admin-panel-title">
        {activeAdminPanel === 'stock' ? translate('stock_tracking') :
          activeAdminPanel === 'inventory' ? translate('inventory_tracking') :
            activeAdminPanel === 'finance' ? translate('finance_tracking') :
              activeAdminPanel === 'activity' ? translate('activity_log') :
                activeAdminPanel === 'reviews' ? translate('review_management') :
                  activeAdminPanel === 'product' ? translate('add_product') : 'Unknown Panel'}
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
