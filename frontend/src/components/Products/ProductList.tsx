import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ProductProps } from '../../types/product';
import { useAppContext } from '../../context/AppContext';
import ProductFilters from './ProductFilters';
import ProductSort from './ProductSort';
<<<<<<< HEAD
=======
import BarcodeScanner from '../Admin/BarcodeScanner';
>>>>>>> e0c8134 (third one commit)
import ProductCard from './ProductCard'; // ProductCard bileşenini import et
import './ProductList.css';

interface ProductListProps {
  products?: ProductProps[];
  onAddToCart?: (product: ProductProps) => void;
<<<<<<< HEAD
  onAddToCart?: (product: ProductProps) => void;
=======
>>>>>>> e0c8134 (third one commit)
}

const ProductList: React.FC<ProductListProps> = ({ 
  products: propProducts, 
  onAddToCart: propOnAddToCart 
}) => {
  const { products: contextProducts, addToCart } = useAppContext();
  
  // URL'den arama parametresini al
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromUrl = searchParams.get('search') || '';
  
  // Props'tan gelen değerler varsa onları kullan, yoksa context'ten al
  const finalProducts = propProducts || contextProducts;
  const handleAddToCart = propOnAddToCart || addToCart;

  // Arama terimi için state
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);

  // Filtrelenmiş ürünler için state
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>(finalProducts || []);
  
  // Sıralanmış ürünler için state
  const [sortedProducts, setSortedProducts] = useState<ProductProps[]>(filteredProducts || []);
  
  // Barkod tarayıcı için state
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  // Görünüm modu için state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid'); // Varsayılan olarak grid görünümü

  // URL'den gelen arama parametresi değiştiğinde arama terimini güncelle
<<<<<<< HEAD
const ProductList: React.FC<ProductListProps> = ({ 
  products: propProducts, 
  onAddToCart: propOnAddToCart 
}) => {
  const { products: contextProducts, addToCart } = useAppContext();
  
  // URL'den arama parametresini al
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromUrl = searchParams.get('search') || '';
  
  // Props'tan gelen değerler varsa onları kullan, yoksa context'ten al
  const finalProducts = propProducts || contextProducts;
  const handleAddToCart = propOnAddToCart || addToCart;

  // Arama terimi için state
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);

  // Filtrelenmiş ürünler için state
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>(finalProducts || []);
  
  // Sıralanmış ürünler için state
  const [sortedProducts, setSortedProducts] = useState<ProductProps[]>(filteredProducts || []);
  
  // Barkod tarayıcı için state
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  // Görünüm modu için state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid'); // Varsayılan olarak grid görünümü

  // URL'den gelen arama parametresi değiştiğinde arama terimini güncelle
=======
>>>>>>> e0c8134 (third one commit)
  useEffect(() => {
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchFromUrl]);

  // Products değiştiğinde filteredProducts'ı güncelle
  useEffect(() => {
    setFilteredProducts(finalProducts || []);
  }, [finalProducts]);

  // Filtreleme işlemi
  const handleFilterChange = (newFilteredProducts: ProductProps[]) => {
    setFilteredProducts(newFilteredProducts);
  };
  
  // Sıralama işlemi
  const handleSortChange = (newSortedProducts: ProductProps[]) => {
    setSortedProducts(newSortedProducts);
  };
  
  // Filtreleme değiştiğinde sıralamayı güncelle
  useEffect(() => {
    setSortedProducts(filteredProducts || []);
  }, [filteredProducts]);

  // Barkod tarama işlemleri
  const handleOpenScanner = () => {
    setShowScanner(true);
    setScannerError(null);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  const handleProductFound = (scannedProduct: ProductProps) => {
    // Taranan barkoda sahip ürünü bul
    const foundProduct = finalProducts.find(p => p._id === scannedProduct._id);
    
    if (foundProduct) {
      // Ürün bulunduğunda, sadece o ürünü göster
      setFilteredProducts([foundProduct]);
      setSortedProducts([foundProduct]);
    } else {
      // Ürün bulunamadığında hata mesajı göster
      setScannerError(`Barkod (${scannedProduct._id}) ile eşleşen ürün bulunamadı.`);
      setTimeout(() => setScannerError(null), 5000); // 5 saniye sonra hata mesajını kaldır
    }
  };

  const handleScanError = (error: Error) => {
    setScannerError(`Tarama hatası: ${error.message}`);
    setTimeout(() => setScannerError(null), 5000); // 5 saniye sonra hata mesajını kaldır
  };

  // Arama işlevselliği
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    const filteredProducts = finalProducts.filter(product => {
      return product.title.toLowerCase().includes(newSearchTerm.toLowerCase());
    });
    setFilteredProducts(filteredProducts);
  };

  if (!finalProducts || finalProducts.length === 0) {
    return <div className="empty-products">Ürün bulunamadı.</div>;
  }
<<<<<<< HEAD
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchFromUrl]);

  // Products değiştiğinde filteredProducts'ı güncelle
  useEffect(() => {
    setFilteredProducts(finalProducts || []);
  }, [finalProducts]);

  // Filtreleme işlemi
  const handleFilterChange = (newFilteredProducts: ProductProps[]) => {
    setFilteredProducts(newFilteredProducts);
  };
  
  // Sıralama işlemi
  const handleSortChange = (newSortedProducts: ProductProps[]) => {
    setSortedProducts(newSortedProducts);
  };
  
  // Filtreleme değiştiğinde sıralamayı güncelle
  useEffect(() => {
    setSortedProducts(filteredProducts || []);
  }, [filteredProducts]);

  // Barkod tarama işlemleri
  const handleOpenScanner = () => {
    setShowScanner(true);
    setScannerError(null);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  const handleProductFound = (scannedProduct: ProductProps) => {
    // Taranan barkoda sahip ürünü bul
    const foundProduct = finalProducts.find(p => p._id === scannedProduct._id);
    
    if (foundProduct) {
      // Ürün bulunduğunda, sadece o ürünü göster
      setFilteredProducts([foundProduct]);
      setSortedProducts([foundProduct]);
    } else {
      // Ürün bulunamadığında hata mesajı göster
      setScannerError(`Barkod (${scannedProduct._id}) ile eşleşen ürün bulunamadı.`);
      setTimeout(() => setScannerError(null), 5000); // 5 saniye sonra hata mesajını kaldır
    }
  };

  const handleScanError = (error: Error) => {
    setScannerError(`Tarama hatası: ${error.message}`);
    setTimeout(() => setScannerError(null), 5000); // 5 saniye sonra hata mesajını kaldır
  };

  // Arama işlevselliği
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    const filteredProducts = finalProducts.filter(product => {
      return product.title.toLowerCase().includes(newSearchTerm.toLowerCase());
    });
    setFilteredProducts(filteredProducts);
  };

  if (!finalProducts || finalProducts.length === 0) {
    return <div className="empty-products">Ürün bulunamadı.</div>;
  }
=======
>>>>>>> e0c8134 (third one commit)

  return (
    <div className="products-container">
      <div className="filters-sidebar">
        <ProductFilters 
          products={finalProducts} 
          onFilterChange={handleFilterChange} 
        />
        
        {/* Arama kutusu */}
        <div className="search-box">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Ürün ara..."
          />
        </div>
        
        {/* Barkod Tarama Butonu */}
        <div className="barcode-scan-section">
          <button 
            className="barcode-scan-btn"
            onClick={handleOpenScanner}
          >
            <i className="bi bi-upc-scan"></i> Barkod/QR Kod Tara
          </button>
        </div>
      </div>
      <div className="product-list">
        <h2>Ürünler</h2>
        
        {/* Hata mesajı */}
        {scannerError && (
          <div className="alert alert-danger">
            {scannerError}
          </div>
        )}
        
        <div className="product-list-header">
          <p>{filteredProducts.length} ürün bulundu</p>
          <div className="product-list-actions">
            <ProductSort 
              products={filteredProducts}
              onSortChange={handleSortChange}
            />
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid görünümü"
              >
                <i className="bi bi-grid-3x3-gap"></i>
              </button>
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-label="Tablo görünümü"
              >
                <i className="bi bi-table"></i>
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'table' ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ürün Adı</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(sortedProducts) ? sortedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/products/${product._id}`}>
                        {product.title}
                      </Link>
                    </td>
                    <td>{product.price !== undefined ? `${Number(product.price).toFixed(2)} TL` : '0.00 TL'}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="add-to-cart-btn"
                      >
                        Sepete Ekle
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4}>Ürün bulunamadı</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="product-grid">
            {Array.isArray(sortedProducts) ? sortedProducts.map((product) => (
              <ProductCard 
                key={product._id}
                {...product}
                onAddToCart={() => handleAddToCart(product)}
              />
            )) : <div className="empty-products">Ürün bulunamadı</div>}
          </div>
        )}
<<<<<<< HEAD
    <div className="products-container">
      <div className="filters-sidebar">
        <ProductFilters 
          products={finalProducts} 
          onFilterChange={handleFilterChange} 
        />
        
        {/* Arama kutusu */}
        <div className="search-box">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Ürün ara..."
          />
        </div>
        
        {/* Barkod Tarama Butonu */}
        <div className="barcode-scan-section">
          <button 
            className="barcode-scan-btn"
            onClick={handleOpenScanner}
          >
            <i className="bi bi-upc-scan"></i> Barkod/QR Kod Tara
          </button>
        </div>
      </div>
      <div className="product-list">
        <h2>Ürünler</h2>
        
        {/* Hata mesajı */}
        {scannerError && (
          <div className="alert alert-danger">
            {scannerError}
          </div>
        )}
        
        <div className="product-list-header">
          <p>{filteredProducts.length} ürün bulundu</p>
          <div className="product-list-actions">
            <ProductSort 
              products={filteredProducts}
              onSortChange={handleSortChange}
            />
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid görünümü"
              >
                <i className="bi bi-grid-3x3-gap"></i>
              </button>
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-label="Tablo görünümü"
              >
                <i className="bi bi-table"></i>
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'table' ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ürün Adı</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(sortedProducts) ? sortedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/products/${product._id}`}>
                        {product.title}
                      </Link>
                    </td>
                    <td>{product.price !== undefined ? `${Number(product.price).toFixed(2)} TL` : '0.00 TL'}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="add-to-cart-btn"
                      >
                        Sepete Ekle
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4}>Ürün bulunamadı</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="product-grid">
            {Array.isArray(sortedProducts) ? sortedProducts.map((product) => (
              <ProductCard 
                key={product._id}
                {...product}
                onAddToCart={() => handleAddToCart(product)}
              />
            )) : <div className="empty-products">Ürün bulunamadı</div>}
          </div>
        )}
=======
>>>>>>> e0c8134 (third one commit)
      </div>
      
      {/* Barkod Tarayıcı Modal */}
      {showScanner && (
        <div className="scanner-modal">
          <div className="scanner-modal-content">
            <BarcodeScanner 
              onProductFound={handleProductFound}
              onScanError={handleScanError}
              onClose={handleCloseScanner}
            />
          </div>
        </div>
      )}
<<<<<<< HEAD
      
      {/* Barkod Tarayıcı Modal */}
      {showScanner && (
        <div className="scanner-modal">
          <div className="scanner-modal-content">
            <BarcodeScanner 
              onProductFound={handleProductFound}
              onScanError={handleScanError}
              onClose={handleCloseScanner}
            />
          </div>
        </div>
      )}
=======
>>>>>>> e0c8134 (third one commit)
    </div>
  );
};

<<<<<<< HEAD
export default React.memo(ProductList);
=======
>>>>>>> e0c8134 (third one commit)
export default React.memo(ProductList);