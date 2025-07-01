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
  imageUrl?: string; // Add this line
  // Diğer ürün özellikleri eklenebilir (örn: barcode, lowStockThreshold)
}

export interface CartItem extends ProductProps {
  quantity: number;
}

// InventoryTransaction arayüzü - ID'ler string yapıldı


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



export interface ProductCardProps extends ProductProps {
  onAddToCart: (product: ProductProps) => void;
}
