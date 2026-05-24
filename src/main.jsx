// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Import the ThemeProvider
import { ThemeProvider } from './context/ThemeContext.jsx' 
// 2. Import the Google OAuth Provider
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. Wrap the app with GoogleOAuthProvider and pass your environment variable */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* 4. Keep your existing ThemeProvider wrapping the App component */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)