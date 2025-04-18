import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './ActivityLog.css';

const ActivityLog: React.FC = () => {
  const { 
    activityLogs, 
    getActivityLogsByAction,
    getActivityLogsByUser,
    getActivityLogsByDateRange
  } = useAppContext();
  
  const [filteredLogs, setFilteredLogs] = useState(activityLogs);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtre uygulamak için bir fonksiyon
  const applyFilters = () => {
    let filtered = [...activityLogs];
    
    // Eylem filtreleme
    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action.startsWith(filterAction));
    }
    
    // Tarih filtreleme
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Bitiş gününün sonuna kadar
      
      filtered = filtered.filter(log => 
        log.date >= start && log.date <= end
      );
    }
    
    // Arama terimi filtreleme
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.description.toLowerCase().includes(term) || 
        log.performedBy.toLowerCase().includes(term) ||
        JSON.stringify(log.details).toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(filtered);
  };
  
  // Filtreler değiştiğinde otomatik uygula
  useEffect(() => {
    applyFilters();
  }, [filterAction, startDate, endDate, searchTerm, activityLogs]);
  
  // Eylem türünü insanlaştır
  const humanizeAction = (action: string) => {
    if (action.startsWith('stock_')) {
      return 'Stok İşlemi';
    } else if (action.startsWith('inventory_in')) {
      return 'Depo Giriş';
    } else if (action.startsWith('inventory_out')) {
      return 'Depo Çıkış';
    } else if (action.startsWith('finance_income')) {
      return 'Gelir';
    } else if (action.startsWith('finance_expense')) {
      return 'Gider';
    }
    return action;
  };
  
  // Tarih formatlama
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
    <div className="activity-log-container">
      <h2 className="mb-4">İşlem Geçmişi</h2>
      
      <div className="filters-container mb-4">
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="actionFilter" className="form-label">İşlem Türü</label>
              <select 
                id="actionFilter" 
                className="form-select"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              >
                <option value="all">Tüm İşlemler</option>
                <option value="stock_">Stok İşlemleri</option>
                <option value="inventory_in">Depo Giriş</option>
                <option value="inventory_out">Depo Çıkış</option>
                <option value="finance_income">Gelir İşlemleri</option>
                <option value="finance_expense">Gider İşlemleri</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Başlangıç Tarihi</label>
              <input 
                id="startDate" 
                type="date" 
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">Bitiş Tarihi</label>
              <input 
                id="endDate" 
                type="date" 
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="searchTerm" className="form-label">Arama</label>
              <input 
                id="searchTerm" 
                type="text" 
                className="form-control"
                placeholder="Açıklama, kullanıcı..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {filteredLogs.length === 0 ? (
        <div className="alert alert-info">Belirtilen kriterlere uygun işlem bulunamadı.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>İşlem Türü</th>
                <th>Açıklama</th>
                <th>Kullanıcı</th>
                <th>Detaylar</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td>{formatDate(log.date)}</td>
                  <td>
                    <span className={`badge ${
                      log.action.includes('income') ? 'bg-success' : 
                      log.action.includes('expense') ? 'bg-danger' :
                      log.action.includes('in') ? 'bg-primary' :
                      log.action.includes('out') ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {humanizeAction(log.action)}
                    </span>
                  </td>
                  <td>{log.description}</td>
                  <td>{log.performedBy}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => alert(JSON.stringify(log.details, null, 2))}
                    >
                      <i className="bi bi-info-circle"></i> Görüntüle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityLog; 