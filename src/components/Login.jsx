// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // States for loading and showing password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(username, password);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setIsLoggedIn(true);
      navigate('/'); 
    } catch (err) {
      setError('Invalid username or password, or email not verified.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authAPI.googleLogin(credentialResponse.credential);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      if (typeof setIsLoggedIn === 'function') {
          setIsLoggedIn(true);
      }
      navigate('/'); 
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Background matches the Dashboard/Profile exactly
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] dark:bg-[#131314] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Background Blob - Scaled appropriately */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none opacity-70 md:opacity-100 transition-opacity"></div>

      {/* Main Card - Slimmer padding on mobile, rounded like Profile panels */}
      <div className="max-w-md w-full bg-white dark:bg-[#1e1f20] p-6 md:p-10 rounded-[24px] shadow-sm md:shadow-xl border border-transparent dark:border-gray-800/30 relative z-10 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-5 md:mb-6">
            <span className="font-bold text-2xl md:text-3xl">N</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#e3e3e3] tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
            Sign in to access your classroom
          </p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-xl animate-fade-in">
            <p className="text-xs md:text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-5 md:space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            
            {/* Username Input */}
            <div>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                disabled={isLoading}
                className="w-full bg-gray-100 dark:bg-[#131314] border border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
              />
            </div>
            
            {/* Password Input with Eye Toggle */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={isLoading}
                // Added pr-12 so the text doesn't overlap the eye icon
                className="w-full bg-gray-100 dark:bg-[#131314] border border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl pl-4 pr-12 py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3.5 md:py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm md:text-base font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Google Authentication Divider and Button */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#1e1f20] text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed. Please try again.')}
              useOneTap
              theme={document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline'}
              shape="pill"
            />
          </div>
        </div>
        
        <p className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/50">
          Need an account? <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
