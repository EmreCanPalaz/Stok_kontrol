import React from 'react';
import './App.css';
import HomePage from './components/Home/HomePage';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="App">
        <HomePage />
      </div>
    </AppProvider>
  );
};

export default App;