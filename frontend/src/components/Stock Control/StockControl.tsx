import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import './StockControl.css';
import { ProductProps } from '../../types/product';

const StockControl: React.FC = () => {
  const { products, checkLowStockItems, updateStock } = useAppContext();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<number | ''>('');

  const lowStockItems = useMemo(() => {
    return checkLowStockItems(10);
  }, [products, checkLowStockItems]);

  const handleEditStock = (productId: string, currentStock: number) => {
    setEditingItemId(productId);
    setNewStockValue(currentStock);
  };

  const handleSaveStock = async (productId: string) => {
    if (newStockValue === '' || newStockValue < 0) {
      alert('Lütfen geçerli bir stok değeri girin.');
      return;
    }

    try {
      await updateStock(productId, parseInt(newStockValue.toString()));
      setEditingItemId(null);
      alert('Stok başarıyla güncellendi!');
    } catch (error) {
      console.error('Stok güncelleme hatası:', error);
      alert('Stok güncellenirken bir hata oluştu.');
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setNewStockValue('');
  };

  if (lowStockItems.length === 0) {
    return (
      <div className="alert alert-success">
        Tüm ürünlerin stok durumu yeterli.
      </div>
    );
  }

  return (
    <div className="stock-control-container">
      <h3>Stok Durumu Azalan Ürünler</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Ürün ID</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Stok Durumu</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.map(item => (
              <tr key={item._id} className={item.stock === 0 ? 'table-danger' : 'table-warning'}>
                <td>{item._id}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>
                  {editingItemId === item._id ? (
                    <input 
                      type="number" 
                      className="form-control form-control-sm" 
                      value={newStockValue} 
                      onChange={(e) => setNewStockValue(parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  ) : (
                    <span className={`badge ${item.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                      {item.stock}
                    </span>
                  )}
                </td>
                <td>
                  {editingItemId === item._id ? (
                    <>
                      <button 
                        className="btn btn-success btn-sm me-1" 
                        onClick={() => handleSaveStock(item._id)}
                      >
                        <i className="bi bi-check"></i> Kaydet
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={handleCancelEdit}
                      >
                        <i className="bi bi-x"></i> İptal
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => handleEditStock(item._id, item.stock)}
                    >
                      <i className="bi bi-pencil"></i> Stok Güncelle
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockControl; 