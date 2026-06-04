import React from 'react';
import { motion } from 'framer-motion';

const DocumentsView = ({
  selectedSubject,
  t,
  handleProtectedAction,
  setActiveChatDoc,
  setActivePdfDoc,
  handleDownload,
  handleShare
}) => {
  return (
    <motion.div 
      key="view-documents"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
    >
      {selectedSubject.documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
          className="group relative bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl rounded-[20px] md:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 p-3 md:p-5 flex flex-col hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-red-900/10 transition-all duration-300 min-h-[160px] md:min-h-[190px]"
        >
          <div className="absolute top-3 right-3 md:top-5 md:right-5 z-10">
            <button
              onClick={() => handleProtectedAction(() => setActiveChatDoc(doc))}
              className="flex items-center justify-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-purple-50/80 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-full border border-purple-200 dark:border-purple-800/50 transition-all shadow-sm hover:scale-105 group/ai"
              title="Ask AI"
            >
              <div className="relative flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 animate-[spin_4s_linear_infinite]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" fill="url(#flowerGradientDocTop)" />
                  <defs>
                    <linearGradient id="flowerGradientDocTop" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6" />
                      <stop offset="0.5" stopColor="#8B5CF6" />
                      <stop offset="1" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-bold text-[9px] md:text-[11px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent group-hover/ai:opacity-80 transition-opacity">AI</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-2.5 md:gap-4 flex-1 min-w-0 pr-12 md:pr-16 w-full">
            <div className="w-10 h-10 md:w-12 md:h-12 flex shrink-0 items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl shadow-md shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v6a1 1 0 001 1h6"></path>
              </svg>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <h3 className="text-[11px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-[#e3e3e3] leading-tight line-clamp-2 md:line-clamp-3 transition-colors group-hover:text-red-500 dark:group-hover:text-red-400">{doc.title}</h3>
              <p className="text-[9px] md:text-xs font-medium text-gray-500 dark:text-gray-500 mt-1 truncate">{t.added} {new Date(doc.uploaded_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 mt-auto w-full pt-3 md:pt-4">
            <button onClick={() => handleProtectedAction(() => setActivePdfDoc(doc))} className="flex-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] sm:text-[11px] md:text-sm font-semibold transition-colors flex items-center justify-center gap-1 md:gap-1.5 overflow-hidden">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <span className="truncate">{t.view}</span>
            </button>

            <div className="flex gap-1.5 md:gap-2 shrink-0">
              <button onClick={() => handleProtectedAction(() => handleDownload(doc))} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg md:rounded-xl transition-colors" title="Download">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
              <button onClick={() => handleShare(doc)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg md:rounded-xl transition-colors" title="Share">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DocumentsView;