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
  
  // Stok takibi için fonksiyonlar
  products: ProductProps[];
  getStockStatus: (productId: number) => number;
  checkLowStockItems: () => ProductProps[];
  updateStock: (productId: number, newStock: number) => void;
  
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
  
  // Yeni state değişkenleri
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [activeAdminPanel, setActiveAdminPanel] = useState<string | null>(null);

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
  }, []); // Sadece başlangıçta çalışır

  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]); 

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
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock } 
          : product
      )
    );
  };

  // Depo Giriş-Çıkış işlemleri
  const addInventoryTransaction = (transaction: Omit<InventoryTransaction, 'id' | 'date'>) => {
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: Date.now(), // Basit bir ID oluşturma yöntemi
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
      id: Date.now(), // Basit bir ID oluşturma yöntemi
      date: new Date()
    };
    
    setFinancialTransactions(prev => [...prev, newTransaction]);
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
    // Stok takibi fonksiyonları
    products,
    getStockStatus,
    checkLowStockItems,
    updateStock,
    
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
    setActiveAdminPanel
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
