import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ProductProps } from '../../types/product';
import './ProductManagement.css';

const ProductManagement: React.FC = () => {
  const { products, deleteProduct, updateStock, isLoading } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Ürünleri yükle ve kategorileri çıkar
  useEffect(() => {
    setFilteredProducts(products);
    
    // Benzersiz kategorileri çıkar
    const uniqueCategories = Array.from(
      new Set(products.map(product => product.category).filter(Boolean))
    ) as string[];
    
    setCategories(uniqueCategories);
  }, [products]);

  // Filtreleme ve sıralama
  useEffect(() => {
    let result = [...products];
    
    // Arama terimine göre filtrele
    if (searchTerm) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Kategoriye göre filtrele
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Stok durumuna göre filtrele
    if (stockFilter === 'inStock') {
      result = result.filter(product => product.stock > 0);
    } else if (stockFilter === 'outOfStock') {
      result = result.filter(product => product.stock === 0);
    } else if (stockFilter === 'lowStock') {
      result = result.filter(product => product.stock > 0 && product.stock <= 5);
    }
    
    // Sırala
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'stock') {
        comparison = a.stock - b.stock;
      } else if (sortBy === 'category') {
        comparison = (a.category || '').localeCompare(b.category || '');
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy, sortOrder]);

  // Stok güncelleme
  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await updateStock(productId, newStock);
      alert('Stok başarıyla güncellendi!');
    } catch (error) {
      console.error('Stok güncelleme hatası:', error);
      alert('Stok güncellenirken bir hata oluştu.');
    }
  };

  // Ürün silme
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await deleteProduct(productId);
        alert('Ürün başarıyla silindi!');
      } catch (error) {
        console.error('Ürün silme hatası:', error);
        alert('Ürün silinirken bir hata oluştu.');
      }
    }
  };

  return (
    <div className="product-management-container">
      <h2 className="mb-4">Ürün Yönetimi</h2>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="col-md-3">
          <select 
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-2">
          <select 
            className="form-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">Tüm Stok</option>
            <option value="inStock">Stokta Var</option>
            <option value="outOfStock">Stokta Yok</option>
            <option value="lowStock">Az Stok</option>
          </select>
        </div>
        
        <div className="col-md-3">
          <div className="input-group">
            <select 
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">İsim</option>
              <option value="price">Fiyat</option>
              <option value="stock">Stok</option>
              <option value="category">Kategori</option>
            </select>
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <i className={`bi bi-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="view-toggle mb-3">
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('table')}
          >
            <i className="bi bi-table me-1"></i> Tablo Görünümü
          </button>
          <button 
            type="button" 
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="bi bi-grid-3x3-gap me-1"></i> Kart Görünümü
          </button>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="product-thumbnail" 
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>{product.category || '-'}</td>
                    <td>{product.price.toFixed(2)} TL</td>
                    <td>
                      <div className="input-group input-group-sm">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          defaultValue={product.stock}
                          onBlur={(e) => {
                            const newStock = parseInt(e.target.value);
                            if (newStock !== product.stock) {
                              handleStockUpdate(product._id, newStock);
                            }
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-primary"
                          onClick={() => window.location.href = `/admin/edit-product/${product._id}`}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">Ürün bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div className="col" key={product._id}>
                <div className="card h-100 product-card">
                  <div className="card-img-container">
                    <img 
                      src={product.image} 
                      className="card-img-top product-card-img" 
                      alt={product.title} 
                    />
                    <div className="stock-badge">
                      <span className={`badge ${product.stock > 5 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                        {product.stock > 0 ? `${product.stock} adet` : 'Stokta yok'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text category-tag">{product.category || 'Kategorisiz'}</p>
                    <p className="card-text price">{product.price.toFixed(2)} TL</p>
                    <div className="stock-control mb-3">
                      <label className="form-label">Stok Miktarı:</label>
                      <div className="input-group input-group-sm">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          defaultValue={product.stock}
                          onBlur={(e) => {
                            const newStock = parseInt(e.target.value);
                            if (newStock !== product.stock) {
                              handleStockUpdate(product._id, newStock);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="d-flex justify-content-between">
                      <a href={`/admin/edit-product/${product._id}`} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil"></i> Düzenle
                      </a>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <i className="bi bi-trash"></i> Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted">Ürün bulunamadı.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;