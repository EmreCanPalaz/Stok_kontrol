import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

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
}

// Context oluşturma 
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider bileşeni
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

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
    // Implement translation logic based on your needs
    return key; // Temporary return the key itself
  };

  const translateCustom = (turkishText: string, englishText: string): string => {
    // Implement custom translation logic
    return englishText; // Default to English for now
  };

  
  const value: AppContextType = {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    translate,
    translateCustom
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
