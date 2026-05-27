import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // NEW: Global Language State initialized from localStorage
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');

  // Check sessionStorage to see if we already woke the server up
  const [isServerAwake, setIsServerAwake] = useState(() => {
    return sessionStorage.getItem('serverAwake') === 'true';
  });

  // Check auth status on load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  // Logic to ping the backend server and wake it up
  useEffect(() => {
    // If the server is already marked as awake, skip pinging
    if (isServerAwake) return;

    const pingServer = async () => {
      try {
        // Ping a safe, lightweight endpoint 
        await axios.get(`${import.meta.env.VITE_API_URL}/api/semesters/`);
        
        // If it succeeds, the server is awake!
        sessionStorage.setItem('serverAwake', 'true');
        setIsServerAwake(true);
      } catch (error) {
        // Crucial Check: If error.response exists, it means the server actually replied 
        // (even if it replied with a 401 Unauthorized error). If it replied, IT IS AWAKE!
        if (error.response) {
          sessionStorage.setItem('serverAwake', 'true');
          setIsServerAwake(true);
        }
        // If error.response is undefined, the server is still sleeping/unreachable.
        // The interval will just wait and try again.
      }
    };

    // Ping immediately on load
    pingServer();

    // Set an interval to keep pinging every 5 seconds until it wakes up
    const intervalId = setInterval(pingServer, 5000);

    // Cleanup interval to prevent memory leaks when the component unmounts
    return () => clearInterval(intervalId);
  }, [isServerAwake]);

  if (isLoading) return null;

  return (
    <ThemeProvider>
      {/* Show Splash Screen if sleeping, otherwise show the App */}
      {!isServerAwake ? (
        <SplashScreen />
      ) : (
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-[#131314] text-gray-900 dark:text-gray-100 transition-colors duration-300 md:pb-0 pb-20">
            <Routes>
              <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* UPDATED: Passing language props down to Dashboard and Profile */}
              <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} language={language} />} />
              <Route path="/ai" element={isLoggedIn ? <FloatingChatbot /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} language={language} setLanguage={setLanguage} /> : <Navigate to="/login" />} />
              
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
              <Route path="/search" element={<Search isLoggedIn={isLoggedIn} />} />
            </Routes>
            
            {isLoggedIn && <MobileNavbar />}
          </div>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}

export default App;