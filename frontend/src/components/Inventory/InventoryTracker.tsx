import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './InventoryTracker.css';
import { InventoryTransaction, ProductProps } from '../../types/product';
import { format } from 'date-fns';

const InventoryTracker: React.FC = () => {
  const { products, inventoryTransactions, addInventoryTransaction, getInventoryTransactionsByProduct, getInventoryTransactionsByType } = useAppContext();

  const [selectedProduct, setSelectedProduct] = useState<string | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [reason, setReason] = useState('');

  const transactionsForSelectedProduct = selectedProduct ? getInventoryTransactionsByProduct(selectedProduct) : inventoryTransactions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Lütfen bir ürün seçin.');
      return;
    }
    if (quantity === '' || quantity <= 0) {
      alert('Lütfen geçerli bir miktar girin.');
      return;
    }
    if (!reason) {
        alert('Lütfen işlem sebebini girin.');
        return;
    }

    const newTransactionData: Omit<InventoryTransaction, '_id' | 'date' | 'createdBy' | 'productName'> = {
      productId: selectedProduct,
      quantity: parseInt(quantity.toString()),
      type: transactionType,
      reason,
    };

    try {
        await addInventoryTransaction(newTransactionData);
        setSelectedProduct('');
        setQuantity('');
        setReason('');
        alert('Depo işlemi başarıyla eklendi!');
    } catch (error) {
        console.error('Depo işlemi eklenirken hata:', error);
        alert('Depo işlemi eklenirken bir hata oluştu.');
    }
  };

  return (
    <div className="inventory-tracker">
      <h2>Depo Giriş-Çıkış Takibi</h2>

      <div className="add-transaction-form">
        <h3>Yeni İşlem Ekle</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ürün:</label>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="form-control" required>
              <option value="">Ürün Seçin</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.title} (Mevcut Stok: {product.stock})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tip:</label>
            <select value={transactionType} onChange={e => setTransactionType(e.target.value as 'in' | 'out')} className="form-control">
              <option value="in">Giriş</option>
              <option value="out">Çıkış</option>
            </select>
          </div>
          <div className="form-group">
            <label>Miktar:</label>
            <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} className="form-control" required min="1"/>
          </div>
           <div className="form-group">
            <label>Sebep:</label>
            <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="form-control" required/>
          </div>
          <button type="submit" className="btn btn-primary">Ekle</button>
        </form>
      </div>

      <div className="transaction-list mt-4">
        <h3>İşlem Geçmişi {selectedProduct ? `(${products.find(p => p._id === selectedProduct)?.title} İçin)` : ''}</h3>
        
        <div className="form-group mb-3">
            <label>Ürüne Göre Filtrele:</label>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="form-control">
              <option value="">Tüm Ürünler</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>

        {transactionsForSelectedProduct.length === 0 ? (
            <p>Gösterilecek işlem bulunamadı.</p>
        ) : (
             <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Tarih</th>
                         <th>Ürün</th>
                        <th>Tip</th>
                        <th>Miktar</th>
                        <th>Sebep</th>
                         <th>Yapan Kullanıcı</th>
                    </tr>
                </thead>
                <tbody>
                    {transactionsForSelectedProduct.map(transaction => (
                        <tr key={transaction._id}>
                            <td>
                                {transaction.date ? (
                                    <>
                                        {new Date(transaction.date).toLocaleDateString()}{' '}
                                        {transaction.date && format(new Date(transaction.date), 'HH:mm')}
                                    </>
                                ) : (
                                    'Tarih bilgisi yok'
                                )}
                            </td>
                            <td>{transaction.productName || 'İsimsiz ürün'}</td>
                            <td className={transaction.type === 'in' ? 'text-success' : 'text-danger'}>
                                {transaction.type === 'in' ? 'Giriş' : 'Çıkış'}
                            </td>
                            <td>{transaction.quantity}</td>
                            <td>{transaction.reason || '-'}</td>
                            <td>
                                {typeof transaction.createdBy === 'object' 
                                    ? (transaction.createdBy && transaction.createdBy.firstName 
                                        ? `${transaction.createdBy.firstName} ${transaction.createdBy.lastName || ''}` 
                                        : 'Bilinmiyor')
                                    : (transaction.createdBy || 'Bilinmiyor')
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

      </div>
    </div>
  );
};

export default InventoryTracker;
