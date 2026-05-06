// src/components/VerifyEmail.jsx
import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/login" />;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      await authAPI.verify(email, code);
      alert('Verification successful!');
      
      // FIX: Changed from '/login' to '/' to redirect to the home page
      navigate('/'); 
      
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check your code.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a 6-digit code to <strong className="text-gray-900">{email}</strong>.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-left mb-4">
            <p className="text-sm text-red-700">{error}</p>
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
            className="appearance-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-[0.5em] font-mono sm:text-3xl"
          />
          <button 
            type="submit" 
            disabled={isVerifying} 
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
}