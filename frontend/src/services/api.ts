import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  timeout: 10000 // 10 saniye timeout
});

// Request interceptor - token eklemek için
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - hata yönetimi için
api.interceptors.response.use(
  (response) => {
    console.log('API yanıtı:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API hatası:', error.config?.url, error.response?.data || error.message);
    
    // 429 hatası (Too Many Requests) için özel işlem
    if (error.response?.status === 429) {
      console.error('Rate limit aşıldı, lütfen daha sonra tekrar deneyin.');
      // Burada kullanıcıya bir bildirim gösterebilirsiniz
      return Promise.reject(error);
    }
    
    // 401 hatası için mevcut işlemi koruyun
    
// İstek sayısını sınırlamak için basit bir önbellek sistemi
const cache = new Map();

// Önbellekli GET isteği
const cachedGet = async (url: string, params = {}, cacheTime = 60000) => {
  const queryString = new URLSearchParams(params).toString();
  const cacheKey = `${url}?${queryString}`;
  
  // Önbellekte varsa ve süresi dolmamışsa kullan
  const cachedData = cache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
    return cachedData.data;
  }
  
  // Yoksa API'den al ve önbelleğe kaydet
  const response = await api.get(url, { params });
  cache.set(cacheKey, {
    data: response.data,
    timestamp: Date.now()
  });
  
  return response.data;
};

// Önbelleği temizleme fonksiyonu
const clearCache = () => {
  cache.clear();
};

export default api;
export { cachedGet, clearCache };