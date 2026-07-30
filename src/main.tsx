import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
