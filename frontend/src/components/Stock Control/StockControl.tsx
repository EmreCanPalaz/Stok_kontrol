import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ProductProps } from '../../context/AppContext';
import './StockControl.css';

const StockControl: React.FC = () => {
  const { checkLowStockItems, updateStock } = useAppContext();
  const [lowStockItems, setLowStockItems] = useState<ProductProps[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  useEffect(() => {
    // Düşük stoklu ürünleri getir
    const items = checkLowStockItems();
    setLowStockItems(items);
  }, [checkLowStockItems]);

  const handleEditStock = (productId: number, currentStock: number) => {
    setEditingItemId(productId);
    setNewStockValue(currentStock);
  };

  const handleSaveStock = (productId: number) => {
    updateStock(productId, newStockValue);
    setEditingItemId(null);

    // Listeyi güncelle
    setLowStockItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, stock: newStockValue } 
          : item
      ).filter(item => item.stock < 10) // Hala düşük stokta olanları filtrele
    );
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
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
              <tr key={item.id} className={item.stock === 0 ? 'table-danger' : 'table-warning'}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>
                  {editingItemId === item.id ? (
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
                  {editingItemId === item.id ? (
                    <>
                      <button 
                        className="btn btn-success btn-sm me-1" 
                        onClick={() => handleSaveStock(item.id)}
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
                      onClick={() => handleEditStock(item.id, item.stock)}
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