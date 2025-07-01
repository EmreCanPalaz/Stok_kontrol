import React, { useState, useEffect } from 'react';
import { ProductProps } from '../../types/product';
import './ProductFilters.css';
import { useLocation } from 'react-router-dom';

interface ProductFiltersProps {
  products: ProductProps[];
  onFilterChange: (filteredProducts: ProductProps[]) => void;
}

interface FilterState {
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
  selectedCategories: string[];
  inStock: boolean;
  searchTerm: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, onFilterChange }) => {
  // URL'den arama parametresini al
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromUrl = searchParams.get('search') || '';

  // Tüm ürünlerden kategorileri çıkar
  const extractCategories = (products: ProductProps[]): string[] => {
    const categoriesSet = new Set<string>();
    if (Array.isArray(products)) {
      products.forEach(product => {
        if (product.category) {
          categoriesSet.add(product.category);
        }
      });
    }
    return Array.from(categoriesSet);
  };

  // Tüm ürünlerden min ve max fiyatları bul
  const findPriceRange = (products: ProductProps[]) => {
    let min = Number.MAX_VALUE;
    let max = 0;
    
    if (Array.isArray(products)) {
      products.forEach(product => {
        const price = typeof product.price === 'number' ? product.price : 0;
        if (price < min) min = price;
        if (price > max) max = price;
      });
    }
    
    return { min: min === Number.MAX_VALUE ? 0 : min, max: max === 0 ? 1000 : max };
  };

  // Başlangıç değerleri için güvenli kontroller
  const initialCategories = Array.isArray(products) ? extractCategories(products) : [];
  const initialPriceRange = Array.isArray(products) ? findPriceRange(products) : { min: 0, max: 1000 };
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialPriceRange,
    categories: initialCategories,
    selectedCategories: [],
    inStock: false,
    searchTerm: searchFromUrl // URL'den gelen arama terimini başlangıç değeri olarak kullan
  });

  // Ürünler değiştiğinde kategorileri ve fiyat aralığını güncelle
  useEffect(() => {
    const categories = Array.isArray(products) ? extractCategories(products) : [];
    const priceRange = Array.isArray(products) ? findPriceRange(products) : { min: 0, max: 1000 };
    
    // Sadece değerler değiştiyse güncelle
    if (
      JSON.stringify(categories) !== JSON.stringify(filters.categories) ||
      priceRange.min !== filters.priceRange.min ||
      priceRange.max !== filters.priceRange.max
    ) {
      setFilters(prev => ({
        ...prev,
        categories,
        priceRange
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // URL'den gelen arama parametresi değiştiğinde arama terimini güncelle
  useEffect(() => {
    if (searchFromUrl) {
      setFilters(prev => ({
        ...prev,
        searchTerm: searchFromUrl
      }));
    }
  }, [searchFromUrl]);

  // Filtreleri uygula - memoize edilmiş değerler kullanarak
  useEffect(() => {
    // Filtreleme fonksiyonunu memoize et
    const applyFilters = () => {
      let result = Array.isArray(products) ? [...products] : [];
      
      // Fiyat aralığı filtresi
      result = result.filter(
        product => {
          // Price undefined kontrolü ekleyelim
          const price = typeof product.price === 'number' ? product.price : 0;
          return price >= filters.priceRange.min && price <= filters.priceRange.max;
        }
      );
      
      // Kategori filtresi
      if (filters.selectedCategories.length > 0) {
        result = result.filter(product => 
          product.category && filters.selectedCategories.includes(product.category)
        );
      }
      
      // Stok durumu filtresi
      if (filters.inStock) {
        result = result.filter(product => product.stock > 0);
      }
      
      // Arama terimi filtresi
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        result = result.filter(product => 
          product.title.toLowerCase().includes(searchLower) || 
          (product.description && product.description.toLowerCase().includes(searchLower))
        );
      }
      
      onFilterChange(result);
    };
    
    applyFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.priceRange.min, 
    filters.priceRange.max, 
    filters.selectedCategories, 
    filters.inStock, 
    filters.searchTerm, 
    products
  ]);

  // Fiyat aralığı değişikliği
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };
  
  // Kategori seçimi değişikliği
  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => {
      const newSelectedCategories = checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter(c => c !== category);
      
      return {
        ...prev,
        selectedCategories: newSelectedCategories
      };
    });
  };
  
  // Stok durumu değişikliği
  const handleStockChange = (checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      inStock: checked
    }));
  };
  
  // Arama terimi değişikliği
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      searchTerm: value
    }));
  };
  
  // Filtreleri sıfırla
  const resetFilters = () => {
    setFilters({
      priceRange: initialPriceRange,
      categories: filters.categories,
      selectedCategories: [],
      inStock: false,
      searchTerm: ''
    });
  };

  return (
    <div className="product-filters">
      <h3>Filtreler</h3>
      
      {/* Arama Kutusu */}
      <div className="filter-section">
        <label>Ürün Ara</label>
        <input 
          type="text" 
          value={filters.searchTerm} 
          onChange={handleSearchChange} 
          placeholder="Ürün adı veya açıklama..."
          className="form-control"
        />
      </div>
      
      {/* Fiyat Aralığı */}
      <div className="filter-section">
        <label>Fiyat Aralığı</label>
        <div className="price-range-inputs">
          <input 
            type="number" 
            value={filters.priceRange.min} 
            onChange={(e) => handlePriceChange('min', Number(e.target.value))}
            min="0"
            className="form-control"
          />
          <span>-</span>
          <input 
            type="number" 
            value={filters.priceRange.max} 
            onChange={(e) => handlePriceChange('max', Number(e.target.value))}
            min={filters.priceRange.min}
            className="form-control"
          />
        </div>
      </div>
      
      {/* Kategoriler */}
      <div className="filter-section">
        <label>Kategoriler</label>
        <div className="categories-list">
          {filters.categories.map(category => (
            <div key={category} className="category-item">
              <input 
                type="checkbox"
                id={`category-${category}`}
                checked={filters.selectedCategories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
              />
              <label htmlFor={`category-${category}`}>{category}</label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stok Durumu */}
      <div className="filter-section">
        <div className="stock-filter">
          <input 
            type="checkbox"
            id="in-stock"
            checked={filters.inStock}
            onChange={(e) => handleStockChange(e.target.checked)}
          />
          <label htmlFor="in-stock">Sadece Stokta Olanlar</label>
        </div>
      </div>
      
      {/* Filtreleri Sıfırla */}
      <button 
        className="btn btn-outline-secondary reset-filters-btn"
        onClick={resetFilters}
      >
        Filtreleri Sıfırla
      </button>
    </div>
  );
};

export default ProductFilters;