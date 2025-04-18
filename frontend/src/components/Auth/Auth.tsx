import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './AuthForms.css';

// onClose prop'u
interface AuthFormsProps {
  onClose: () => void;
  initialForm?: 'login' | 'register' | 'forgotPassword' | 'deleteAccount' | 'updateUser' | 'feedback';
}

const AuthForms: React.FC<AuthFormsProps> = ({ onClose, initialForm = 'login' }) => {
  // State for different forms
  const [activeForm, setActiveForm] = useState<'login' | 'register' | 'forgotPassword' | 'deleteAccount' | 'updateUser' | 'feedback'>(initialForm);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Update User form fields
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  // Feedback form fields
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  const { user, login, register, logout, deleteAccount, isLoading } = useAppContext();

  // Component ilk render edildiğinde initialForm değerini kullan
  useEffect(() => {
    setActiveForm(initialForm);
  }, [initialForm]);

  // Login işlemi 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun!');
      setIsAuthenticating(false);
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
      setIsAuthenticating(false);
    } else if (onClose) {
      setTimeout(() => {
        setIsAuthenticating(false);
        onClose(); // Başarılı giriş sonrası kapat
      }, 1500);
    }
  };

  // Kayıt işlemi
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    if (!email || !password || !username) {
      setError('Lütfen tüm alanları doldurun!');
      setIsAuthenticating(false);
      return;
    }

    const success = register(username, email, password);
    if (!success) {
      setError('Kayıt başarısız! Lütfen farklı bilgiler deneyin.');
      setIsAuthenticating(false);
    } else if (onClose) {
      setTimeout(() => {
        setIsAuthenticating(false);
        onClose(); // Başarılı kayıt sonrası kapat
      }, 1500);
    }
  };

  // Şifre sıfırlama işlemi
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!resetEmail) {
      setError('Lütfen email adresinizi girin!');
      return;
    }

    //API çağrısı yapılacak yer
    
    setTimeout(() => {
      setSuccessMessage(`${resetEmail} adresine şifre sıfırlama bağlantısı gönderildi.`);
      setResetEmail('');
    }, 1000);
  };
  
  // Kullanıcı güncelleme işlemi
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!currentPassword) {
      setError('Değişiklik yapmak için mevcut şifrenizi girmelisiniz!');
      return;
    }
    
    if (!newUsername && !newPassword) {
      setError('Değiştirilecek en az bir alan doldurmalısınız!');
      return;
    }
    
    // API çağrısı yapılacak yer
    
    setTimeout(() => {
      setSuccessMessage('Kullanıcı bilgileriniz başarıyla güncellendi.');
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
    }, 1000);
  };
  
  // Kullanıcı silme işlemi
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!password) {
      setError('Hesabınızı silmek için şifrenizi doğrulamalısınız!');
      return;
    }
    
    setIsAuthenticating(true);
    
    // deleteAccount fonksiyonunu çağır
    const success = await deleteAccount(password);
    
    if (success) {
      setSuccessMessage('Hesabınız başarıyla silindi.');
      
      // Hesap silindikten sonra oturumu kapat
      setTimeout(() => {
        logout(); // Çıkış yap
        onClose(); // Modal'ı kapat
      }, 1500);
    } else {
      setError('Hesap silme işlemi başarısız oldu. Lütfen şifrenizi kontrol edin.');
    }
    
    setIsAuthenticating(false);
  };
  
  // Geri bildirim gönderme
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (feedbackRating === 0) {
      setError('Lütfen bir değerlendirme puanı seçin!');
      return;
    }
    
    // API çağrısı yapılacak yer
    
    setTimeout(() => {
      setSuccessMessage('Değerli geri bildiriminiz için teşekkür ederiz!');
      setFeedbackRating(0);
      setFeedbackComment('');
    }, 1000);
  };

  // Form temizleme
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setResetEmail('');
    setNewUsername('');
    setNewPassword('');
    setCurrentPassword('');
    setFeedbackRating(0);
    setFeedbackComment('');
    setError('');
    setSuccessMessage('');
  };

  // Tab butonları için - "Hesabımı Sil" butonunu burada göstermeyelim
  const renderTabButtons = () => {
    return (
      <div className="auth-forms-header">
        <button
          className={`tab-btn ${activeForm === 'login' ? 'active' : ''}`}
          onClick={() => { setActiveForm('login'); resetForm(); }}
        >
          Giriş Yap
        </button>
        <button
          className={`tab-btn ${activeForm === 'register' ? 'active' : ''}`}
          onClick={() => { setActiveForm('register'); resetForm(); }}
        >
          Kayıt Ol
        </button>
        {user && user.isLoggedIn && (
          <>
            <button
              className={`tab-btn ${activeForm === 'updateUser' ? 'active' : ''}`}
              onClick={() => { setActiveForm('updateUser'); resetForm(); }}
            >
              Bilgileri Güncelle
            </button>
            <button
              className={`tab-btn ${activeForm === 'feedback' ? 'active' : ''}`}
              onClick={() => { setActiveForm('feedback'); resetForm(); }}
            >
              Geri Bildirim
            </button>
          </>
        )}
      </div>
    );
  };
  
  // Form içi linkler için
  const renderFormFooter = () => {
    if (activeForm === 'login') {
      return (
        <>
          <p className="form-footer">
            <button type="button" className="link-btn" onClick={() => { setActiveForm('forgotPassword'); resetForm(); }}>
              Şifremi Unuttum
            </button>
          </p>
          <p className="form-footer">
            <button type="button" className="link-btn" onClick={() => { setActiveForm('register'); resetForm(); }}>
              Hesabınız yok mu? Kayıt Olun
            </button>
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="auth-forms-container">
      <div className="auth-forms-modal">
        {/* Kapatma butonu */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Tab butonları */}
        {renderTabButtons()}

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Login Form */}
        {activeForm === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isAuthenticating || isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Şifre</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isAuthenticating || isLoading}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isAuthenticating || isLoading}>
              {isAuthenticating || isLoading ? 'Kimlik Doğrulanıyor...' : 'Giriş Yap'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeForm === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="register-username">Kullanıcı Adı</label>
              <input
                type="text"
                id="register-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isAuthenticating || isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                type="email"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isAuthenticating || isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Şifre</label>
              <input
                type="password"
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isAuthenticating || isLoading}
              />
              <small className="form-text text-muted">Şifreniz en az 6 karakter olmalıdır.</small>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isAuthenticating || isLoading}>
              {isAuthenticating || isLoading ? 'Kayıt İşlemi Devam Ediyor...' : 'Kayıt Ol'}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {activeForm === 'forgotPassword' && (
          <form onSubmit={handleForgotPassword} className="auth-form">
            <h3 className="forgot-title">Şifremi Unuttum</h3>
            <div className="form-group">
              <label htmlFor="reset-email">Email Adresi</label>
              <p className="form-text">Şifre sıfırlama bağlantısı email adresinize gönderilecektir.</p>
              <input
                type="email"
                id="reset-email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Şifre Sıfırlama Bağlantısı Gönder
            </button>
            <p className="form-footer">
              <button type="button" className="link-btn" onClick={() => { setActiveForm('login'); resetForm(); }}>
                Giriş Formuna Dön
              </button>
            </p>
          </form>
        )}
        
        {/* Update User Form */}
        {activeForm === 'updateUser' && (
          <form onSubmit={handleUpdateUser} className="auth-form">
            <h3 className="form-title">Kullanıcı Bilgilerini Güncelle</h3>
            <div className="form-group">
              <label htmlFor="current-password">Mevcut Şifre</label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <small className="form-text text-muted">Değişiklik yapmak için mevcut şifrenizi girmelisiniz.</small>
            </div>
            <div className="form-group">
              <label htmlFor="new-username">Yeni Kullanıcı Adı</label>
              <input
                type="text"
                id="new-username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Yeni Şifre</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <small className="form-text text-muted">Şifreniz en az 6 karakter olmalıdır.</small>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Bilgileri Güncelle
            </button>
            <p className="form-footer">
              <button type="button" className="link-btn" onClick={() => { setActiveForm('login'); resetForm(); }}>
                Giriş Formuna Dön
              </button>
            </p>
          </form>
        )}
        
        {/* Delete Account Form */}
        {activeForm === 'deleteAccount' && (
          <form onSubmit={handleDeleteAccount} className="auth-form">
            <h3 className="form-title">Hesabı Sil</h3>
            <div className="form-group">
              <p className="warning-text">Dikkat: Bu işlem geri alınamaz ve tüm verileriniz silinecektir!</p>
              <label htmlFor="delete-password">Şifrenizi Doğrulayın</label>
              <input
                type="password"
                id="delete-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-danger btn-block">
              Hesabımı Kalıcı Olarak Sil
            </button>
            <p className="form-footer">
              <button type="button" className="link-btn" onClick={() => { setActiveForm('login'); resetForm(); }}>
                Vazgeç
              </button>
            </p>
          </form>
        )}
        
        {/* Feedback Form */}
        {activeForm === 'feedback' && (
          <form onSubmit={handleFeedbackSubmit} className="auth-form">
            <h3 className="form-title">Müşteri Geri Bildirim Anketi</h3>
            <div className="form-group">
              <label>Değerlendirme Puanı</label>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`rating-btn ${feedbackRating >= rating ? 'active' : ''}`}
                    onClick={() => setFeedbackRating(rating)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="feedback-comment">Yorumunuz</label>
              <textarea
                id="feedback-comment"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={4}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Geri Bildirim Gönder
            </button>
          </form>
        )}
        
        {/* Form altı linkler */}
        {renderFormFooter()}
      </div>
    </div>
  );
};

export default AuthForms;