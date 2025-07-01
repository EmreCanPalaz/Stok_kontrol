import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';

import api from '../services/api';


// Tüm tipleri types/product.ts'den import edin
import {
  
  ProductProps,
  CartItem,
  ApiResponse,
  ProductsResponse
} from '../types/product';

// Sadece AppContextType interface'ini tutun
interface AppContextType {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (product: ProductProps) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  translate: (key: string) => string;
  translateCustom: (turkishText: string, englishText: string) => string;
 
  isLoading: boolean;

  // Favorites functionality
  favoriteItems: ProductProps[];
  addToFavorites: (product: ProductProps) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  

  // Dil ayarları için
  language: 'tr' | 'en';
  setLanguage: (lang: 'tr' | 'en') => void;

  setProducts: (products: ProductProps[]) => void;
}

// AppContext'i oluşturun
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider bileşeni
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);

  // Favorites state
  const [favoriteItems, setFavoriteItems] = useState<ProductProps[]>([]);

  // Yeni state değişkenleri
 
  // Dil ayarı için state
  const savedLanguage = localStorage.getItem('language') as 'tr' | 'en' | null;
  const [language, setLanguage] = useState<'tr' | 'en'>(savedLanguage || 'tr');

  // İşlem Logu ekleme fonksiyonu (Diğer fonksiyonlar tarafından çağrılacak)
  

    

 

   
  // checkAuth fonksiyonunu useCallback ile sarmalayalım ve boş bağımlılık dizisi verelim
 // checkAuth'ın referansı sabit olduğu için bu useEffect sadece bir kere çalışır (mount olduğunda)

  // Ürünleri yüklemek için useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse<ProductsResponse>>('/products');
        console.log('API yanıtı:', response.data);
        
        // Backend'den gelen veri yapısını kontrol edelim
        if (response.data && response.data.success) {
          // Backend'den gelen veri yapısı: { success: true, data: { products: [...], pagination: {...} } }
          const productsData = response.data.data?.products || [];
          console.log('Yüklenen ürünler:', productsData);
          setProducts(productsData);
        } else {
          console.warn('Ürünler yüklenemedi:', response.data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Ürünleri yükleme hatası:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Sadece component mount olduğunda çalışsın

  // Kullanıcı oturumunu kontrol etme (API bağlı, useCallback eklendi)
 
 
 
  }, [ setCartItems, setFavoriteItems ]);

  

  


  const addToFavorites = useCallback((product: ProductProps) => {
    if (!favoriteItems.some(item => item._id === product._id)) {
      setFavoriteItems(prev => [...prev, product]);
      if (user && user._id) {
        addActivityLog({
          action: 'add_to_favorites_success',
          description: `"${product.title}" favorilere eklendi`,
          details: { productId: product._id, productName: product.title, userId: user._id, username: user.username },
        });
      }
    } else {
      console.warn(`Ürün zaten favorilerde: ${product.title}`);
    }
  }, [favoriteItems, user, addActivityLog, setFavoriteItems]);

  const removeFromFavorites = useCallback((productId: string) => {
    const removedProduct = favoriteItems.find(item => item._id === productId);
    setFavoriteItems(prev => prev.filter(item => item._id !== productId));
    if (user && user._id && removedProduct) {
      addActivityLog({
        action: 'remove_from_favorites_success',
        description: `"${removedProduct.title}" favorilerden çıkarıldı`,
        details: { productId: removedProduct._id, productName: removedProduct.title, userId: user._id, username: user.username },
      });
    } else if (!removedProduct) {
      console.warn(`Favorilerden çıkarılacak ürün bulunamadı: ${productId}`);
    }
  }, [favoriteItems, user, addActivityLog, setFavoriteItems]);

  const isFavorite = useCallback((productId: string): boolean => {
    return favoriteItems.some(item => item._id === productId);
  }, [favoriteItems]);

  
  }, [language,  setLanguage]);

  const translate = useCallback((key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'home': { 'tr': 'Anasayfa', 'en': 'Home' },
      'products': { 'tr': 'Ürünler', 'en': 'Products' },
      'management': { 'tr': 'Yönetim', 'en': 'Management' },
      'close_panel': { 'tr': 'Paneli Kapat', 'en': 'Close Panel' },
      'stock_tracking': { 'tr': 'Stok Takibi', 'en': 'Stock Tracking' },
      'inventory_tracking': { 'tr': 'Depo Giriş-Çıkış', 'en': 'Inventory Transactions' },
      'finance_tracking': { 'tr': 'Finans Takibi', 'en': 'Finance Tracking' },
      'activity_log': { 'tr': 'İşlem Geçmişi', 'en': 'Activity Log' },
      'review_management': { 'tr': 'Yorum Yönetimi', 'en': 'Review Management' },
      'select_language': { 'tr': 'Dil Seçimi', 'en': 'Select Language' },
      'turkish': { 'tr': 'Türkçe', 'en': 'Turkish' },
      'english': { 'tr': 'İngilizce', 'en': 'English' },
      'search_product': { 'tr': 'Ürün Ara...', 'en': 'Search product...' },
      'profile': { 'tr': 'Profil', 'en': 'Profile' },
      'feedback': { 'tr': 'Geribildirim', 'en': 'Feedback' },
      'logout': { 'tr': 'Çıkış Yap', 'en': 'Logout' },
      'login_register': { 'tr': 'Giriş/Kayıt', 'en': 'Login/Register' },
      'cart': { 'tr': 'Sepet', 'en': 'Cart' },
      'favorites': { 'tr': 'Favoriler', 'en': 'Favorites' },
      'hero_title': { 'tr': 'Stoklarınızı <br/> Kolayca Yönetin', 'en': 'Manage Your <br/> Stocks Easily' },
      'hero_subtitle': { 'tr': 'İşletmenizin envanterini etkili bir şekilde takip edin ve kontrol altında tutun.', 'en': 'Effectively track and control your business inventory.' },
      'feature_stock_tracking': { 'tr': 'Gerçek Zamanlı Stok Takibi', 'en': 'Real-time Stock Tracking' },
      'feature_analytics': { 'tr': 'Detaylı Analiz ve Raporlama', 'en': 'Detailed Analytics and Reporting' },
      'feature_alerts': { 'tr': 'Düşük Stok ve Sipariş Uyarıları', 'en': 'Low Stock and Order Alerts' },
      'explore_products': { 'tr': 'Ürünleri Keşfet', 'en': 'Explore Products' },
      'add_product': { 'tr': 'Ürün Ekle', 'en': 'Add Product' },
      'all_categories': { 'tr': 'Tüm Kategoriler', 'en': 'All Categories' },
      'all_products': { 'tr': 'Tüm Ürünler', 'en': 'All Products' },
      
      // Ana sayfa için yeni çeviri anahtarları
      'stockControlSystem': { 'tr': 'Stok Kontrol Sistemi', 'en': 'Stock Control System' },
      'modernStockSolution': { 'tr': 'Modern, hızlı ve kullanımı kolay stok yönetim çözümü', 'en': 'Modern, fast and easy-to-use stock management solution' },
      'login': { 'tr': 'Giriş Yap', 'en': 'Login' },
      'register': { 'tr': 'Kayıt Ol', 'en': 'Register' },
      'viewProducts': { 'tr': 'Ürünleri Görüntüle', 'en': 'View Products' },
      'features': { 'tr': 'Özellikler', 'en': 'Features' },
      'stockTracking': { 'tr': 'Stok Takibi', 'en': 'Stock Tracking' },
      'stockTrackingDesc': { 'tr': 'Ürünlerinizin stok durumunu gerçek zamanlı olarak takip edin ve stok seviyelerini yönetin.', 'en': 'Track your products\' stock status in real-time and manage stock levels.' },
      'detailedSearch': { 'tr': 'Detaylı Arama', 'en': 'Detailed Search' },
      'detailedSearchDesc': { 'tr': 'Gelişmiş arama özellikleri ile ürünlerinizi hızlıca bulun ve filtreleme yapın.', 'en': 'Find your products quickly and filter with advanced search features.' },
      'mobileCompatible': { 'tr': 'Mobil Uyumlu', 'en': 'Mobile Compatible' },
      'mobileCompatibleDesc': { 'tr': 'Her cihazda sorunsuz çalışan duyarlı tasarım ile her yerden erişim sağlayın.', 'en': 'Access from anywhere with responsive design that works seamlessly on every device.' },
      'reporting': { 'tr': 'Raporlama', 'en': 'Reporting' },
      'reportingDesc': { 'tr': 'Detaylı raporlar ve analizler ile işletmenizin performansını takip edin.', 'en': 'Track your business performance with detailed reports and analytics.' },
      'howItWorks': { 'tr': 'Nasıl Çalışır?', 'en': 'How It Works?' },
      'registerDesc': { 'tr': 'Hızlı ve kolay kayıt işlemi ile sisteme erişim sağlayın.', 'en': 'Access the system with a quick and easy registration process.' },
      'addProducts': { 'tr': 'Ürünleri Ekleyin', 'en': 'Add Products' },
      'addProductsDesc': { 'tr': 'Ürünlerinizi sisteme ekleyin ve kategorilere ayırın.', 'en': 'Add your products to the system and categorize them.' },
      'trackStock': { 'tr': 'Stok Takibi Yapın', 'en': 'Track Stock' },
      'trackStockDesc': { 'tr': 'Stok hareketlerini izleyin ve gerektiğinde uyarılar alın.', 'en': 'Monitor stock movements and receive alerts when necessary.' },
      'startNow': { 'tr': 'Hemen Başlayın', 'en': 'Start Now' },
      'startNowDesc': { 'tr': 'Ücretsiz hesap oluşturun ve stok yönetimini kolaylaştırın.', 'en': 'Create a free account and simplify stock management.' },
      'registerFree': { 'tr': 'Ücretsiz Kayıt Ol', 'en': 'Register for Free' },
    };
    return translations[key]?.[language] || key;
  }, [language]);

  const translateCustom = useCallback((turkishText: string, englishText: string): string => {
    return language === 'tr' ? turkishText : englishText;
  }, [language]);

  // Cart işlemleri için fonksiyonlar
  const addToCart = useCallback((product: ProductProps) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      if (existingItem) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Financial işlemleri için fonksiyonlar
  

  const contextValue = useMemo(() => ({
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    translate,
    translateCustom,
    
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    
    language,
    setLanguage: handleSetLanguage,
   
  }), [
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    translate,
    translateCustom,
    
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    
    
    getAverageRating,
    language,
    handleSetLanguage,
   
  ]);

  // Diğer useEffect'ler için de dependency array'leri düzenleyelim
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []); // Sadece bir kez çalışsın

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavoriteItems(JSON.parse(savedFavorites));
    }
  }, []); // Sadece bir kez çalışsın

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage as 'tr' | 'en');
    }
  }, []); // Sadece bir kez çalışsın

  // Cart değişikliklerini kaydeden useEffect
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Favorites değişikliklerini kaydeden useEffect
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  // Language değişikliklerini kaydeden useEffect
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
