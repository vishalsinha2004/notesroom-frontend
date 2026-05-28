// src/components/VerifyEmail.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';
// 1. Import Helmet for SEO
import { Helmet } from 'react-helmet-async';

// --- ADDED setIsLoggedIn prop here ---
export default function VerifyEmail({ setIsLoggedIn }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // New Toast State for professional popups
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  if (!email) {
    return <Navigate to="/login" />;
  }

  const showToastMsg = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      // 1. Wait for the API response
      const response = await authAPI.verify(email, code);
      
      // 2. Store the tokens that the updated Django view sent us
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      showToastMsg('Verification successful! Logging you in...');
      
      // 3. Update Global Auth State
      if (typeof setIsLoggedIn === 'function') {
         setIsLoggedIn(true);
      }
      
      // 4. Redirect DIRECTLY to Dashboard instead of Login
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check your code.');
      setIsVerifying(false); 
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    
    try {
      await authAPI.resendOtp(email);
      setTimeLeft(60);
      showToastMsg('A new code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    // 2. Wrap the return in a fragment
    <>
      {/* 3. Add the Helmet SEO data */}
      <Helmet>
        <title>Verify Email | Notesroom</title>
        <meta name="description" content="Verify your email address to complete your Notesroom registration and access your account." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] dark:bg-[#131314] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden transition-colors duration-300">
        
        {toast.show && (
          <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-gray-900 dark:bg-[#e3e3e3] text-white dark:text-gray-900 px-5 py-3 rounded-full shadow-lg z-50 animate-slide-in-up text-sm font-medium flex items-center gap-2">
            <span>✅</span> 
            {toast.message}
          </div>
        )}

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none opacity-70 md:opacity-100 transition-opacity"></div>

        <div className="max-w-md w-full bg-white dark:bg-[#1e1f20] p-6 md:p-10 rounded-[24px] shadow-sm md:shadow-xl border border-transparent dark:border-gray-800/30 text-center relative z-10 animate-fade-in">
          
          <div className="mb-8">
            <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-5 md:mb-6">
              <span className="text-2xl md:text-3xl">✉️</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              Check Your Email
            </h2>
            <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
              We sent a 6-digit code to <strong className="text-gray-900 dark:text-white">{email}</strong>.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-left rounded-r-xl animate-fade-in">
              <p className="text-xs md:text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5 md:space-y-6">
            <input 
              type="text" 
              placeholder="• • • • • •" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              maxLength="6"
              required 
              disabled={isVerifying}
              className="w-full bg-gray-100 dark:bg-[#131314] border border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center text-2xl md:text-3xl tracking-[0.3em] md:tracking-[0.5em] font-mono disabled:opacity-50"
            />
            
            <button 
              type="submit" 
              disabled={isVerifying || code.length < 6} 
              className="w-full flex justify-center items-center py-3.5 md:py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm md:text-base font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed group"
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/50">
            {timeLeft > 0 ? (
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Resend code in <span className="font-bold text-blue-600 dark:text-blue-400">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button 
                onClick={handleResend}
                disabled={isResending}
                className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isResending && (
                  <svg className="animate-spin h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}