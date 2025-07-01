import React from 'react';
import { ProductProps } from '../../types/product';
import './ProductSort.css';

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc';

interface ProductSortProps {
  onSortChange: (sortedProducts: ProductProps[]) => void;
  products: ProductProps[];
}

const ProductSort: React.FC<ProductSortProps> = ({ onSortChange, products }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = e.target.value as SortOption;
    
    // Dizi kontrolü ekleyelim
    if (!Array.isArray(products)) {
      console.warn('Products is not an array:', products);
      onSortChange([]);
      return;
    }
    
    const sortedProducts = [...products];
    
    switch (sortOption) {
      case 'price-asc':
        sortedProducts.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'stock-asc':
        sortedProducts.sort((a, b) => {
          const stockA = typeof a.stock === 'number' ? a.stock : 0;
          const stockB = typeof b.stock === 'number' ? b.stock : 0;
          return stockA - stockB;
        });
        break;
      case 'stock-desc':
        sortedProducts.sort((a, b) => {
          const stockA = typeof a.stock === 'number' ? a.stock : 0;
          const stockB = typeof b.stock === 'number' ? b.stock : 0;
          return stockB - stockA;
        });
        break;
      default:
        // Varsayılan sıralama: isme göre artan
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    onSortChange(sortedProducts);
  };
  
  return (
    <div className="product-sort">
      <label htmlFor="sort-select">Sıralama: </label>
      <select 
        id="sort-select" 
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="name-asc">İsim (A-Z)</option>
        <option value="name-desc">İsim (Z-A)</option>
        <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
        <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
        <option value="stock-asc">Stok (Azdan Çoğa)</option>
        <option value="stock-desc">Stok (Çoktan Aza)</option>
      </select>
    </div>
  );
};

export default ProductSort;