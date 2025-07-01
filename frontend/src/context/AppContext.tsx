import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';

import api from '../services/api';


// Tüm tipleri types/product.ts'den import edin
import {
 
  ProductProps,
  CartItem,
  InventoryTransaction,
  FinancialTransaction,
 
  Review,
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
  
  

  // Favorites functionality
  favoriteItems: ProductProps[];
  addToFavorites: (product: ProductProps) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Stok takibi için fonksiyonlar
  products: ProductProps[];
  getStockStatus: (productId: string) => number;
  checkLowStockItems: (threshold?: number) => ProductProps[];
  updateStock: (productId: string, newStock: number) => Promise<void>;
  addProduct: (productData: FormData) => Promise<ProductProps>;
  updateProduct: (productId: string, productData: ProductProps) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Depo Giriş-Çıkış için
  inventoryTransactions: InventoryTransaction[];
  addInventoryTransaction: (transactionData: Omit<InventoryTransaction, '_id' | 'date' | 'createdBy' | 'productName'>) => Promise<void>;
  getInventoryTransactionsByProduct: (productId: string) => InventoryTransaction[];
  getInventoryTransactionsByType: (type: 'in' | 'out') => InventoryTransaction[];

  // Gelir Gider için
  financialTransactions: FinancialTransaction[];
  addFinancialTransaction: (transactionData: Omit<FinancialTransaction, '_id' | 'date' | 'createdBy'>) => Promise<void>;
  getFinancialSummary: () => { totalIncome: number; totalExpense: number; balance: number };
  getFinancialTransactionsByCategory: (category: string) => FinancialTransaction[];
  getFinancialTransactionsByType: (type: 'income' | 'expense') => FinancialTransaction[];
  getFinancialTransactionsByDateRange: (startDate: Date, endDate: Date) => FinancialTransaction[];

  // UI State için
  activeAdminPanel: string | null;
  setActiveAdminPanel: (panel: string | null) => void;

  // İşlem Geçmişi için
  activityLogs: ActivityLog[];
  getActivityLogsByAction: (action: string) => ActivityLog[];
  getActivityLogsByUser: (username: string) => ActivityLog[];
  getActivityLogsByDateRange: (startDate: Date, endDate: Date) => ActivityLog[];
  clearActivityLogs: () => void;

  // Yorum ve Puanlama için
  reviews: Review[];
  addReview: (reviewData: Omit<Review, '_id' | 'date' | 'isApproved' | 'userId' | 'username'>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  getReviewsByProduct: (productId: string) => Review[];
  getReviewsByUser: (userId: string) => Review[];
  getAverageRating: (productId: string) => number;

  // Dil ayarları için
  language: 'tr' | 'en';
  setLanguage: (lang: 'tr' | 'en') => void;

  setProducts: (products: ProductProps[]) => void;
}

// AppContext'i oluşturun
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider bileşeni
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { user, login: authLogin, logout: authLogout } = useAuth();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);

  // Favorites state
  const [favoriteItems, setFavoriteItems] = useState<ProductProps[]>([]);

  // Yeni state değişkenleri
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
 
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Dil ayarı için state
  const savedLanguage = localStorage.getItem('language') as 'tr' | 'en' | null;
  const [language, setLanguage] = useState<'tr' | 'en'>(savedLanguage || 'tr');

  // İşlem Logu ekleme fonksiyonu (Diğer fonksiyonlar tarafından çağrılacak)
  
    

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
 

  const getStockStatus = useCallback((productId: string): number => {
    const product = products.find(p => p._id === productId);
    return product ? product.stock : 0;
  }, [products]);

  const checkLowStockItems = useCallback((threshold: number = 10): ProductProps[] => {
    return products.filter(product => product.stock < threshold);
  }, [products]);

  const updateStock = useCallback(async (productId: string, newStock: number) => {
    setIsLoading(true);
    const oldProduct = products.find(p => p._id === productId);

    try {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId
            ? { ...product, stock: newStock }
            : product
        )
      );

      if (oldProduct) {
        ({
          action: 'stock_update_success',
          description: `"${oldProduct.title}" ürününün stok miktarı güncellendi`,
          details: {
            productId: oldProduct._id,
            oldStock: oldProduct.stock,
            newStock,
            productName: oldProduct.title
          },
        });
      }
    } catch (error: any) {
      console.error('Stok güncelleme hatası:', error);
      ({
        action: 'stock_update_failed',
        description: `"${oldProduct?.title || productId}" ürününün stok güncellemesi başarısız oldu`,
        details: {
          productId: productId,
          newStock,
          error: error.message
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [products, setProducts, addActivityLog]);

  const addInventoryTransaction = useCallback(async (transactionData: Omit<InventoryTransaction, '_id' | 'date' | 'createdBy' | 'productName'>) => {
    setIsLoading(true);
    try {
      console.log('Envanter işlemi ekleniyor:', transactionData);
      
      // Hata kontrolü ekleyin
      if (!transactionData.productId || !transactionData.type || transactionData.quantity === undefined) {
        throw new Error('Geçersiz envanter işlemi verileri');
      }
      
      // API isteğini try-catch bloğu içinde yapın
      try {
        // Backend 'in' ve 'out' yerine 'inbound' ve 'outbound' bekliyor
        const mappedType = transactionData.type === 'in' ? 'inbound' : 'outbound';
        
        const response: ApiResponse<InventoryTransaction> = await api.post('/inventory/transactions', {
          ...transactionData,
          type: mappedType
        });
        
        if (!response.data) {
          throw new Error('Sunucu geçerli veri döndürmedi');
        }
        
        const newTransaction = response.data;

         // TypeScript'in any tipini kullanarak tip uyumsuzluğunu geçici olarak aşıyoruz
         const backendType = (newTransaction as any).type;
         const frontendType = backendType === 'inbound' ? 'in' : 'out';
         const updatedTransaction = {
           ...newTransaction,
           type: frontendType as 'in' | 'out'
         };

        const product = products.find(p => p._id === transactionData.productId);
        if (!product) {
          ({
            action: `inventory_${transactionData.type}_failed`,
            description: `Depo işlemi başarısız oldu: Ürün bulunamadı (${transactionData.productId})`,
            details: { ...transactionData },
          });
          throw new Error(`Ürün bulunamadı: ${transactionData.productId}`);
        }

        const calculatedNewStock = transactionData.type === 'in'
          ? product.stock + transactionData.quantity
          : product.stock - transactionData.quantity;
        await updateStock(product._id, Math.max(0, calculatedNewStock));

        setInventoryTransactions(prev => [...prev, updatedTransaction]);

        ({
          action: `inventory_${frontendType}_success`,
          description: `"${newTransaction.productName}" için ${frontendType === 'in' ? 'giriş' : 'çıkış'} işlemi yapıldı`,
          details: { ...updatedTransaction, productId: updatedTransaction.productId, productName: updatedTransaction.productName },
        });
      } catch (error: any) {
        console.error('Depo işlemi hatası:', error);
       ({
          action: `inventory_${transactionData.type}_failed`,
          description: `Depo işlemi başarısız oldu: ${error.message}`,
          details: { ...transactionData, error: error.message },
        });
        throw error;
      }
    } catch (error: any) {
      console.error('Envanter işlemi hatası:', error);
      ({
        action: 'inventory_add_failed',
        description: `Envanter işlemi başarısız oldu: ${error.message}`,
        details: { ...transactionData, error: error.message },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [products, updateStock, setIsLoading, setInventoryTransactions, addActivityLog]);

  const getInventoryTransactionsByProduct = useCallback((productId: string): InventoryTransaction[] => {
    return inventoryTransactions.filter(t => t.productId === productId);
  }, [inventoryTransactions]);

  const getInventoryTransactionsByType = useCallback((type: 'in' | 'out'): InventoryTransaction[] => {
    return inventoryTransactions.filter(t => t.type === type);
  }, [inventoryTransactions]);

  const getFinancialSummary = useCallback(() => {
    const totalIncome = financialTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = financialTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [financialTransactions]);

  const getFinancialTransactionsByCategory = useCallback((category: string): FinancialTransaction[] => {
    return financialTransactions.filter(t => t.category === category);
  }, [financialTransactions]);

  const getFinancialTransactionsByType = useCallback((type: 'income' | 'expense'): FinancialTransaction[] => {
    return financialTransactions.filter(t => t.type === type);
  }, [financialTransactions]);

  const getFinancialTransactionsByDateRange = useCallback((startDate: Date, endDate: Date): FinancialTransaction[] => {
    return financialTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (isNaN(transactionDate.getTime())) {
        console.warn("Geçersiz tarih formatı:", t.date);
        return false;
      }
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [financialTransactions]);

  

  const getReviewsByProduct = useCallback((productId: string): Review[] => {
    return reviews.filter(review => review.productId === productId);
  }, [reviews]);

  const getReviewsByUser = useCallback((userId: string): Review[] => {
    return reviews.filter(review => review.userId === userId);
  }, [reviews]);

  const getAverageRating = useCallback((productId: string): number => {
    const productReviews = reviews.filter(
      review => review.productId === productId && review.isApproved
    );

    if (productReviews.length === 0) return 0;

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((totalRating / productReviews.length).toFixed(1));
  }, [reviews]);

  const addToFavorites = useCallback((product: ProductProps) => {
    if (!favoriteItems.some(item => item._id === product._id)) {
      setFavoriteItems(prev => [...prev, product]);
      
    } else {
      console.warn(`Ürün zaten favorilerde: ${product.title}`);
    }
  }, [favoriteItems, user, addActivityLog, setFavoriteItems]);

  const removeFromFavorites = useCallback((productId: string) => {
    const removedProduct = favoriteItems.find(item => item._id === productId);
    setFavoriteItems(prev => prev.filter(item => item._id !== productId));
    
    } else if (!removedProduct) {
      console.warn(`Favorilerden çıkarılacak ürün bulunamadı: ${productId}`);
    }
  }, [favoriteItems, user, addActivityLog, setFavoriteItems]);

  const isFavorite = useCallback((productId: string): boolean => {
    return favoriteItems.some(item => item._id === productId);
  }, [favoriteItems]);

  const addProduct = useCallback(async (productData: FormData): Promise<ProductProps> => {
    setIsLoading(true);
    try {
      // FormData'yı doğrudan gönderelim, JSON'a dönüştürmeden
      console.log('API\'ye gönderilen FormData:', {
        title: productData.get('title'),
        price: productData.get('price'),
        description: productData.get('description'),
        category: productData.get('category'),
        sku: productData.get('sku'),
        stock: productData.get('stock'),
        image: productData.get('image'),
        imageUrl: productData.get('imageUrl')
      });
      
      // Content-Type header'ı otomatik olarak multipart/form-data olarak ayarlanacak
      const response: ApiResponse<ProductProps> = await api.post('/products', productData);
      const newProduct = response.data;

      // Backend'den dönen veriyi kontrol et
      console.log('Backend\'den dönen ürün:', newProduct);

      // Frontend'de kullanmak için image alanını ekleyelim
      const newProductWithImage = {
        ...newProduct,
        // Eğer backend'den gelen image varsa onu kullan, yoksa FormData'dan al
        image: newProduct.image || productData.get('imageUrl') as string || '',
        // Price değerinin sayı olduğundan emin olalım
        price: typeof newProduct.price === 'number' ? newProduct.price : 
               typeof newProduct.price === 'string' ? parseFloat(newProduct.price) : 0
      };

      console.log('Frontend\'de kullanılacak ürün:', newProductWithImage);

      setProducts(prevProducts => [...prevProducts, newProductWithImage]);

      addActivityLog({
        action: 'product_added_success',
        description: `Yeni ürün eklendi: "${newProduct.title}"`,
        details: { productId: newProduct._id, productName: newProduct.title, createdBy: user?.username },
      });

      return newProductWithImage;
    } catch (error: any) {
      // Hata detaylarını daha ayrıntılı loglayalım
      console.error('Ürün ekleme hatası:', error);
      console.error('Hata yanıtı:', error.response?.data);
      console.error('Hata durumu:', error.response?.status);
      
      addActivityLog({
        action: 'product_add_failed',
        description: `Ürün ekleme başarısız oldu: ${error.message}`,
        details: { 
          title: productData.get('title'), 
          error: error.message, 
          errorDetails: error.response?.data,
          createdBy: user?.username 
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setProducts, addActivityLog, user]);

  const updateProduct = useCallback(async (productId: string, productData: ProductProps): Promise<void> => {
    setIsLoading(true);
    try {
      // API isteği gönder
      const response: ApiResponse<ProductProps> = await api.put(`/products/${productId}`, productData);
      const updatedProduct = response.data;

      // Ürün listesini güncelle
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId ? updatedProduct : product
        )
      );

      // İşlem logu ekle
     
    } catch (error: any) {
      console.error('Ürün güncelleme hatası:', error);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setProducts, addActivityLog, user]);

  const deleteProduct = useCallback(async (productId: string): Promise<void> => {
    setIsLoading(true);
    const productToDelete = products.find(p => p._id === productId);
    
    try {
      // API isteği gönder
      await api.delete(`/products/${productId}`);
      
      // Ürün listesini güncelle
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
      
      // İşlem logu ekle
      if (productToDelete) {
       ({
          action: 'product_delete_success',
          description: `Ürün silindi: "${productToDelete.title}"`,
          details: { 
            productId, 
            productName: productToDelete.title, 
            deletedBy: user?.username 
          },
        });
      }
    } catch (error: any) {
      console.error('Ürün silme hatası:', error);
     ({
        action: 'product_delete_failed',
        description: `Ürün silme başarısız oldu: ${error.message}`,
        details: { 
          productId, 
          productName: productToDelete?.title || 'Bilinmeyen ürün', 
          error: error.message, 
          deletedBy: user?.username 
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [products, setIsLoading, setProducts, addActivityLog, user]);

  const handleSetLanguage = useCallback((lang: 'tr' | 'en') => {
    const oldLanguage = language;
    setLanguage(lang);
    localStorage.setItem('language', lang);

    addActivityLog({
      action: 'language_change_success',
      description: `Dil değiştirildi: ${lang === 'tr' ? 'Türkçe' : 'İngilizce'}`,
      details: { previousLanguage: oldLanguage, newLanguage: lang },
    });
  }, [language, addActivityLog, setLanguage]);

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
  const addFinancialTransaction = useCallback(async (transactionData: Omit<FinancialTransaction, '_id' | 'date' | 'createdBy'>) => {
    try {
      const newTransaction: Omit<FinancialTransaction, '_id'> = {
        ...transactionData,
        date: new Date().toISOString(),
        createdBy: user?._id || 'system'
      };
      
      const response = await api.post<ApiResponse<FinancialTransaction>>('/financial', newTransaction);
      
      if (response.data.data) {
        setFinancialTransactions(prev => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error('Error adding financial transaction:', error);
      throw error;
    }
  }, [user]);

  // Reviews state'ini güncelleyen fonksiyon
  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/reviews', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        }
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata oluştu:', error);
    }
  }, []);

  // Uygulama başladığında yorumları yükle
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Review işlemleri için fonksiyonlar
  const addReview = useCallback(async (reviewData: Omit<Review, '_id' | 'date' | 'isApproved' | 'userId' | 'username'>) => {
    try {
      console.log('Yorum ekleme isteği gönderiliyor:', reviewData);
      
      // Health check endpoint'ini test edelim
      try {
        const healthResponse = await fetch('http://localhost:5001/api/health', {
          method: 'GET'
        });
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('Health check başarılı:', healthData);
          
          // Şimdi normal reviews endpoint'ini deneyelim
          const newReview = {
            ...reviewData,
            date: new Date().toISOString(),
            isApproved: false,
            userId: user?._id || '',
            username: user?.username || 'Anonymous'
          };
          
          const reviewResponse = await fetch('http://localhost:5001/api/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newReview)
          });
          
          if (reviewResponse.ok) {
            const responseData = await reviewResponse.json();
            console.log('Yorum başarıyla eklendi:', responseData);
            
            if (responseData.success && responseData.data) {
              setReviews(prev => [...prev, responseData.data]);
              
              // Yorumlar başarıyla eklendiğinde tüm yorumları yeniden yükle
              await fetchReviews();
            }
            return responseData;
          } else {
            const errorData = await reviewResponse.json();
            console.error('Yorum eklenirken hata:', errorData);
            throw new Error(errorData.message || 'Yorum eklenirken bir hata oluştu');
          }
        } else {
          console.error('Health check başarısız:', healthResponse.statusText);
          throw new Error('Backend sunucusuna erişilemiyor');
        }
      } catch (error) {
        console.error('Backend bağlantı hatası:', error);
        throw error;
      }
    } catch (error) {
      console.error('Yorum ekleme hatası:', error);
      throw error;
    }
  }, [user, fetchReviews]);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      setReviews(prev => prev.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }, []);

  const approveReview = useCallback(async (reviewId: string) => {
    try {
      await api.patch(`/api/reviews/${reviewId}/approve`);
      setReviews(prev =>
        prev.map(review =>
          review._id === reviewId
            ? { ...review, isApproved: true }
            : review
        )
      );
    } catch (error) {
      console.error('Error approving review:', error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(() => ({
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    translate,
    translateCustom,
   
    isLoading,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    products,
    getStockStatus,
    checkLowStockItems,
    updateStock,
    addProduct,
    updateProduct,
    deleteProduct,
    inventoryTransactions,
    addInventoryTransaction,
    getInventoryTransactionsByProduct,
    getInventoryTransactionsByType,
    financialTransactions,
    addFinancialTransaction,
    getFinancialSummary,
    totalIncome: getFinancialSummary().totalIncome,
    totalExpense: getFinancialSummary().totalExpense,
    balance: getFinancialSummary().balance,
    getFinancialTransactionsByCategory,
    getFinancialTransactionsByType,
    getFinancialTransactionsByDateRange,
    
    reviews,
    addReview,
    deleteReview,
    approveReview,
    getReviewsByProduct,
    getReviewsByUser,
    getAverageRating,
    language,
    setLanguage: handleSetLanguage,
    setProducts,
  }), [
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    translate,
    translateCustom,
    
    isLoading,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    products,
    getStockStatus,
    checkLowStockItems,
    updateStock,
    addProduct,
    updateProduct,
    deleteProduct,
    inventoryTransactions,
    addInventoryTransaction,
    getInventoryTransactionsByProduct,
    getInventoryTransactionsByType,
    financialTransactions,
    addFinancialTransaction,
    getFinancialSummary,
    getFinancialTransactionsByCategory,
    getFinancialTransactionsByType,
    getFinancialTransactionsByDateRange,
   
    reviews,
    addReview,
    deleteReview,
    approveReview,
    getReviewsByProduct,
    getReviewsByUser,
    getAverageRating,
    language,
    handleSetLanguage,
    setProducts,
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
