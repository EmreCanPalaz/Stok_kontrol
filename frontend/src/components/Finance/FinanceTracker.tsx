import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './FinanceTracker.css';
import { FinancialTransaction, ProductProps } from '../../types/product';
import { format } from 'date-fns';

const FinanceTracker: React.FC = () => {
  const { products, financialTransactions, addFinancialTransaction, getFinancialSummary, getFinancialTransactionsByCategory, getFinancialTransactionsByType, getFinancialTransactionsByDateRange } = useAppContext();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [relatedProductId, setRelatedProductId] = useState<string | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const financeCategories = type === 'income'
    ? ['Satış Geliri', 'Hizmet Geliri', 'Diğer Gelirler']
    : ['Ürün Maliyeti', 'Operasyonel Giderler', 'Pazarlama Giderleri', 'Personel Giderleri', 'Diğer Giderler'];

  const summary = getFinancialSummary();

  const filteredTransactionsByDate = (startDate || endDate) ?
    getFinancialTransactionsByDateRange(new Date(startDate), new Date(endDate)) :
    financialTransactions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount === '' || amount <= 0) {
      alert('Lütfen geçerli bir miktar girin.');
      return;
    }
    if (!category) {
        alert('Lütfen bir kategori seçin.');
        return;
    }

    const newTransactionData: Omit<FinancialTransaction, '_id' | 'date' | 'createdBy'> = {
      description,
      amount: type === 'expense' ? -parseFloat(amount.toString()) : parseFloat(amount.toString()),
      type,
      category,
      relatedProductId: relatedProductId || undefined,
    };

    try {
        await addFinancialTransaction(newTransactionData);
        setDescription('');
        setAmount('');
        setCategory('');
        setRelatedProductId('');
        alert('İşlem başarıyla eklendi!');
    } catch (error) {
        console.error('Finans işlemi eklenirken hata:', error);
        alert('Finans işlemi eklenirken bir hata oluştu.');
    }
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="finance-tracker">
      <h2>Finans Takibi</h2>

      <div className="summary">
        <h3>Özet</h3>
        <p className="text-success">Toplam Gelir: {summary.totalIncome.toFixed(2)} TL</p>
        <p className="text-danger">Toplam Gider: {summary.totalExpense.toFixed(2)} TL</p>
        <h4 className={summary.balance >= 0 ? 'text-success' : 'text-danger'}>Bakiye: {summary.balance.toFixed(2)} TL</h4>
      </div>

      <div className="add-transaction-form">
        <h3>Yeni İşlem Ekle</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tip:</label>
            <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')} className="form-control">
              <option value="expense">Gider</option>
              <option value="income">Gelir</option>
            </select>
          </div>
           <div className="form-group">
            <label>Kategori:</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-control" required>
                <option value="">Kategori Seçin</option>
                {financeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Açıklama:</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Miktar:</label>
            <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} className="form-control" required min="0.01" step="0.01"/>
          </div>
           <div className="form-group">
            <label>İlişkili Ürün (Opsiyonel):</label>
            <select value={relatedProductId} onChange={e => setRelatedProductId(e.target.value)} className="form-control">
              <option value="">Ürün Seçin (Opsiyonel)</option>
               {products.map(product => (
                 <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Ekle</button>
        </form>
      </div>

      <div className="transaction-list mt-4">
        <h3>İşlemler</h3>

        <div className="date-filter form-inline mb-3">
            <div className="form-group me-2">
                <label htmlFor="startDate" className="me-1">Başlangıç Tarihi:</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-control" />
            </div>
            <div className="form-group me-2">
                 <label htmlFor="endDate" className="me-1">Bitiş Tarihi:</label>
                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-control" />
            </div>
             <button className="btn btn-secondary me-2" onClick={clearDateFilter}>Filtreyi Temizle</button>
        </div>

        {filteredTransactionsByDate.length === 0 ? (
            <p>Gösterilecek işlem bulunamadı.</p>
        ) : (
             <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>Tip</th>
                        <th>Kategori</th>
                        <th>Açıklama</th>
                        <th>Miktar</th>
                         <th>İlişkili Ürün</th>
                         <th>Yapan Kullanıcı</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactionsByDate.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{format(new Date(transaction.date), 'dd.MM.yyyy HH:mm')}</td>
                            <td className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
                                {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                            </td>
                            <td>{transaction.category}</td>
                            <td>{transaction.description}</td>
                            <td className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
                                {transaction.type === 'expense' ? '-' : ''}{Math.abs(transaction.amount).toFixed(2)} TL
                            </td>
                            <td>
                                {transaction.relatedProductId ?
                                    (products.find(p => p._id === transaction.relatedProductId)?.title || 'Ürün Bulunamadı')
                                    : '-'}
                            </td>
                            <td>{transaction.createdBy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

      </div>
    </div>
  );
};

export default FinanceTracker;