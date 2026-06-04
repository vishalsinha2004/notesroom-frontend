// src/components/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.png';
import { translations } from '../utils/translations';

export default function About({ language = 'English' }) {
  const navigate = useNavigate();
  const t = translations[language] || translations['English'];

  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-[#e3e3e3] transition-colors duration-300 font-sans relative pb-10">
      <Helmet>
        <title>About | Notesroom</title>
      </Helmet>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-[#f0f4f9]/80 dark:bg-[#131314]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-14 md:h-18 items-center">
            <div 
              className="flex items-center gap-2 md:gap-3 cursor-pointer group" 
              onClick={() => navigate(-1)} // Goes back to the Profile page
            >
              <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e1f20] transition-colors text-gray-900 dark:text-[#e3e3e3]">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-[#e3e3e3]">
                {t.about || "About Notesroom"}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 md:pt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden p-6 sm:p-8 md:p-12 flex flex-col items-center text-center"
        >
          
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-5 md:mb-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-[1.25rem] md:rounded-3xl shadow-inner p-3 sm:p-4">
            <img 
              src={logo} 
              alt="Notesroom Logo" 
              className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" 
            />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1.5 md:mb-2">
            Notesroom
          </h2>
          <p className="text-[14px] sm:text-[15px] md:text-lg text-gray-500 dark:text-gray-400 mb-6 md:mb-8 max-w-lg leading-snug">
            {t.tagline || "Your ultimate AI-powered digital study space."}
          </p>

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800/60 my-2"></div>

          <div className="w-full text-left space-y-6 mt-6 md:mt-8">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
              <p className="text-[13px] sm:text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed md:leading-loose">
                Notesroom is designed specifically for students to securely store, organize, and interact with documents, notes, and coursework. We aim to revolutionize the way you learn by integrating seamless file management with powerful AI tools that act as your personal 24/7 tutor.
              </p>
            </div>
          </div>

          <div className="mt-10 md:mt-12 text-[11px] sm:text-xs md:text-sm text-gray-400 flex flex-col gap-1 md:gap-1.5 items-center bg-gray-50 dark:bg-[#131314] px-4 sm:px-6 py-3 sm:py-4 rounded-xl md:rounded-2xl w-full">
            <span className="font-semibold text-gray-500 dark:text-gray-300">Version 1.0.0</span>
            <span>© 2026 Notesroom Inc.</span>
            <span>{t.rights || "All rights reserved."}</span>
          </div>

        </motion.div>
      </main>
    </div>
  );
}