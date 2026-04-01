import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './CSS/index.css';
import App from './App';
import { ApiProvider } from './api/ApiProvider';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApiProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApiProvider>
    </StrictMode>,
);
