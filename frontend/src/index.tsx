import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Add Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Add Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
// Add custom color palette
import './styles/colors.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< HEAD

=======
import { AuthProvider } from './context/AuthContext';
>>>>>>> e0c8134 (third one commit)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      
        <App />
      
=======
      <AuthProvider>
        <App />
      </AuthProvider>
>>>>>>> e0c8134 (third one commit)
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
