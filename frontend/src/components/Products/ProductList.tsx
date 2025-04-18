import React, { useState, useEffect } from 'react';
import ProductCard, { ProductProps } from './ProductCard';
import './ProductList.css';


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


interface ProductListProps {
  
  onAddToCart: (product: ProductProps) => void; 
}


const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  
  const [products, setProducts] = useState<ProductProps[]>(sampleProducts);

  

  return (
    <div className="product-list container">
      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <ProductCard {...product} onAddToCart={() => onAddToCart(product)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;