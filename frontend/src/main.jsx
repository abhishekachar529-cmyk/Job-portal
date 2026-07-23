// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add this
import AppRouter from './AppRouter'; // ✅ Import AppRouter instead of App
import './index.css';

console.log('🔥🔥🔥 MAIN.JSX LOADED - USING APP ROUTER! 🔥🔥🔥');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* ✅ Wrap with BrowserRouter */}
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);