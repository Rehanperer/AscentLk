import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './styles/index.css'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
    console.warn('VITE_CLERK_PUBLISHABLE_KEY is missing. Admin authentication will be disabled.');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                {publishableKey ? (
                    <ClerkProvider publishableKey={publishableKey}>
                        <App />
                    </ClerkProvider>
                ) : (
                    <App />
                )}
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>,
)
