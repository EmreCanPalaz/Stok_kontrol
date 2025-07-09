import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
//import './ActivityLog.css';
import { ActivityLog } from '../../types/product';
import { format } from 'date-fns';

const ActivityLogComponent: React.FC = () => {
  const { 
    activityLogs, 
    getActivityLogsByAction,
    getActivityLogsByUser,
    getActivityLogsByDateRange,
    clearActivityLogs
  } = useAppContext();
  
  const { user } = useAppContext();
  
  const [filteredLogs, setFilteredLogs] = useState(activityLogs);
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterUser, setFilterUser] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Mevcut loglarda bulunan benzersiz action ve user listelerini alalım
  const uniqueActions = useMemo(() => {
      const actions = new Set(activityLogs.map(log => log.action));
      return ['', ...Array.from(actions)].sort(); // Boş seçenek ve sıralama
  }, [activityLogs]);

  const uniqueUsers = useMemo(() => {
       // performedBy alanı bazen 'Misafir Kullanıcı' olabilir, user objesinden gelmeyebilir
       const users = new Set(activityLogs.map(log => log.performedBy));
       return ['', ...Array.from(users)].sort(); // Boş seçenek ve sıralama
  }, [activityLogs]);
  
  // Filtre uygulamak için bir fonksiyon
  const applyFilters = () => {
    let filtered = [...activityLogs];
    
    // Eylem filtreleme
    if (filterAction) {
      filtered = filtered.filter(log => log.action === filterAction);
    }
    
    // Kullanıcı filtreleme
    if (filterUser) {
      filtered = filtered.filter(log => log.performedBy === filterUser);
    }
    
    // Tarih filtreleme
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Bitiş gününün sonuna kadar
      
      filtered = filtered.filter(log => 
        new Date(log.date) >= start && new Date(log.date) <= end
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
  }, [filterAction, filterUser, startDate, endDate, searchTerm, activityLogs]);
  
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
  
  // Tüm logları temizleme butonu handler
  const handleClearLogs = () => {
    if (window.confirm('Tüm işlem geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      clearActivityLogs(); // Context'teki fonksiyonu çağır
    }
  };
  
  // Kullanıcının admin olup olmadığını kontrol et
  const isAdmin = (): boolean => {
    return user !== null && user.role === 'admin';
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
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action || 'Tümü'}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="userFilter" className="form-label">Yapan Kullanıcı</label>
              <select 
                id="userFilter" 
                className="form-select"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              >
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user || 'Tümü'}</option>
                ))}
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
      
      {/* Temizle butonu (Admin'e özel olabilir) */}
      {isAdmin() && (
        <div className="mb-3">
          <button className="btn btn-danger btn-sm" onClick={handleClearLogs}>
            <i className="bi bi-trash"></i> Tüm Logları Temizle
          </button>
        </div>
      )}
      
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
                <tr key={log._id}>
                  <td>{formatDate(new Date(log.date))}</td>
                  <td>
                    <span className={`badge ${
                      log.action.includes('success') ? 'bg-success' :
                      log.action.includes('failed') ? 'bg-danger' :
                      log.action.includes('update') ? 'bg-warning' :
                      log.action.includes('add') ? 'bg-primary' :
                      log.action.includes('remove') ? 'bg-secondary' :
                      log.action.includes('delete') ? 'bg-danger' :
                      log.action.includes('approve') ? 'bg-success' :
                      log.action.includes('login') ? 'bg-info' :
                      log.action.includes('logout') ? 'bg-info' :
                      log.action.includes('language') ? 'bg-secondary' :
                      'bg-secondary'
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

export default ActivityLogComponent; 