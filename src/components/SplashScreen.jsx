// src/components/SplashScreen.jsx
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function SplashScreen() {
  const [timeLeft, setTimeLeft] = useState(50);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  return (
    // Clean, solid background with no extra background color elements
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] dark:bg-[#131314] font-sans antialiased transition-colors duration-500">
      
      <div className="flex flex-col items-center justify-center p-6 max-w-sm text-center animate-fade-in">
        
        {/* Simple Floating Logo (Removed the spinning radiant background) */}
        <div className="mb-8 flex justify-center items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
            <img 
              src={logo} 
              alt="Notesroom Logo" 
              className="w-full h-full object-contain drop-shadow-xl" 
            />
          </div>
        </div>
        
        
        
        
        {/* Dynamic Minimalist Info Text with Real Timer */}
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-8">
          Waking up servers <span className="text-blue-600 dark:text-blue-400 font-bold">
            {timeLeft > 0 ? `(~${timeLeft}s)` : '(Almost ready...)'}
          </span>...
        </p>

        {/* Modern Minimal Sweeping Loading Bar */}
        <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            style={{ animation: 'sweep 1.2s ease-in-out infinite alternate' }}
          ></div>
        </div>
        
      </div>

      {/* Custom Inline Keyframes for Logo Float and Progress Bar */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(150%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}   