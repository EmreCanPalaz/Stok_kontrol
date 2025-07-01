import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ProductProps } from '../../types/product';
import BarcodeScanner from './BarcodeScanner';
import './EditProduct.css'; // Bu dosyayı da oluşturmanız gerekecek

interface EditProductProps {
  productId?: string;
  onClose?: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ productId, onClose }) => {
  const { products, updateProduct, isLoading } = useAppContext();
  const [showScanner, setShowScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [productsList, setProductsList] = useState<ProductProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [barcode, setBarcode] = useState('');

  // Ürünleri yükle
  useEffect(() => {
    setProductsList(products);
  }, [products]);

  // Belirli bir ürün ID'si verilmişse, o ürünü seç
  useEffect(() => {
    if (productId) {
      const product = products.find(p => p._id === productId);
      if (product) {
        selectProduct(product);
      }
    }
  }, [productId, products]);

  // Ürün seçimi
  const selectProduct = (product: ProductProps) => {
    setSelectedProduct(product);
    setTitle(product.title);
    setPrice(product.price);
    setDescription(product.description || '');
    setCategory(product.category || '');
    setImage(product.image);
    setStock(product.stock);
    setBarcode((product as any).barcode || '');
  };

  // Barkod tarayıcıdan ürün bulma
  const handleProductFound = useCallback((product: ProductProps) => {
    selectProduct(product);
    setShowScanner(false);
  }, []);

  // Ürün güncelleme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Lütfen düzenlemek için bir ürün seçin.');
      return;
    }

    if (!title || price === '' || price <= 0 || !image) {
      alert('Lütfen ürün adı, fiyatı ve görsel URL\'si alanlarını doldurun.');
      return;
    }

    const updatedProductData = {
      ...selectedProduct,
      title,
      price: parseFloat(price.toString()),
      description,
      category,
      image,
      stock
    };

    try {
      await updateProduct(selectedProduct._id, updatedProductData);
      alert('Ürün başarıyla güncellendi!');
      if (onClose) onClose();
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error);
      alert('Ürün güncellenirken bir hata oluştu.');
    }
  };

  // Ürün arama
  const filteredProducts = productsList.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="edit-product-container">
      <h2 className="mb-4">Ürün Düzenle</h2>

      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-secondary w-100"
            onClick={() => setShowScanner(!showScanner)}
          >
            <i className={`bi bi-${showScanner ? 'camera-video-off' : 'camera-video'}`}></i> {showScanner ? 'Tarayıcıyı Kapat' : 'Barkod Tara'}
          </button>
        </div>
      </div>

      {showScanner ? (
        <div className="mb-3">
          <BarcodeScanner
            onProductFound={handleProductFound}
            onScanError={(e) => {
              console.error("Tarama hatası:", e);
              setShowScanner(false);
              alert('Barkod tarama sırasında bir hata oluştu.');
            }}
            onClose={() => setShowScanner(false)}
          />
        </div>
      ) : (
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="product-list-container">
              <h4>Ürün Listesi</h4>
              <div className="list-group">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <button
                      key={product._id}
                      className={`list-group-item list-group-item-action ${selectedProduct?._id === product._id ? 'active' : ''}`}
                      onClick={() => selectProduct(product)}
                    >
                      {product.title} - {product.price.toFixed(2)} TL
                      <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'} float-end`}>
                        Stok: {product.stock}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="alert alert-info">Ürün bulunamadı.</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            {selectedProduct ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Ürün Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label">Fiyat</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="stock" className="form-label">Stok Miktarı</label>
                    <input
                      type="number"
                      className="form-control"
                      id="stock"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Kategori</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Açıklama</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Görsel URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                  {image && (
                    <div className="mt-2">
                      <img src={image} alt={title} className="img-thumbnail" style={{ maxHeight: '100px' }} />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="barcode" className="form-label">Barkod (Opsiyonel)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Güncelleniyor...' : 'Ürünü Güncelle'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="alert alert-info">Lütfen düzenlemek için bir ürün seçin.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;