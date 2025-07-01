import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { Routes, Route, Navigate } from 'react-router-dom';
=======
>>>>>>> e0c8134 (third one commit)
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/Home/HomePage';
import Navbar from './components/Navbar/Navbar';
<<<<<<< HEAD


import ProductList from './components/Products/ProductList';

import FavoritesPage from './components/Products/FavoritesPage';
import ProductDetail from './components/Products/ProductDetail';

import StockControl from './components/Stock Control/StockControl';
import InventoryTracker from './components/Inventory/InventoryTracker';
import FinanceTracker from './components/Finance/FinanceTracker';

import Footer from './components/Footer/Footer';

// Korumalı Route bileşeni
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
=======
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Profile from './components/Auth/Profile';
import Feedback from './components/Auth/FeedBack';
import ProductList from './components/Products/ProductList';
import { useAuth } from './context/AuthContext';
import FavoritesPage from './components/Products/FavoritesPage';
import ProductDetail from './components/Products/ProductDetail';
import AdminPanel from './components/Admin/AdminPanel';
import StockControl from './components/Stock Control/StockControl';
import InventoryTracker from './components/Inventory/InventoryTracker';
import FinanceTracker from './components/Finance/FinanceTracker';
import ActivityLog from './components/Activity/ActivityLog';
import AdminReviews from './components/Reviews/AdminReviews';
import AddProduct from './components/Admin/AddProduct';
import EditProduct from './components/Admin/EditProduct';
import ProductManagement from './components/Admin/ProductManagement';
import Footer from './components/Footer/Footer';
import CartPage from './components/Products/CartPage';

// Korumalı Route bileşeni
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Kimlik doğrulama yüklenirken bir yükleme göstergesi göster
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route bileşeni (sadece admin ve stok yöneticileri için)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Kimlik doğrulama yüklenirken bir yükleme göstergesi göster
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'stock_manager')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

>>>>>>> e0c8134 (third one commit)
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
<<<<<<< HEAD
      
=======
      <Route path="/feedback" element={
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      } />
>>>>>>> e0c8134 (third one commit)
      <Route path="/products" element={
        <ProtectedRoute>
          <ProductList />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      } />
<<<<<<< HEAD
=======
      <Route path="/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />
>>>>>>> e0c8134 (third one commit)
      <Route path="/products/:productId" element={
        <ProductDetail />
      } />
      
<<<<<<< HEAD
      
      
=======
      {/* Admin Panel Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      } />
      <Route path="/admin/stock" element={
        <AdminRoute>
          <StockControl />
        </AdminRoute>
      } />
      <Route path="/admin/inventory" element={
        <AdminRoute>
          <InventoryTracker />
        </AdminRoute>
      } />
      <Route path="/admin/finance" element={
        <AdminRoute>
          <FinanceTracker />
        </AdminRoute>
      } />
      <Route path="/admin/activity" element={
        <AdminRoute>
          <ActivityLog />
        </AdminRoute>
      } />
      <Route path="/admin/reviews" element={
        <AdminRoute>
          <AdminReviews />
        </AdminRoute>
      } />
      <Route path="/admin/products" element={
        <AdminRoute>
          <ProductManagement />
        </AdminRoute>
      } />
      <Route path="/admin/products/add" element={
        <AdminRoute>
          <AddProduct />
        </AdminRoute>
      } />
      <Route path="/admin/products/edit/:productId" element={
        <AdminRoute>
          <EditProduct />
        </AdminRoute>
      } />
>>>>>>> e0c8134 (third one commit)
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AppProvider>
    </ErrorBoundary>
<<<<<<< HEAD
    <ErrorBoundary>
      <AppProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AppProvider>
    </ErrorBoundary>
=======
>>>>>>> e0c8134 (third one commit)
  );
};

export default App;