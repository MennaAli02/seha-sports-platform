import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { SehaProvider } from './context/SehaContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <SehaProvider>
          <App />
        </SehaProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
