// src/components/Search.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentAPI } from '../services/api';
import ChatModal from './ChatModal';
import PdfModal from './PdfModal';
import ThemeToggle from './ThemeToggle';
// 1. Import Helmet for dynamic SEO
import { Helmet } from 'react-helmet-async';

export default function Search({ isLoggedIn }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modals and Toasts
  const [activeChatDoc, setActiveChatDoc] = useState(null);
  const [activePdfDoc, setActivePdfDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleProtectedAction = (action) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      action();
    }
  };

  // Debounced Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    const delayDebounceFn = setTimeout(() => {
      // Fetch all data and filter documents (Works without needing a custom search backend endpoint)
      documentAPI.getAllSemesters()
        .then(response => {
          const matchedDocs = [];
          const lowerQuery = query.toLowerCase();

          // Loop through the data tree to find matching documents
          response.data.forEach(sem => {
            sem.subjects.forEach(sub => {
              sub.documents.forEach(doc => {
                if (doc.title.toLowerCase().includes(lowerQuery)) {
                  // Attach parent info so user knows where the file is from
                  matchedDocs.push({
                    ...doc,
                    subjectName: sub.name,
                    semesterName: sem.name
                  });
                }
              });
            });
          });

          setResults(matchedDocs);
        })
        .catch(err => {
          console.error("Search failed", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500); // 500ms delay to prevent spamming the API while typing

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Utility Functions
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDownload = async (doc) => {
    try {
      showToast('Starting download...');
      const response = await fetch(doc.file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.title ? `${doc.title}.pdf` : 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const link = document.createElement('a');
      link.href = doc.file;
      link.download = doc.title || 'document.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = (doc) => {
    const fullUrl = window.location.origin + doc.file;
    navigator.clipboard.writeText(fullUrl).then(() => {
      showToast('Link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-[#e3e3e3] transition-colors duration-300 font-sans relative pb-20 md:pb-8">

      {/* 2. Add the Helmet SEO data for the Search Page */}
      <Helmet>
        <title>Search Documents | Notesroom</title>
        <meta name="description" content="Search through thousands of notes, documents, and coursework materials shared by the Notesroom community." />
      </Helmet>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-gray-900 dark:bg-[#e3e3e3] text-white dark:text-gray-900 px-5 py-3 rounded-full shadow-lg z-50 animate-slide-in-up text-sm font-medium flex items-center gap-2">
          <span>✅</span> {toastMessage}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#f0f4f9]/80 dark:bg-[#131314]/80 backdrop-blur-xl border-b border-transparent dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-14 md:h-18 items-center">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
              <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e1f20] transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight">Search Notes</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-fade-in">

        {/* SEARCH AND AI BUTTON CONTAINER */}
        <div className="flex items-stretch gap-3 md:gap-4 mb-8 md:mb-12">

          {/* AI Page Button */}
          <button
            onClick={() => navigate('/ai')}
            className="flex-shrink-0 flex items-center justify-center w-[60px] md:w-[76px] bg-white dark:bg-[#1e1f20] rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#303134] hover:scale-[1.02] transition-all duration-200 group overflow-hidden relative"
            title="Open Notesroom AI"
          >
            <svg
              className="w-7 h-7 md:w-9 md:h-9 animate-[spin_4s_linear_infinite]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z"
                fill="url(#searchAiGradient)"
              />
              <defs>
                <linearGradient id="searchAiGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="0.5" stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Subtle background glow effect on hover (matching the floating button) */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </button>

          {/* BIG SEARCH BAR */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for documents, topics, or subjects..."
              autoFocus
              className="w-full h-full bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800/50 rounded-2xl md:rounded-3xl pl-12 md:pl-16 pr-12 py-4 md:py-5 text-sm md:text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-4 md:right-6 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>
        </div>

        {/* RESULTS AREA */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="font-medium">Searching documents...</p>
          </div>
        ) : !hasSearched ? (
          // Empty State - Before Searching
          <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
            <div className="text-6xl md:text-8xl mb-6 opacity-80">🔍</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Find your notes instantly</h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md">Type a keyword above to search through all your semester subjects and documents.</p>
          </div>
        ) : results.length === 0 ? (
          // Empty State - No Results
          <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center animate-fade-in">
            <div className="text-6xl md:text-8xl mb-6 opacity-80">📂</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No documents found</h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">We couldn't find anything matching "{query}". Try adjusting your keywords.</p>
          </div>
        ) : (
          // Results Grid
          <div className="animate-fade-in">
            <h3 className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4 ml-2">Found {results.length} Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {results.map(doc => (
                <div key={doc.id} className="bg-white dark:bg-[#1e1f20] rounded-2xl shadow-sm border border-transparent dark:border-gray-800/30 p-4 md:p-5 flex flex-col gap-4 md:gap-5 hover:shadow-md transition-shadow duration-200">

                  {/* Doc Info */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-[#303134] rounded-xl text-xl md:text-2xl flex shrink-0 items-center justify-center">📄</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-[#e3e3e3] leading-snug line-clamp-2">{doc.title}</h3>
                      {/* Breadcrumbs showing where this doc belongs */}
                      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {doc.subjectName} <span className="mx-1">•</span> {doc.semesterName}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:gap-3 mt-auto">
                    <button
                      onClick={() => handleProtectedAction(() => setActivePdfDoc(doc))}
                      className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleProtectedAction(() => setActiveChatDoc(doc))}
                      className="flex-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>✨</span> AI
                    </button>
                    <div className="flex gap-2 md:gap-3">
                      <button onClick={() => handleProtectedAction(() => handleDownload(doc))} className="w-10 h-9 md:w-12 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303134] rounded-xl transition-colors">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      </button>
                      <button onClick={() => handleShare(doc)} className="w-10 h-9 md:w-12 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303134] rounded-xl transition-colors">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeChatDoc && <ChatModal document={activeChatDoc} onClose={() => setActiveChatDoc(null)} />}
      {activePdfDoc && <PdfModal document={activePdfDoc} onClose={() => setActivePdfDoc(null)} />}
    </div>
  );
}