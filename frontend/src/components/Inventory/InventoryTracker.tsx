import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './InventoryTracker.css';

const InventoryTracker: React.FC = () => {
  const { 
    inventoryTransactions, 
    addInventoryTransaction, 
    products 
  } = useAppContext();
  
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [reason, setReason] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState(inventoryTransactions);
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');

  useEffect(() => {
    // Tüm işlemleri veya filtrelenmiş işlemleri göster
    if (filterType === 'all') {
      setFilteredTransactions([...inventoryTransactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } else {
      setFilteredTransactions(
        inventoryTransactions.filter(t => t.type === filterType)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    }
  }, [inventoryTransactions, filterType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || !reason) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }
    
    // Seçili ürünün adını bul - any tipi kullanarak tip hatasını önlüyoruz
    const selectedProductObj = products.find(p => p.id === selectedProduct);
    if (!selectedProductObj) {
      alert('Geçerli bir ürün seçin');
      return;
    }
    
    // İşlemi ekle
    addInventoryTransaction({
      productId: selectedProduct,
      productName: selectedProductObj.title,
      quantity,
      type: transactionType,
      reason,
      createdBy: 'Mevcut Kullanıcı' // Gerçek uygulamada kullanıcı adı kullanılabilir
    });
    
    // Formu sıfırla
    setQuantity(1);
    setReason('');
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="inventory-tracker-container">
      <h2 className="mb-4">Depo Giriş-Çıkış Takibi</h2>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Yeni İşlem Ekle</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="product" className="form-label">Ürün</label>
                  <select 
                    id="product" 
                    className="form-select" 
                    value={selectedProduct} 
                    onChange={(e) => setSelectedProduct(Number(e.target.value))}
                    required
                  >
                    <option value="">Ürün Seçin</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.title} (Mevcut Stok: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="transactionType" className="form-label">İşlem Türü</label>
                  <div className="d-flex">
                    <div className="form-check me-3">
                      <input 
                        type="radio" 
                        className="form-check-input" 
                        id="typeIn" 
                        name="transactionType" 
                        value="in" 
                        checked={transactionType === 'in'} 
                        onChange={() => setTransactionType('in')} 
                        required
                      />
                      <label className="form-check-label" htmlFor="typeIn">Giriş</label>
                    </div>
                    <div className="form-check">
                      <input 
                        type="radio" 
                        className="form-check-input" 
                        id="typeOut" 
                        name="transactionType" 
                        value="out" 
                        checked={transactionType === 'out'} 
                        onChange={() => setTransactionType('out')} 
                        required
                      />
                      <label className="form-check-label" htmlFor="typeOut">Çıkış</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Miktar</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} 
                    min="1" 
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="reason" className="form-label">Açıklama</label>
                  <textarea 
                    className="form-control" 
                    id="reason" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-100">İşlemi Kaydet</button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Depo İşlemleri</h5>
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterType('all')}
                  >
                    Tümü
                  </button>
                  <button 
                    className={`btn btn-sm ${filterType === 'in' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilterType('in')}
                  >
                    Giriş
                  </button>
                  <button 
                    className={`btn btn-sm ${filterType === 'out' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setFilterType('out')}
                  >
                    Çıkış
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {filteredTransactions.length === 0 ? (
                <div className="alert alert-info">Henüz işlem bulunmamaktadır.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Ürün</th>
                        <th>İşlem</th>
                        <th>Miktar</th>
                        <th>Açıklama</th>
                        <th>İşlemi Yapan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>{formatDate(transaction.date)}</td>
                          <td>{transaction.productName}</td>
                          <td>
                            <span className={`badge ${transaction.type === 'in' ? 'bg-success' : 'bg-danger'}`}>
                              {transaction.type === 'in' ? 'Giriş' : 'Çıkış'}
                            </span>
                          </td>
                          <td>{transaction.quantity}</td>
                          <td>{transaction.reason}</td>
                          <td>{transaction.createdBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTracker;
