import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Auth.css';
import { UserData } from '../../types/product'; // UserData tipini import edin

const Auth: React.FC = () => {
  // resetPassword fonksiyonunu useAppContext hook'undan alın
  const { user, login, register, logout, updateUser, deleteAccount, resetPassword, isLoading } = useAppContext();
  const [activeForm, setActiveForm] = useState('login'); // 'login', 'register', 'updateUser', 'deleteAccount', 'resetPassword'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Yükleme state'i

  // LoginForm ve RegisterForm component'lerinde yönetilecek state'ler
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Güncelleme state'leri
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Şifre sıfırlama state'i
  const [resetEmail, setResetEmail] = useState('');

  // UseEffect ile component yüklendiğinde yapılacaklar
  useEffect(() => {
    // Kullanıcı varsa, default olarak profil görünümünü açabiliriz
    if (user) {
      setActiveForm('profile'); // Kullanıcı girişi yapılıysa direkt profil sayfasını göster
    } else {
      setActiveForm('login'); // Kullanıcı yoksa giriş formunu göster
    }
    // Bağımlılık: user
  }, [user]);

  // Formları temizleme yardımcı fonksiyonu
  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setCurrentPassword('');
    setNewUsername('');
    setNewPassword('');
    setResetEmail('');
    setError('');
    setSuccess('');
  };

  // Tab değiştirme
  const handleTabClick = (form: string) => {
    resetForms();
    setActiveForm(form);
  };

  // --- Login Handling ---
  const handleLogin = async () => {
    setIsAuthenticating(true);
    setError('');
    setSuccess('');
    try {
      await login(loginEmail, loginPassword); // login fonksiyonu async
      setSuccess('Giriş başarılı!');
      // Başarılı giriş sonrası yönlendirme yapılabilir
      // Örneğin: history.push('/');
       // Kullanıcı giriş yaptıktan sonra formu kapat veya başka bir panele geç
       setActiveForm('profile'); // Örneğin profil panelini aç
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // --- Register Handling ---
  const handleRegister = async () => {
    setIsAuthenticating(true);
    setError('');
    setSuccess('');
    try {
      // register fonksiyonu username, email, password alacak şekilde güncellendi
      await register({ username: registerUsername, email: registerEmail, password: registerPassword });
      setSuccess('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      // Kayıt sonrası giriş formına geç
      setActiveForm('login');
       // Form alanlarını temizle
       setRegisterUsername('');
       setRegisterEmail('');
       setRegisterPassword('');

    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız! Lütfen farklı bilgiler deneyin.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // --- Update User Handling ---
  const handleUpdateUser = async () => {
      setIsAuthenticating(true);
      setError('');
      setSuccess('');
      try {
          // updateUser fonksiyonu async
          const updatedUser = await updateUser(currentPassword, newUsername, newPassword);
          setSuccess('Profil başarıyla güncellendi!');
           // Form alanlarını temizle
           setCurrentPassword('');
           setNewUsername('');
           setNewPassword('');
           // Güncellenmiş kullanıcı bilgisini konsola bas (kontrol için)
           console.log('Profil güncellendi:', updatedUser);

      } catch (err: any) {
          setError(err.message || 'Profil güncelleme başarısız! Şifrenizi kontrol edin.');
      } finally {
          setIsAuthenticating(false);
      }
  };

  // --- Delete Account Handling ---
  const handleDeleteAccount = async () => {
       // Şifre boşsa veya onaylanmazsa işlemi iptal et
       if (!currentPassword) {
           setError('Lütfen hesabınızı silmek için şifrenizi girin.');
           return;
       }
       if (!window.confirm('Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
           return; // Kullanıcı vazgeçti
       }


      setIsAuthenticating(true);
      setError('');
      setSuccess('');
      try {
          // deleteAccount fonksiyonu async
          await deleteAccount(currentPassword); // Sadece güncel şifre gerekli olabilir
          setSuccess('Hesap başarıyla silindi.');
           // Hesap silindikten sonra giriş formuna yönlendir
           setActiveForm('login');
           // Form alanlarını temizle
           setCurrentPassword('');

      } catch (err: any) {
          setError(err.message || 'Hesap silme başarısız! Şifrenizi kontrol edin.');
      } finally {
          setIsAuthenticating(false);
      }
  };

   // --- Reset Password Handling ---
   const handleResetPassword = async () => {
        setIsAuthenticating(true);
        setError('');
        setSuccess('');
        if (!resetEmail) {
             setError('Lütfen şifresini sıfırlamak istediğiniz e-posta adresini girin.');
             setIsAuthenticating(false);
             return;
        }
        try {
            // resetPassword fonksiyonu async
            await resetPassword(resetEmail);
            setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi (Eğer kayıtlı ise).');
             // Form alanını temizle
             setResetEmail('');

        } catch (err: any) {
             // Şifre sıfırlama hataları genellikle güvenlik nedeniyle spesifik bilgi vermez
            setError(err.message || 'Şifre sıfırlama sırasında bir hata oluştu.');
        } finally {
            setIsAuthenticating(false);
        }
   };


  // Kullanıcı giriş yapmışsa veya yapmamışsa gösterilecek formları render et
  const renderForm = () => {
    if (isLoading || isAuthenticating) { // Hem context loading hem de yerel authenticating kontrol edilebilir
      return <div className="loading-message">Yükleniyor...</div>;
    }


    if (user) {
      // Kullanıcı giriş yapmışsa profil veya ayarlar formları
      switch (activeForm) {
         case 'profile':
             return (
                 <div className="auth-form-container">
                     <h2>Profil Bilgileri</h2>
                     <p>Kullanıcı Adı: {user.username}</p>
                     <p>Email: {user.email}</p>
                      <p>Rol: {user.role}</p> {/* Rol bilgisini göster */}
                     <button className="btn btn-primary me-2" onClick={() => handleTabClick('updateUser')}>Profil Güncelle</button>
                     <button className="btn btn-danger" onClick={() => handleTabClick('deleteAccount')}>Hesabı Sil</button>
                 </div>
             );
         case 'updateUser':
             return (
                 <div className="auth-form-container">
                     <h2>Profil Güncelle</h2>
                     {/* Güncel şifre alanı */}
                     <div className="form-group">
                         <label htmlFor="currentPassword">Güncel Şifre:</label>
                         <input
                             id="currentPassword"
                             type="password"
                             value={currentPassword}
                             onChange={(e) => setCurrentPassword(e.target.value)}
                             required
                              className="form-control"
                         />
                     </div>
                     {/* Yeni kullanıcı adı (isteğe bağlı) */}
                     <div className="form-group">
                         <label htmlFor="newUsername">Yeni Kullanıcı Adı (Opsiyonel):</label>
                         <input
                             id="newUsername"
                             type="text"
                             value={newUsername}
                             onChange={(e) => setNewUsername(e.target.value)}
                              className="form-control"
                         />
                     </div>
                      {/* Yeni şifre (isteğe bağlı) */}
                     <div className="form-group">
                         <label htmlFor="newPassword">Yeni Şifre (Opsiyonel):</label>
                         <input
                             id="newPassword"
                             type="password"
                             value={newPassword}
                             onChange={(e) => setNewPassword(e.target.value)}
                              className="form-control"
                         />
                     </div>
                      <button className="btn btn-success me-2" onClick={handleUpdateUser}>Güncelle</button>
                      <button className="btn btn-secondary" onClick={() => handleTabClick('profile')}>İptal</button>
                 </div>
             );
         case 'deleteAccount':
              return (
                 <div className="auth-form-container">
                     <h2>Hesabı Sil</h2>
                     <p>Hesabınızı kalıcı olarak silmek için şifrenizi girin.</p>
                     {/* Güncel şifre alanı */}
                     <div className="form-group">
                         <label htmlFor="deletePassword">Şifreniz:</label>
                         <input
                             id="deletePassword"
                             type="password"
                             value={currentPassword} // Yine currentPassword state'ini kullanabiliriz
                             onChange={(e) => setCurrentPassword(e.target.value)}
                             required
                              className="form-control"
                         />
                     </div>
                     <button onClick={handleDeleteAccount} className="btn btn-danger me-2">Hesabı Sil</button>
                     <button onClick={() => handleTabClick('profile')} className="btn btn-secondary">İptal</button>
                 </div>
             );
         default:
             // Kullanıcı giriş yaptıysa ve belirli bir form aktif değilse varsayılan görünüm (Hoş Geldiniz mesajı)
             return (
                 <div className="auth-form-container">
                     <h2>Hoş Geldiniz, {user.username}!</h2>
                     <p>Email: {user.email}</p>
                      <p>Rol: {user.role}</p> {/* Rol bilgisini göster */}
                      <button className="btn btn-primary me-2" onClick={() => handleTabClick('profile')}>Profil Yönetimi</button>
                     <button className="btn btn-danger" onClick={logout}>Çıkış Yap</button>
                 </div>
             );
      }

    } else {
      // Kullanıcı giriş yapmamışsa giriş veya kayıt formları
      switch (activeForm) {
        case 'login':
          return (
             <div className="auth-form-container">
                 <h2>Giriş Yap</h2>
                 <div className="form-group">
                     <label htmlFor="loginEmail">Email:</label>
                     <input id="loginEmail" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="form-control" />
                 </div>
                 <div className="form-group">
                     <label htmlFor="loginPassword">Şifre:</label>
                     <input id="loginPassword" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="form-control" />
                 </div>
                 <button className="btn btn-primary me-2" onClick={handleLogin}>Giriş Yap</button>
                  <button className="btn btn-link" onClick={() => handleTabClick('resetPassword')}>Şifremi Unuttum</button> {/* Şifre sıfırlama butonu */}
             </div>
          );
        case 'register':
          return (
             <div className="auth-form-container">
                 <h2>Kayıt Ol</h2>
                  <div className="form-group">
                     <label htmlFor="registerUsername">Kullanıcı Adı:</label> {/* Backend username bekliyor */}
                     <input id="registerUsername" type="text" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} required className="form-control" />
                  </div>
                 <div className="form-group">
                     <label htmlFor="registerEmail">Email:</label>
                     <input id="registerEmail" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required className="form-control" />
                 </div>
                 <div className="form-group">
                     <label htmlFor="registerPassword">Şifre:</label>
                     <input id="registerPassword" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required className="form-control" />
                 </div>
                 <button className="btn btn-primary me-2" onClick={handleRegister}>Kayıt Ol</button>
                  <button className="btn btn-link" onClick={() => handleTabClick('login')}>Giriş Sayfasına Dön</button>
             </div>
          );
         case 'resetPassword':
             return (
                 <div className="auth-form-container">
                     <h2>Şifremi Unuttum</h2>
                      <div className="form-group">
                         <label htmlFor="resetEmail">Email Adresiniz:</label>
                         <input id="resetEmail" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required className="form-control" />
                     </div>
                     <button className="btn btn-primary me-2" onClick={handleResetPassword}>Şifre Sıfırlama Linki Gönder</button>
                      <button className="btn btn-link" onClick={() => handleTabClick('login')}>Giriş Sayfasına Dön</button>
                 </div>
             );
        default:
          return null;
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        {/* Kullanıcı giriş yapmamışsa */}
        {!user && (
          <>
            <button
              className={`tab-btn ${activeForm === 'login' ? 'active' : ''}`}
              onClick={() => handleTabClick('login')}
            >
              Giriş Yap
            </button>
            <button
              className={`tab-btn ${activeForm === 'register' ? 'active' : ''}`}
              onClick={() => handleTabClick('register')}
            >
              Kayıt Ol
            </button>
             {/* Şifre sıfırlama tab'ı (isteğe bağlı olarak burada veya giriş formunda buton olarak gösterilebilir) */}
             {/* <button
                className={`tab-btn ${activeForm === 'resetPassword' ? 'active' : ''}`}
                onClick={() => handleTabClick('resetPassword')}
              >
                Şifre Sıfırla
              </button> */}
          </>
        )}

         {/* Kullanıcı giriş yapmışsa */}
         {user && ( // user null değilse menüyü göster
             <>
                 <button
                    className={`tab-btn ${activeForm === 'profile' ? 'active' : ''}`}
                     onClick={() => handleTabClick('profile')}
                  >
                     Profil
                 </button>
                  {/* user.isAdmin veya user.role === 'admin' gibi kontroller buraya eklenebilir */}
                 {user.role === 'admin' && ( // Örneğin sadece admin ise user listesi göster
                      <button
                         className={`tab-btn ${activeForm === 'adminUsers' ? 'active' : ''}`}
                         onClick={() => handleTabClick('adminUsers')}
                       >
                         Kullanıcılar (Admin)
                      </button>
                 )}
                 {/* Diğer yönetici rolleri veya menü öğeleri */}
                 <button className="tab-btn" onClick={logout}>Çıkış Yap</button>
             </>
         )}


      </div>
      <div className="auth-forms">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {renderForm()}
      </div>
    </div>
  );
};

export default Auth;