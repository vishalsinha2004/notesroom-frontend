// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your separated components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Dashboard Route */}
        <Route path="/" element={ isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" /> } />
        
        {/* Public Routes */}
        <Route path="/login" element={ !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" /> } />
        <Route path="/register" element={ !isLoggedIn ? <Register /> : <Navigate to="/" /> } />
        <Route path="/verify" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}