import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../Navbar/Navbar';
import ProductList from '../Products/ProductList';
import CategorySidebar from '../Products/CategorySidebar';
import FilterSort from '../Products/FilterSort';
import Footer from '../Footer/Footer';
import Cart from '../Cart/Cart';
import Favorites from '../Favorites/Favorites';
import { useAppContext } from '../../context/AppContext';
import './HomePage.css';
import AdminPanel from '../Admin/AdminPanel';

// HomePage component'i
const HomePage: React.FC = () => {
  const {
    cartItems,
    addToCart,
    translate,
    activeAdminPanel,
    favoriteItems,
    products
  } = useAppContext();

  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Sorting and filtering state
  const [sortOption, setSortOption] = useState('featured');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Get unique categories from products
  const categories = useMemo(() => {
    // Start with our predefined categories
    const predefinedCategories = ["Giyim", "Elektronik", "Aksesuar"];

    // Get unique categories from products
    const existingCategoriesSet = new Set(products
      .filter(product => product.category)
      .map(product => product.category as string));

    const existingCategories = Array.from(existingCategoriesSet);

    // Combine and remove duplicates
    const allCategoriesSet = new Set([...predefinedCategories, ...existingCategories]);
    return Array.from(allCategoriesSet);
  }, [products]);

  // Bootstrap JS'i dropdown için import ediyoruz
  useEffect(() => {
    // Bootstrap JS'i dynamically import etme
    const loadBootstrapJS = async () => {
      try {
        const bootstrap = await import('bootstrap');
        // Dropdown'ların çalışması için gerekli
      } catch (error) {
        console.error('Bootstrap JS yüklenemedi:', error);
      }
    };

    loadBootstrapJS();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Filter by category if selected
    if (selectedCategory !== null) {
      filtered = filtered.filter(product =>
        product.category === selectedCategory ||
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Filter by search term if present
    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseSearchTerm))
      );

      // Scroll to products section when search is performed
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Filter by price range
    if (minPrice !== null) {
      filtered = filtered.filter(product => product.price >= minPrice);
    }
    if (maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    // Filter by stock availability
    if (inStockOnly) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sort the filtered products
    const sorted = [...filtered];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // 'featured' sorting or any other case, use default order
        break;
    }

    setFilteredProducts(sorted);
  }, [searchTerm, products, selectedCategory, sortOption, minPrice, maxPrice, inStockOnly]);

  const handleShopNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
    if (showFavorites) setShowFavorites(false);
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    if (showCart) setShowCart(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    // Don't clear search when changing category
  };

  const handleSort = (option: string) => {
    setSortOption(option);
  };

  const handlePriceFilter = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleStockFilter = (inStockOnly: boolean) => {
    setInStockOnly(inStockOnly);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSortOption('featured');
    setMinPrice(null);
    setMaxPrice(null);
    setInStockOnly(false);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim() !== '') count++;
    if (selectedCategory !== null) count++;
    if (minPrice !== null || maxPrice !== null) count++;
    if (inStockOnly) count++;
    return count;
  }, [searchTerm, selectedCategory, minPrice, maxPrice, inStockOnly]);

  return (
    <div className="home-page">
      <Navbar
        onCartClick={toggleCart}
        cartItemCount={cartItems.length}
        onFavoritesClick={toggleFavorites}
        favoritesCount={favoriteItems.length}
        onSearch={handleSearch}
      />

      {showCart && <Cart onClose={toggleCart} />}
      {showFavorites && <Favorites onClose={toggleFavorites} />}

      {activeAdminPanel && <AdminPanel />}

      <div className="container mt-4">
        <div className="hero-section" id="hero-section">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="hero-title">Inventory <span>Management</span> System</h1>
              <p className="hero-subtitle">Efficiently track, manage, and optimize your inventory with our powerful solution.</p>

              <div className="feature-list mt-4">
                <div className="feature-item">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <span>Real-time stock tracking</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-graph-up text-success me-2"></i>
                  <span>Performance analytics</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-bell text-success me-2"></i>
                  <span>Low stock alerts</span>
                </div>
              </div>

              <button
                className="btn btn-primary mt-4"
                onClick={handleShopNow}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Explore Products
              </button>
            </div>

            <div className="col-md-6">
              <div className="hero-image-container">
                <div className="earth-globe">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg" alt="Earth" />
                  <div className="earth-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5" id="products-section">
          <div className="products-header d-flex align-items-center mb-4">
            <h2 className="section-title mb-0">
              {searchTerm.trim() !== '' ?
                `Arama Sonuçları: "${searchTerm}"` :
                selectedCategory ? `${selectedCategory} Kategorisi` : 'Tüm Ürünler'}
            </h2>

            {activeFilterCount > 0 && (
              <button
                className="btn btn-outline-secondary btn-sm ms-3"
                onClick={resetAllFilters}
              >
                <i className="bi bi-x-circle me-1"></i>
                Tüm Filtreleri Temizle ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="category-sidebar-container">
                <CategorySidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />

                <div className="mt-4">
                  <FilterSort
                    onSort={handleSort}
                    onPriceFilter={handlePriceFilter}
                    onStockFilter={handleStockFilter}
                    selectedSortOption={sortOption}
                    inStockOnly={inStockOnly}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-9 col-md-8">
              <div className="product-count mb-3">
                <span className="text-muted">
                  {filteredProducts.length} ürün bulundu
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="alert alert-info">
                  {searchTerm.trim() !== '' ?
                    `"${searchTerm}" araması için sonuç bulunamadı.` :
                    `Seçilen filtrelerle eşleşen ürün bulunamadı.`}
                </div>
              ) : (
                <ProductList products={filteredProducts} onAddToCart={addToCart} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
