// Profile.tsx için kod
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const Profile: React.FC = () => {
  const { user, updateUser, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
    }
  }, [user]);

  const validatePassword = (password: string): boolean => {
    // En az 8 karakter, en az bir büyük harf, bir küçük harf ve bir rakam içermeli
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      setError('Mevcut şifrenizi girmelisiniz.');
      return;
    }

    if (newPassword && !validatePassword(newPassword)) {
      setError('Yeni şifre en az 8 karakter olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateUser(currentPassword, username, newPassword || undefined);
      setSuccess('Profil başarıyla güncellendi.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Profil güncelleme hatası:', err);
      setError('Profil güncellenemedi. Mevcut şifrenizi doğru girdiğinizden emin olun.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deleteConfirmPassword) {
      setError('Hesabınızı silmek için şifrenizi girmelisiniz.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await deleteAccount(deleteConfirmPassword);
      logout();
      navigate('/');
    } catch (err: any) {
      console.error('Hesap silme hatası:', err);
      setError('Hesap silinemedi. Şifrenizi doğru girdiğinizden emin olun.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Profil</h2>
          <p>Profil bilgilerinizi görüntülemek için giriş yapmalısınız.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="auth-button"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Profil Bilgileri</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <div className="user-info">
          <p><strong>E-posta:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="auth-form">
          <h3>Profil Güncelleme</h3>
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentPassword">Mevcut Şifre</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mevcut şifreniz"
                className="form-control"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Yeni Şifre (Opsiyonel)</label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifreniz"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Yeni Şifre Tekrar</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifrenizi tekrar girin"
              className="form-control"
            />
          </div>
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
          </button>
        </form>

        <div className="danger-zone">
          <h3>Tehlikeli Bölge</h3>
          <button 
            type="button" 
            className="danger-button"
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
          >
            Hesabımı Sil
          </button>

          {showDeleteConfirm && (
            <form onSubmit={handleDeleteAccount} className="auth-form">
              <div className="form-group">
                <label htmlFor="deleteConfirmPassword">Şifreniz</label>
                <input
                  type="password"
                  id="deleteConfirmPassword"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  className="form-control"
                />
                <small className="form-text text-danger">
                  Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                </small>
              </div>
              <button 
                type="submit" 
                className="danger-button" 
                disabled={loading}
              >
                {loading ? 'Siliniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;