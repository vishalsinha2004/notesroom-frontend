// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('access_token'));

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC HOME PAGE: Everyone can see the Dashboard now */}
        <Route 
          path="/" 
          element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />
        
        {/* Auth Routes: Redirect to home if already logged in */}
        <Route 
          path="/login" 
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />} 
        />
        <Route path="/verify" element={<VerifyEmail />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}