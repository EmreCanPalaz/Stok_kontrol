import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { cachedGet } from '../services/api';
import api from '../services/api';
import { UserData } from '../types/product'; // UserData tipini import ediyoruz

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (currentPassword: string, newUsername?: string, newPassword?: string) => Promise<UserData>;
  deleteAccount: (password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  submitFeedback: (rating: number, comment: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Kullanıcı profilini sadece bir kez yükle
  useEffect(() => {
    if (!initialized) {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            setLoading(true);
            console.log('Token bulundu, profil bilgisi alınıyor...');
            
            try {
              // Önbellekli get kullanarak profil bilgisini al
              const data = await cachedGet('/auth/profile');
              console.log('Profil yanıtı:', data);
              
              if (data && data.success && data.data && data.data.user) {
                const userData = data.data.user;
                console.log('Kullanıcı profili yüklendi:', userData);
                
                setUser({
                  _id: userData.id || userData._id, // id veya _id'yi _id olarak kullan
                  username: userData.username,
                  email: userData.email,
                  role: userData.isAdmin ? 'admin' : (userData.role || 'user')
                });
              } else {
                console.error('Profil yanıtında kullanıcı bilgisi bulunamadı');
                localStorage.removeItem('token');
                setUser(null);
              }
            } catch (apiError) {
              console.error('API hatası:', apiError);
              localStorage.removeItem('token');
              setUser(null);
            }
          } else {
            console.log('Token bulunamadı, kullanıcı oturumu yok');
            setUser(null);
          }
        } catch (err) {
          console.error('Kullanıcı profili yüklenirken hata oluştu:', err);
          setError('Kullanıcı profili yüklenirken hata oluştu.');
          localStorage.removeItem('token');
          setUser(null);
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      };

      fetchUserProfile();
    }
  }, [initialized]);

  // Sayfa yenilendiğinde veya token değiştiğinde kullanıcı bilgilerini yeniden yükle
useEffect(() => {
  const handleStorageChange = () => {
    // localStorage'da token değiştiğinde yeniden profil bilgisini yükle
    setInitialized(false);
  };

  // Storage event listener ekle
  window.addEventListener('storage', handleStorageChange);

  // Component unmount olduğunda event listener'ı kaldır
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);

  // Login fonksiyonu - rememberMe parametresi eklendi
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      console.log('Login isteği gönderiliyor:', { email, password, rememberMe });
      
      // rememberMe false ise, bu parametreyi hiç göndermeyelim
      const loginData = rememberMe 
        ? { email, password, rememberMe } 
        : { email, password };
      
      const response = await api.post('/auth/login', loginData);
      console.log('Login yanıtı:', response.data);
      
      // Yanıt yapısını kontrol edelim
      if (response.data.success) {
        // Backend'den gelen token'ı localStorage'a kaydedin
        if (response.data.data && response.data.data.token) {
          localStorage.setItem('token', response.data.data.token);
          console.log('Token kaydedildi:', response.data.data.token);
          
          // Beni hatırla bilgisini de kaydedelim
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }
        } else if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          console.log('Token kaydedildi:', response.data.token);
          
          // Beni hatırla bilgisini de kaydedelim
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }
        } else {
          console.error('Token bulunamadı!');
          throw new Error('Token alınamadı');
        }
        
        // Kullanıcı bilgisini ayarlayalım
        let userData;
        if (response.data.data && response.data.data.user) {
          userData = response.data.data.user;
        } else if (response.data.user) {
          userData = response.data.user;
        }
        
        if (userData) {
          console.log('Kullanıcı bilgisi ayarlanıyor:', userData);
          
          setUser({
            _id: userData.id || userData._id, // id veya _id'yi _id olarak kullan
            username: userData.username,
            email: userData.email,
            role: userData.isAdmin ? 'admin' : (userData.role || 'user')
          });
        } else {
          console.error('Kullanıcı bilgisi bulunamadı!');
        }
        
        return response.data;
      } else {
        console.error('Başarısız yanıt:', response.data);
        throw new Error(response.data.message || 'Giriş başarısız oldu');
      }
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      setError(err.response?.data?.message || err.message || 'Giriş başarısız oldu');
      throw new Error(err.response?.data?.message || err.message || 'Giriş başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe'); // Beni hatırla bilgisini de temizle
    setUser(null);
  };

  // Register fonksiyonu
  const register = async (userData: { username: string; email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      throw new Error('Kayıt başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı güncelleme fonksiyonu
  const updateUser = async (currentPassword: string, newUsername?: string, newPassword?: string): Promise<UserData> => {
    try {
      setLoading(true);
      const response = await api.put('/auth/update-profile', {
        currentPassword,
        newUsername,
        newPassword
      });
      return response.data;
    } catch (err: any) {
      console.error('Profil güncelleme hatası:', err);
      throw new Error('Profil güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Hesap silme fonksiyonu
  const deleteAccount = async (password: string): Promise<void> => {
    try {
      setLoading(true);
      await api.post('/auth/delete-account', { password });
      localStorage.removeItem('token');
      setUser(null);
    } catch (err: any) {
      console.error('Hesap silme hatası:', err);
      throw new Error('Hesap silinemedi');
    } finally {
      setLoading(false);
    }
  };

  // Şifre sıfırlama fonksiyonu
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { email });
    } catch (err: any) {
      console.error('Şifre sıfırlama hatası:', err);
      throw new Error('Şifre sıfırlama başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  // Geri bildirim gönderme fonksiyonu
  const submitFeedback = async (rating: number, comment: string): Promise<void> => {
    try {
      setLoading(true);
      await api.post('/feedback', { rating, comment });
    } catch (err: any) {
      console.error('Geri bildirim gönderme hatası:', err);
      throw new Error('Geri bildirim gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    deleteAccount,
    resetPassword,
    submitFeedback
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};