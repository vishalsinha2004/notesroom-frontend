// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Import the ThemeProvider
import { ThemeProvider } from './context/ThemeContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap the App component with ThemeProvider */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)