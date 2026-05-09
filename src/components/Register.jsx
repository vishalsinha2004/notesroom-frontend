// src/components/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character.";
    return null; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setStatus({ type: 'error', message: passwordError });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const submitData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      await authAPI.register(submitData);
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Registration failed. Username or email might already be taken.' 
      });
      setIsLoading(false); 
    } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/50 relative z-10">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-6">
            <span className="font-bold text-3xl">N</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
            Join Notesroom to manage your files
          </p>
        </div>
        
        {status.message && (
          <div className={`p-4 rounded-r-xl border-l-4 font-medium text-sm ${
            status.type === 'error' 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500' 
              : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500'
          }`}>
            {status.message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
              className="appearance-none block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
              className="appearance-none block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
            />
            
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                className="appearance-none block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 pl-1 font-medium">
                Must be 8+ chars with uppercase, lowercase, number, and special character.
              </p>
            </div>

            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              required 
              className="appearance-none block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/50">
          Already have an account? <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">Log in here</Link>
        </p>
      </div>
    </div>
  );
}