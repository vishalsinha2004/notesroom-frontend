// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion'; 

import Login from './components/Login';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import { ThemeProvider } from './context/ThemeContext';
import MobileNavbar from './components/MobileNavbar';
import Search from './components/Search';
import FloatingChatbot from './components/FloatingChatbot';
import SplashScreen from './components/SplashScreen'; 

// --- Reusable Animation Wrapper ---
function PageWrapper({ children }) {
  return (
    <motion.div
      // REMOVED filter: blur() to prevent iOS Safari bugs with sticky navbars
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ 
        duration: 0.35, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// --- Global Chatbot Wrapper ---
function GlobalChatbotWrapper({ isLoggedIn }) {
  const location = useLocation();
  
  if (!isLoggedIn) return null;
  
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';
  const isAiPage = location.pathname === '/ai'; 
  
  if (!isDashboard && !isAiPage) {
    return null;
  }
  
  return <FloatingChatbot />;
}

// --- Separated Routes Component ---
function AnimatedRoutes({ isLoggedIn, setIsLoggedIn, language, setLanguage }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        <Route path="/login" element={
          <PageWrapper>
            {isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          </PageWrapper>
        } />
        
        <Route path="/register" element={
          <PageWrapper><Register /></PageWrapper>
        } />
        
        <Route path="/verify-email" element={
          <PageWrapper><VerifyEmail /></PageWrapper>
        } />
        
        <Route path="/dashboard" element={
          <PageWrapper>
            <Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} language={language} />
          </PageWrapper>
        } />
        
        <Route path="/ai" element={
          <PageWrapper>
            {isLoggedIn ? <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314]" /> : <Navigate to="/login" />}
          </PageWrapper>
        } />
        
        <Route path="/profile" element={
          <PageWrapper>
            {isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} language={language} setLanguage={setLanguage} /> : <Navigate to="/login" />}
          </PageWrapper>
        } />
        
        <Route path="/search" element={
          <PageWrapper><Search isLoggedIn={isLoggedIn} /></PageWrapper>
        } />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');

  const [isServerAwake, setIsServerAwake] = useState(() => {
    return sessionStorage.getItem('serverAwake') === 'true';
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isServerAwake) return;

    const pingServer = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/semesters/`);
        sessionStorage.setItem('serverAwake', 'true');
        setIsServerAwake(true);
      } catch (error) {
        if (error.response) {
          sessionStorage.setItem('serverAwake', 'true');
          setIsServerAwake(true);
        }
      }
    };

    pingServer();
    const intervalId = setInterval(pingServer, 5000);
    return () => clearInterval(intervalId);
  }, [isServerAwake]);

  if (isLoading) return null;

  return (
    <ThemeProvider>
      {!isServerAwake ? (
        <SplashScreen />
      ) : (
        <BrowserRouter>
          {/* REMOVED `overflow-x-hidden` from this div so `sticky top-0` works natively */}
          <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-gray-100 transition-colors duration-300 md:pb-0 pb-20">
            
            <AnimatedRoutes 
              isLoggedIn={isLoggedIn} 
              setIsLoggedIn={setIsLoggedIn} 
              language={language} 
              setLanguage={setLanguage} 
            />
            
            {isLoggedIn && <MobileNavbar />}
            <GlobalChatbotWrapper isLoggedIn={isLoggedIn} />
            
          </div>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}

export default App;