import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './FinanceTracker.css';

// Tip tanımını burada yapabiliriz
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

const FinanceTracker: React.FC = () => {
  const { 
    financialTransactions, 
    addFinancialTransaction,
    getFinancialSummary,
    products
  } = useAppContext();
  
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<string>('');
  const [relatedProductId, setRelatedProductId] = useState<number | undefined>(undefined);
  const [filteredTransactions, setFilteredTransactions] = useState(financialTransactions);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  const categories = {
    income: ['Satış', 'Diğer Gelir'],
    expense: ['Satın Alma', 'Personel', 'Kira', 'Nakliye', 'Diğer Gider']
  };
  
  useEffect(() => {
    // Tüm işlemleri veya filtrelenmiş işlemleri göster
    if (filterType === 'all') {
      setFilteredTransactions([...financialTransactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } else {
      setFilteredTransactions(
        financialTransactions.filter(t => t.type === filterType)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    }
  }, [financialTransactions, filterType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }
    
    // İşlemi ekle
    addFinancialTransaction({
      description,
      amount: transactionType === 'income' ? Math.abs(amount) : -Math.abs(amount),
      type: transactionType,
      category,
      relatedProductId,
      createdBy: 'Mevcut Kullanıcı' // Gerçek uygulamada kullanıcı adı kullanılabilir
    });
    
    // Formu sıfırla
    setDescription('');
    setAmount(0);
    setCategory('');
    setRelatedProductId(undefined);
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const { totalIncome, totalExpense, balance } = getFinancialSummary();

  return (
    <div className="finance-tracker-container">
      <h2 className="mb-4">Gelir-Gider Takibi</h2>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="summary-card income-card">
            <h3>Toplam Gelir</h3>
            <div className="amount text-success">{formatCurrency(totalIncome)}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card expense-card">
            <h3>Toplam Gider</h3>
            <div className="amount text-danger">{formatCurrency(totalExpense)}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card balance-card">
            <h3>Bakiye</h3>
            <div className={`amount ${balance >= 0 ? 'text-primary' : 'text-danger'}`}>
              {formatCurrency(balance)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Yeni İşlem Ekle</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="transactionType" className="form-label">İşlem Türü</label>
                  <div className="d-flex">
                    <div className="form-check me-3">
                      <input 
                        type="radio" 
                        className="form-check-input" 
                        id="typeIncome" 
                        name="transactionType" 
                        value="income" 
                        checked={transactionType === 'income'} 
                        onChange={() => {
                          setTransactionType('income');
                          setCategory('');
                        }} 
                        required
                      />
                      <label className="form-check-label" htmlFor="typeIncome">Gelir</label>
                    </div>
                    <div className="form-check">
                      <input 
                        type="radio" 
                        className="form-check-input" 
                        id="typeExpense" 
                        name="transactionType" 
                        value="expense" 
                        checked={transactionType === 'expense'} 
                        onChange={() => {
                          setTransactionType('expense');
                          setCategory('');
                        }} 
                        required
                      />
                      <label className="form-check-label" htmlFor="typeExpense">Gider</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Kategori</label>
                  <select 
                    id="category" 
                    className="form-select" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories[transactionType].map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Açıklama</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Tutar (TL)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="amount" 
                    value={amount} 
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} 
                    min="0.01" 
                    step="0.01" 
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="relatedProduct" className="form-label">İlişkili Ürün (Opsiyonel)</label>
                  <select 
                    id="relatedProduct" 
                    className="form-select" 
                    value={relatedProductId || ''} 
                    onChange={(e) => setRelatedProductId(e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <option value="">Ürün Seçin (Opsiyonel)</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                      </option>
                    ))}
                  </select>
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
                <h5 className="card-title mb-0">Finansal İşlemler</h5>
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterType('all')}
                  >
                    Tümü
                  </button>
                  <button 
                    className={`btn btn-sm ${filterType === 'income' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilterType('income')}
                  >
                    Gelir
                  </button>
                  <button 
                    className={`btn btn-sm ${filterType === 'expense' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setFilterType('expense')}
                  >
                    Gider
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {filteredTransactions.length === 0 ? (
                <div className="alert alert-info">Henüz finansal işlem bulunmamaktadır.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Kategori</th>
                        <th>Açıklama</th>
                        <th>Tutar</th>
                        <th>İşlemi Yapan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>{formatDate(transaction.date)}</td>
                          <td>
                            <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                              {transaction.category}
                            </span>
                          </td>
                          <td>{transaction.description}</td>
                          <td className={transaction.amount >= 0 ? 'text-success' : 'text-danger'}>
                            {formatCurrency(transaction.amount)}
                          </td>
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

export default FinanceTracker;