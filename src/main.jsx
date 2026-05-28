// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Import HelmetProvider for SEO
import { HelmetProvider } from 'react-helmet-async' 
// 2. Import the ThemeProvider
import { ThemeProvider } from './context/ThemeContext.jsx' 
// 3. Import the Google OAuth Provider
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap everything in HelmetProvider */}
    <HelmetProvider>
      {/* Keep your existing GoogleOAuthProvider and pass your environment variable */}
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {/* Keep your existing ThemeProvider wrapping the App component */}
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>,
)