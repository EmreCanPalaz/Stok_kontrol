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
  
}


export interface CartItem extends ProductProps {
  quantity: number;
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
}

// Context oluşturma 
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider bileşeni
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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


  
  const addToCart = (product: ProductProps) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
     
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
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
    isLoading
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
