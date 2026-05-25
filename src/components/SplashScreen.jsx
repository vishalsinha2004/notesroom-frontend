// src/components/SplashScreen.jsx
import React from 'react';

export default function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] dark:bg-[#131314] font-sans antialiased relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Atmospheric Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-md text-center animate-fade-in">
        
        {/* Logo Container with Radar/Ripple Animation */}
        <div className="relative mb-10 flex justify-center items-center">
          {/* Outer Ripple Effect */}
          <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-blue-500 rounded-3xl animate-ping opacity-20 dark:opacity-30"></div>
          
          {/* Static Glowing Shadow */}
          <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-50"></div>
          
          {/* Main Logo Card */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20 dark:border-gray-800/50">
            <span className="font-bold text-4xl md:text-5xl tracking-tighter shadow-sm">N</span>
          </div>
        </div>
        
        {/* Premium Gradient Text Heading */}
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
          Waking up the classroom
        </h2>
        
        {/* Glassmorphism Info Card */}
        <div className="bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-xl rounded-2xl p-5 mb-10 border border-white/40 dark:border-gray-700/30 shadow-sm">
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            Our secure backend is currently waking up from sleep mode. This usually takes about <span className="font-bold text-blue-600 dark:text-blue-400">50 seconds</span>. Hang tight!
          </p>
        </div>

        {/* Modern Sweeping Loading Bar */}
        <div className="w-56 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            style={{ animation: 'sweep 1.5s ease-in-out infinite alternate' }}
          ></div>
        </div>
        
      </div>

      {/* Inline Keyframes so you don't have to edit tailwind.config.js */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}