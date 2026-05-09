// src/components/VerifyEmail.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // 1. New Toast State for professional popups
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

  // 2. Custom Toast Trigger Function
  const showToastMsg = (message) => {
    setToast({ show: true, message });
    // Hide toast after 3 seconds
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      await authAPI.verify(email, code);
      
      // Trigger the beautiful on-screen toast instead of the ugly browser alert
      showToastMsg('Verification successful! Redirecting...');
      
      // Delay navigation slightly so the user can see the success message
      setTimeout(() => {
        navigate('/login'); 
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check your code.');
      setIsVerifying(false); // Only stop loading if there's an error
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    
    try {
      await authAPI.resendOtp(email);
      setTimeLeft(60);
      // Trigger the toast for the resend action
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* 3. PROFESSIONAL TOAST NOTIFICATION UI */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold transition-all duration-300">
          <span className="text-xl">✅</span> 
          {toast.message}
        </div>
      )}

      {/* Decorative Background Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/50 text-center relative z-10">
        <div>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-6">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Check Your Email</h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            We sent a 6-digit code to <strong className="text-gray-900 dark:text-white">{email}</strong>.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-left rounded-r-xl">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <input 
            type="text" 
            placeholder="• • • • • •" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            maxLength="6"
            required 
            disabled={isVerifying}
            className="appearance-none block w-full px-3 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 placeholder-gray-400 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-center text-3xl tracking-[0.5em] font-mono transition-all disabled:opacity-50"
          />
          
          {/* 4. BUTTON WITH LOADING SPINNER */}
          <button 
            type="submit" 
            disabled={isVerifying || code.length < 6} 
            className="w-full flex justify-center items-center py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resend code in <span className="font-bold text-blue-600 dark:text-blue-400">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <button 
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isResending && (
                <svg className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
}