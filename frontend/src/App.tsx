import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/Home/HomePage';
import Navbar from './components/Navbar/Navbar';


import ProductList from './components/Products/ProductList';

import FavoritesPage from './components/Products/FavoritesPage';
import ProductDetail from './components/Products/ProductDetail';

import StockControl from './components/Stock Control/StockControl';
import InventoryTracker from './components/Inventory/InventoryTracker';
import FinanceTracker from './components/Finance/FinanceTracker';

import Footer from './components/Footer/Footer';

// Korumalı Route bileşeni
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
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
      <Route path="/products/:productId" element={
        <ProductDetail />
      } />
      
      
      
      
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
  );
};

export default App;