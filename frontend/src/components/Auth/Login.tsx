import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const Login: React.FC = () => {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Beni hatırla seçeneği
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (user) {
      console.log('Kullanıcı zaten giriş yapmış, ana sayfaya yönlendiriliyor...');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log('Giriş denemesi:', email, 'Beni Hatırla:', rememberMe);
      
      await login(email, password, rememberMe); // rememberMe parametresi eklendi
      console.log('Giriş başarılı, yönlendiriliyor...');
      navigate('/');
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      setError(err.message || 'Giriş yapılamadı. E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  // Eğer kimlik doğrulama yükleniyor durumundaysa, bir yükleme göstergesi göster
  if (authLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Yükleniyor...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Giriş Yap</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifreniz"
                required
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
          
          {/* Beni Hatırla seçeneği */}
          <div className="form-group form-check">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-check-input"
            />
            <label htmlFor="rememberMe" className="form-check-label">
              Beni Hatırla
            </label>
          </div>
          
          <div className="form-links">
            <Link to="/forgot-password" className="auth-link">Şifremi Unuttum</Link>
          </div>
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Hesabınız yok mu? <Link to="/register" className="auth-link">Kayıt Ol</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;