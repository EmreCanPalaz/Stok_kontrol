import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/Home/HomePage';
import Navbar from './components/Navbar/Navbar';
import ProductDetail from './components/Products/ProductDetail';
import Footer from './components/Footer/Footer';





const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
     

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