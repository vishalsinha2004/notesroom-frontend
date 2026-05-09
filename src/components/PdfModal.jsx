// src/components/PdfModal.jsx
import React from 'react';

export default function PdfModal({ document, onClose }) {
  
  // Quick download handler for the modal
  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = document.file;
    link.download = document.title || 'document.pdf';
    link.target = '_blank'; // Fallback
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    // Backdrop with Glassmorphism blur (z-[100] to sit above toasts and navbar)
    <div className="fixed inset-0 bg-gray-900/40 dark:bg-gray-950/90 backdrop-blur-md z-[100] flex items-center justify-center sm:p-6 font-sans">
      
      {/* Modal Container: Fullscreen 100dvh on mobile, floating rounded box on desktop */}
      <div className="w-full max-w-6xl h-[100dvh] sm:h-[85vh] bg-white dark:bg-gray-900 sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-blue-500/10 border-0 sm:border border-gray-200 dark:border-gray-800 animate-slide-in-up relative">
        
        {/* Sleek Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-20 relative">
          
          {/* Title Area (Uses min-w-0 and truncate to prevent breaking layout on small phones) */}
          <div className="flex items-center gap-3 sm:gap-4 pr-2 sm:pr-4 overflow-hidden min-w-0">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-inner">
              <span className="text-xl">📄</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg leading-tight truncate" title={document.title}>
                {document.title}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                PDF Document Viewer
              </p>
            </div>
          </div>

          {/* Actions Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Download Button (Icon-only on mobile, full text on desktop) */}
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:px-4 sm:py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-bold transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow"
              title="Download PDF"
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span className="hidden sm:inline">Download</span>
            </button>
            
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900/30 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-xl transition-all duration-300 hover:rotate-90"
              title="Close Viewer"
            >
              <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        {/* PDF Iframe Container */}
        <div className="flex-1 w-full bg-gray-100 dark:bg-gray-950 relative overflow-hidden">
          
          {/* Background Loading Spinner */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <svg className="animate-spin h-10 w-10 text-blue-500/50 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wide">Loading Document...</p>
          </div>
          
          {/* Actual PDF Iframe - Absolute positioned for flawless mobile rendering */}
          <iframe 
            src={`${document.file}#toolbar=0`} 
            title={document.title}
            className="absolute inset-0 w-full h-full border-0 z-10 bg-transparent"
          >
            Your browser does not support PDFs. 
          </iframe>
        </div>

      </div>
    </div>
  );
}