import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Geçici tip tanımlamaları
export interface UserData {
  username: string;
  email: string;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  hasStockControlAccess?: boolean;
}


export interface ProductProps {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock: number;
}


export interface CartItem extends ProductProps {
  quantity: number;
}


// InventoryTransaction arayüzü için ekleme
export interface InventoryTransaction {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  type: 'in' | 'out'; // 'in' giriş, 'out' çıkış
  reason: string;
  date: Date;
  createdBy: string;
}

// FinancialTransaction arayüzü için ekleme
export interface FinancialTransaction {
  id: number;
  description: string;
  amount: number; // Pozitif değerler gelir, negatif değerler gider
  type: 'income' | 'expense';
  category: string;
  date: Date;
  createdBy: string;
  relatedProductId?: number; // İlişkili ürün, eğer varsa
}

// İşlem Geçmişi için model
export interface ActivityLog {
  id: number;
  action: string; // İşlemin türü (örn: "stock_update", "inventory_in", "finance_income")
  description: string; // İşlemin açıklaması
  details: any; // İşlemin detayları (JSON olarak saklanabilir)
  performedBy: string; // İşlemi yapan kullanıcı
  date: Date; // İşlem tarihi
}

// Yorum ve puanlama için model
export interface Review {
  id: number;
  productId: number;
  userId: string;
  username: string;
  rating: number; // 1-5 arası bir değer
  comment: string;
  date: Date;
  isApproved: boolean; // Moderasyon için
}

interface AppContextType {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (product: ProductProps) => void;
  removeFromCart: (productId: number) => void;
  updateItemQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  translate: (key: string) => string;
  translateCustom: (turkishText: string, englishText: string) => string;
  user: UserData | null;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (currentPassword: string, newUsername?: string, newPassword?: string) => boolean;
  deleteAccount: (password: string) => Promise<boolean>;
  resetPassword: (email: string) => boolean;
  submitFeedback: (rating: number, comment: string) => boolean;
  isLoading: boolean;

  // Favorites functionality
  favoriteItems: ProductProps[];
  addToFavorites: (product: ProductProps) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;

  // Stok takibi için fonksiyonlar
  products: ProductProps[];
  getStockStatus: (productId: number) => number;
  checkLowStockItems: () => ProductProps[];
  updateStock: (productId: number, newStock: number) => void;
  addProduct: (product: Omit<ProductProps, 'id'>) => ProductProps;

  // Depo Giriş-Çıkış işlemleri için
  inventoryTransactions: InventoryTransaction[];
  addInventoryTransaction: (transaction: Omit<InventoryTransaction, 'id' | 'date'>) => void;
  getInventoryTransactionsByProduct: (productId: number) => InventoryTransaction[];
  getInventoryTransactionsByType: (type: 'in' | 'out') => InventoryTransaction[];

  // Gelir Gider işlemleri için
  financialTransactions: FinancialTransaction[];
  addFinancialTransaction: (transaction: Omit<FinancialTransaction, 'id' | 'date'>) => void;
  getFinancialSummary: () => { totalIncome: number; totalExpense: number; balance: number };
  getFinancialTransactionsByCategory: (category: string) => FinancialTransaction[];
  getFinancialTransactionsByType: (type: 'income' | 'expense') => FinancialTransaction[];
  getFinancialTransactionsByDateRange: (startDate: Date, endDate: Date) => FinancialTransaction[];

  // UI State için
  activeAdminPanel: string | null;
  setActiveAdminPanel: (panel: string | null) => void;

  // İşlem Geçmişi için
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'date'>) => void;
  getActivityLogsByAction: (action: string) => ActivityLog[];
  getActivityLogsByUser: (username: string) => ActivityLog[];
  getActivityLogsByDateRange: (startDate: Date, endDate: Date) => ActivityLog[];
  clearActivityLogs: () => void; // İsteğe bağlı: Tüm logları temizleme (admin için)

  // Yorum ve Puanlama için
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => void;
  deleteReview: (reviewId: number) => void;
  approveReview: (reviewId: number) => void;
  getReviewsByProduct: (productId: number) => Review[];
  getReviewsByUser: (userId: string) => Review[];
  getAverageRating: (productId: number) => number;
}

// Context oluşturma 
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider bileşeni
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);

  // Favorites state
  const [favoriteItems, setFavoriteItems] = useState<ProductProps[]>([]);

  // Yeni state değişkenleri
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [activeAdminPanel, setActiveAdminPanel] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // TODO: Belki burada veri yapısı doğrulaması eklenebilir
        setCartItems(parsedCart);
      } catch (e) {
        console.error('Sepet verisi ayrıştırılamadı:', e);
        localStorage.removeItem('cart'); // Hatalı veriyi temizle
      }
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavoriteItems(parsedFavorites);
      } catch (e) {
        console.error('Favoriler verisi ayrıştırılamadı:', e);
        localStorage.removeItem('favorites');
      }
    }
  }, []); // Sadece başlangıçta çalışır


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);

  // Save favorites to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  // ProductList.tsx'ten örnek ürünleri context'e yükleyelim
  useEffect(() => {
    // Örnek ürünler
    const sampleProducts: ProductProps[] = [
      {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack",
        price: 109.95,
        description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        stock: 25
      },
      {
        id: 2,
        title: "Mens Casual Premium Slim Fit T-Shirts",
        price: 22.3,
        description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        stock: 8
      },
      {
        id: 3,
        title: "Women's 3-in-1 Snowboard Jacket",
        price: 56.99,
        description: "Note:The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece.",
        category: "women's clothing",
        image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
        stock: 15
      },
      {
        id: 4,
        title: "WD 2TB Elements Portable External Hard Drive",
        price: 64,
        description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10",
        category: "electronics",
        image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
        stock: 3
      },
      {
        id: 5,
        title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
        price: 999.99,
        description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY",
        category: "electronics",
        image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
        stock: 10
      },
      {
        id: 6,
        title: "Solid Gold Petite Micropave Diamond Bracelet",
        price: 168,
        description: "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.",
        category: "jewelery",
        image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
        stock: 0
      }
    ];

    setProducts(sampleProducts);
  }, []);


  const addToCart = (product: ProductProps) => {
    // Stok kontrolü yap
    const currentProduct = products.find(p => p.id === product.id);

    if (!currentProduct || currentProduct.stock <= 0) {
      alert('Bu ürün stokta bulunmamaktadır!');
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        // Mevcut miktar + 1, stok miktarını aşıyorsa uyarı ver
        const newQuantity = prevItems[existingItemIndex].quantity + 1;

        if (newQuantity > currentProduct.stock) {
          alert(`Üzgünüz, bu üründen stokta sadece ${currentProduct.stock} adet kalmıştır.`);
          return prevItems;
        }

        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // Ürün sepete eklendiğinde stok miktarını düşürme (gerçek hayatta bu işlem
    // genellikle satın alma sırasında yapılır, ama örnek olarak ekledik)
    updateStock(product.id, currentProduct.stock - 1);
  };


  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };


  const updateItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };


  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const translate = (key: string): string => {

    return key;
  };

  const translateCustom = (turkishText: string, englishText: string): string => {

    return englishText;
  };

  // Authentication methods
  const login = (email: string, password: string): boolean => {
    setIsLoading(true);
    //API çağrısı yapılacak yer


    setTimeout(() => {
      setUser({
        username: 'demo_user',
        email: email,
        isLoggedIn: true
      });
      setIsLoading(false);
    }, 1000);

    return true;
  };

  const register = (username: string, email: string, password: string): boolean => {
    setIsLoading(true);
    // API çağrısı yapılacak yer


    setTimeout(() => {
      setUser({
        username: username,
        email: email,
        isLoggedIn: true
      });
      setIsLoading(false);
    }, 1000);

    return true;
  };

  const logout = () => {
    setUser(null);
    // temizle
  };

  const updateUser = (currentPassword: string, newUsername?: string, newPassword?: string): boolean => {
    if (!user) return false;
    setIsLoading(true);

    // API çağrısı yapılacak yer 


    setTimeout(() => {
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          username: newUsername || prev.username
        };
      });
      setIsLoading(false);
    }, 1000);

    return true;
  };

  const deleteAccount = async (password: string): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);

    try {
      // API çağrısı burada yapılır
      // Bu örnek için sadece bir gecikme eklenmiştir
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Gerçek bir uygulamada burada API'ye istek yapılır
      // Eğer API çağrısı başarılı olursa, kullanıcıyı silip state'i güncelleriz

      setUser(null); // Kullanıcı state'ini temizle
      localStorage.removeItem('user'); // Depolanan kullanıcı bilgilerini temizle

      setIsLoading(false);
      return true; // Başarılı
    } catch (error) {
      console.error('Hesap silme hatası:', error);
      setIsLoading(false);
      return false; // Başarısız
    }
  };

  const resetPassword = (email: string): boolean => {
    setIsLoading(true);

    // API çağrısı yapılacak yer


    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return true;
  };

  const submitFeedback = (rating: number, comment: string): boolean => {
    setIsLoading(true);

    // API çağrısı yapılacak yer


    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return true;
  };


  // Stok durumunu getir
  const getStockStatus = (productId: number): number => {
    const product = products.find(p => p.id === productId);
    return product ? product.stock : 0;
  };

  // Stok miktarı az olan ürünleri kontrol et (stok < 10 olarak varsayıyoruz)
  const checkLowStockItems = (): ProductProps[] => {
    return products.filter(product => product.stock < 10);
  };

  // Stok miktarını güncelle
  const updateStock = (productId: number, newStock: number) => {
    const oldProduct = products.find(p => p.id === productId);

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: newStock }
          : product
      )
    );

    // İşlem logunu ekle
    if (oldProduct) {
      addActivityLog({
        action: 'stock_update',
        description: `"${oldProduct.title}" ürününün stok miktarı güncellendi`,
        details: {
          productId,
          oldStock: oldProduct.stock,
          newStock,
          productName: oldProduct.title
        },
        performedBy: user?.username || 'Misafir Kullanıcı'
      });
    }
  };

  // Depo Giriş-Çıkış işlemleri
  const addInventoryTransaction = (transaction: Omit<InventoryTransaction, 'id' | 'date'>) => {
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date()
    };

    setInventoryTransactions(prev => [...prev, newTransaction]);

    // Stok miktarını güncelle
    const product = products.find(p => p.id === transaction.productId);
    if (product) {
      const newStock = transaction.type === 'in'
        ? product.stock + transaction.quantity
        : product.stock - transaction.quantity;

      // Stok negatif olmasın
      updateStock(product.id, Math.max(0, newStock));
    }

    // İşlem logunu ekle
    addActivityLog({
      action: `inventory_${transaction.type}`,
      description: `"${transaction.productName}" için ${transaction.type === 'in' ? 'giriş' : 'çıkış'} işlemi yapıldı`,
      details: {
        ...transaction,
        productName: transaction.productName
      },
      performedBy: user?.username || 'Misafir Kullanıcı'
    });
  };

  const getInventoryTransactionsByProduct = (productId: number) => {
    return inventoryTransactions.filter(t => t.productId === productId);
  };

  const getInventoryTransactionsByType = (type: 'in' | 'out') => {
    return inventoryTransactions.filter(t => t.type === type);
  };

  // Gelir Gider işlemleri
  const addFinancialTransaction = (transaction: Omit<FinancialTransaction, 'id' | 'date'>) => {
    const newTransaction: FinancialTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date()
    };

    setFinancialTransactions(prev => [...prev, newTransaction]);

    // İşlem logunu ekle
    addActivityLog({
      action: `finance_${transaction.type}`,
      description: `${transaction.type === 'income' ? 'Gelir' : 'Gider'} işlemi: ${transaction.description}`,
      details: {
        ...transaction
      },
      performedBy: user?.username || 'Misafir Kullanıcı'
    });
  };

  const getFinancialSummary = () => {
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
  };

  const getFinancialTransactionsByCategory = (category: string) => {
    return financialTransactions.filter(t => t.category === category);
  };

  const getFinancialTransactionsByType = (type: 'income' | 'expense') => {
    return financialTransactions.filter(t => t.type === type);
  };

  const getFinancialTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    return financialTransactions.filter(t =>
      t.date >= startDate && t.date <= endDate
    );
  };

  // İşlem Geçmişi işlemleri
  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'date'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: Date.now(),
      date: new Date()
    };

    setActivityLogs(prev => [newLog, ...prev]); // Yeni log'u başa ekle

    // Gerçek uygulamada, logları localStorage veya backend'de saklayabilirsiniz
    const savedLogs = localStorage.getItem('activityLogs');
    let updatedLogs = [];

    if (savedLogs) {
      try {
        updatedLogs = [newLog, ...JSON.parse(savedLogs)];
      } catch (e) {
        updatedLogs = [newLog];
      }
    } else {
      updatedLogs = [newLog];
    }

    localStorage.setItem('activityLogs', JSON.stringify(updatedLogs));
  };

  // Sayfa yüklendiğinde localStorage'dan logları al
  useEffect(() => {
    const savedLogs = localStorage.getItem('activityLogs');
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        // Date nesnelerini string'den Date'e çevir
        const formattedLogs = parsedLogs.map((log: any) => ({
          ...log,
          date: new Date(log.date)
        }));

        setActivityLogs(formattedLogs);
      } catch (e) {
        console.error('İşlem geçmişi yüklenirken hata oluştu:', e);
        localStorage.removeItem('activityLogs');
      }
    }
  }, []); // Sadece başlangıçta çalış

  const getActivityLogsByAction = (action: string) => {
    return activityLogs.filter(log => log.action === action);
  };

  const getActivityLogsByUser = (username: string) => {
    return activityLogs.filter(log => log.performedBy === username);
  };

  const getActivityLogsByDateRange = (startDate: Date, endDate: Date) => {
    return activityLogs.filter(log =>
      log.date >= startDate && log.date <= endDate
    );
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    localStorage.removeItem('activityLogs');
  };

  // Başlangıçta localStorage'dan yorumları yükle
  useEffect(() => {
    const savedReviews = localStorage.getItem('productReviews');
    if (savedReviews) {
      try {
        const parsedReviews = JSON.parse(savedReviews);
        // Date nesnelerini string'den Date'e çevir
        const formattedReviews = parsedReviews.map((review: any) => ({
          ...review,
          date: new Date(review.date)
        }));

        setReviews(formattedReviews);
      } catch (e) {
        console.error('Yorumlar yüklenirken hata oluştu:', e);
        localStorage.removeItem('productReviews');
      }
    }
  }, []); // Sadece başlangıçta çalış

  // Yorumları localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('productReviews', JSON.stringify(reviews));
  }, [reviews]);

  // Yorum ekleme fonksiyonu
  const addReview = (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now(),
      date: new Date(),
      isApproved: false // Varsayılan olarak onaylanmamış durumda
    };

    setReviews(prev => [newReview, ...prev]);

    // İşlem loguna ekle
    addActivityLog({
      action: 'review_add',
      description: `"${products.find(p => p.id === review.productId)?.title}" ürünü için yorum eklendi`,
      details: {
        ...newReview,
        productName: products.find(p => p.id === review.productId)?.title
      },
      performedBy: user?.username || 'Misafir Kullanıcı'
    });
  };

  // Yorum silme fonksiyonu
  const deleteReview = (reviewId: number) => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);

    if (reviewToDelete) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));

      // İşlem loguna ekle
      addActivityLog({
        action: 'review_delete',
        description: `"${products.find(p => p.id === reviewToDelete.productId)?.title}" ürünü için yorum silindi`,
        details: {
          ...reviewToDelete,
          productName: products.find(p => p.id === reviewToDelete.productId)?.title
        },
        performedBy: user?.username || 'Misafir Kullanıcı'
      });
    }
  };

  // Yorum onaylama fonksiyonu
  const approveReview = (reviewId: number) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, isApproved: true }
          : review
      )
    );

    const approvedReview = reviews.find(r => r.id === reviewId);

    if (approvedReview) {
      // İşlem loguna ekle
      addActivityLog({
        action: 'review_approve',
        description: `"${products.find(p => p.id === approvedReview.productId)?.title}" ürünü için yorum onaylandı`,
        details: {
          ...approvedReview,
          productName: products.find(p => p.id === approvedReview.productId)?.title
        },
        performedBy: user?.username || 'Misafir Kullanıcı'
      });
    }
  };

  // Ürüne göre yorumları getirme fonksiyonu
  const getReviewsByProduct = (productId: number) => {
    return reviews.filter(review => review.productId === productId);
  };

  // Kullanıcıya göre yorumları getirme fonksiyonu
  const getReviewsByUser = (userId: string) => {
    return reviews.filter(review => review.userId === userId);
  };

  // Ortalama puanı hesaplama fonksiyonu
  const getAverageRating = (productId: number) => {
    const productReviews = reviews.filter(
      review => review.productId === productId && review.isApproved
    );

    if (productReviews.length === 0) return 0;

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / productReviews.length;
  };

  // Add to favorites function
  const addToFavorites = (product: ProductProps) => {
    // Check if product already exists in favorites
    if (!favoriteItems.some(item => item.id === product.id)) {
      setFavoriteItems(prev => [...prev, product]);

      // Log activity if user is logged in
      if (user && user.isLoggedIn) {
        addActivityLog({
          action: 'add_to_favorites',
          description: `Added ${product.title} to favorites`,
          details: { productId: product.id },
          performedBy: user.username
        });
      }
    }
  };

  // Remove from favorites function
  const removeFromFavorites = (productId: number) => {
    setFavoriteItems(prev => prev.filter(item => item.id !== productId));

    // Log activity if user is logged in
    if (user && user.isLoggedIn) {
      const product = products.find(p => p.id === productId);
      if (product) {
        addActivityLog({
          action: 'remove_from_favorites',
          description: `Removed ${product.title} from favorites`,
          details: { productId },
          performedBy: user.username
        });
      }
    }
  };

  // Check if a product is in favorites
  const isFavorite = (productId: number): boolean => {
    return favoriteItems.some(item => item.id === productId);
  };

  const addProduct = (product: Omit<ProductProps, 'id'>) => {
    // Yeni ürün ID'si - en büyük ID'nin bir fazlası
    const newId = products.length > 0
      ? Math.max(...products.map(p => p.id)) + 1
      : 1;

    // Yeni ürünü products listesine ekle
    const newProduct: ProductProps = {
      ...product,
      id: newId
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);

    // Aktivite loguna ekle
    addActivityLog({
      action: 'product_added',
      description: `Yeni ürün eklendi: ${product.title}`,
      details: { product: newProduct },
      performedBy: user?.username || 'Misafir Kullanıcı'
    });

    return newProduct;
  };

  const value: AppContextType = {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    translate,
    translateCustom,
    user,
    login,
    register,
    logout,
    updateUser,
    deleteAccount,
    resetPassword,
    submitFeedback,
    isLoading,

    // Favorites
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // Stok takibi için fonksiyonlar
    products,
    getStockStatus,
    checkLowStockItems,
    updateStock,
    addProduct,

    // Depo Giriş-Çıkış için
    inventoryTransactions,
    addInventoryTransaction,
    getInventoryTransactionsByProduct,
    getInventoryTransactionsByType,

    // Gelir Gider için
    financialTransactions,
    addFinancialTransaction,
    getFinancialSummary,
    getFinancialTransactionsByCategory,
    getFinancialTransactionsByType,
    getFinancialTransactionsByDateRange,

    // UI State
    activeAdminPanel,
    setActiveAdminPanel,

    // İşlem Geçmişi için
    activityLogs,
    addActivityLog,
    getActivityLogsByAction,
    getActivityLogsByUser,
    getActivityLogsByDateRange,
    clearActivityLogs,

    // Yorum ve Puanlama için
    reviews,
    addReview,
    deleteReview,
    approveReview,
    getReviewsByProduct,
    getReviewsByUser,
    getAverageRating
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
