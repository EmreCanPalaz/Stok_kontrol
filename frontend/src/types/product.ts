// Bu dosya, uygulamanızdaki veri modellerinin tek, canonical (doğru) tip tanımlarını içerir.
// AppContext ve diğer tüm componentler bu tipleri kullanmalıdır.



export interface ProductProps {
  _id: string; // Backend'den gelen ID (string)
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock: number;
  sku: string; // Stok Kodu (Stock Keeping Unit) - Backend tarafından zorunlu
  // Diğer ürün özellikleri eklenebilir (örn: barcode, lowStockThreshold)
}

export interface CartItem extends ProductProps {
  quantity: number;
}

// InventoryTransaction arayüzü - ID'ler string yapıldı
export interface InventoryTransaction {
  _id: string; // İşlem ID'si
  productId: string; // Ürün ID'si (string)
  productName: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  date: string; // Backend'den string gelebilir (ISO string formatında olması idealdir)
  createdBy: string | { // Kullanıcı ID'si veya kullanıcı nesnesi
    _id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  };
}

// FinancialTransaction arayüzü - ID'ler string yapıldı
export interface FinancialTransaction {
  _id: string; // İşlem ID'si
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // Backend'den string gelebilir (ISO string formatında olması idealdir)
  createdBy: string; // Kullanıcı ID'si veya adı
  relatedProductId?: string; // İlişkili ürün ID'si (string, isteğe bağlı)
}

// İşlem Geçmişi için model - ID'ler string yapıldı
export interface ActivityLog {
  _id: string; // Log ID'si
  action: string;
  description: string;
  details: any; // Log detayları için esnek bir tip
  performedBy: string; // Kullanıcı ID'si veya adı
  date: string; // Backend'den string gelebilir (ISO string formatında olması idealdir)
}

// Yorum ve puanlama için model - ID'ler string yapıldı
export interface Review {
  _id: string; // Yorum ID'si
  productId: string; // Ürün ID'si (string)
  userId: string; // Kullanıcı ID'si (string)
  username: string;
  rating: number;
  comment: string;
  date: string; // Backend'den string gelebilir (ISO string formatında olması idealdir)
  isApproved: boolean;
}

// Örneğin, API'den dönen generic bir response yapısı da burada tanımlanabilir
export interface ApiResponse<T> {
    data: T; // API'nin döndürdüğü ana veri
    message?: string; // Başarı veya hata mesajı
    token?: string; // Login gibi işlemler için token
    success?: boolean; // İşlemin başarılı olup olmadığı
    products?: ProductProps[]; // Ürünler listesi (bazı API yanıtlarında olabilir)
    // Diğer genel response alanları
}

// Backend'den gelen ürünler yanıtı için özel bir tip
export interface ProductsResponse {
    products: ProductProps[];
    pagination?: {
        current: number;
        pages: number;
        total: number;
        limit: number;
    };
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export interface ProductCardProps extends ProductProps {
  onAddToCart: (product: ProductProps) => void;
}
