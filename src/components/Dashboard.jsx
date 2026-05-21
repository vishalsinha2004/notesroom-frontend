// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { documentAPI } from '../services/api';
import ChatModal from './ChatModal';
import PdfModal from './PdfModal';
import FloatingChatbot from './FloatingChatbot';
import ThemeToggle from './ThemeToggle'; 

export default function Dashboard({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate(); 

  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeChatDoc, setActiveChatDoc] = useState(null);
  const [activePdfDoc, setActivePdfDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [currentView, setCurrentView] = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleProtectedAction = (action) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      action();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    documentAPI.getAllSemesters()
      .then(response => {
        setSemesters(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401 && isLoggedIn) {
          handleLogout();
        }
        setIsLoading(false);
      });
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
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

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const FolderSkeleton = () => (
    <div className="bg-white dark:bg-[#1e1f20] p-4 rounded-2xl shadow-sm border border-transparent dark:border-gray-800/30 flex items-center gap-4 w-full animate-pulse">
      <div className="w-12 h-12 bg-gray-200 dark:bg-[#303134] rounded-xl shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-[#303134] rounded-md w-3/4"></div>
        <div className="h-3 bg-gray-100 dark:bg-[#303134]/60 rounded-md w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-[#e3e3e3] transition-colors duration-300 font-sans relative pb-20 md:pb-8">

      {toastMessage && (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-gray-900 dark:bg-[#e3e3e3] text-white dark:text-gray-900 px-4 py-2.5 rounded-full shadow-lg z-50 animate-slide-in-up text-sm font-medium flex items-center gap-2">
          <span>✅</span> {toastMessage}
        </div>
      )}

      {/* NAVBAR - Max width set to keep it centered on giant monitors */}
      <nav className="sticky top-0 z-40 bg-[#f0f4f9]/80 dark:bg-[#131314]/80 backdrop-blur-xl border-b border-transparent dark:border-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                <span className="font-bold text-sm">N</span>
              </div>
              <h1 className="text-lg font-semibold tracking-tight hidden sm:block">
                Notesroom
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block scale-90">
                <ThemeToggle />
              </div>
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="hidden sm:flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold hover:scale-105 transition-transform"
                  title="Profile"
                >
                  VS
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT - Max width capped at 6xl to prevent insane stretching */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        
        {/* SLIM GUEST BANNER */}
        {!isLoggedIn && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="text-2xl shrink-0">👋</div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-[#e3e3e3]">Log in to unlock features</h2>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">View, download, and ask AI about documents.</p>
            </div>
          </div>
        )}

        {/* SLIM BREADCRUMBS */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6 text-sm">
          <button
            onClick={() => setCurrentView('semesters')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${currentView === 'semesters' ? 'bg-[#e3e3e3] dark:bg-[#303134] text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-[#1e1f20]'}`}
          >
            All Semesters
          </button>
          {selectedSemester && currentView !== 'semesters' && (
            <>
              <span className="text-gray-400 dark:text-gray-600 text-[10px]">❯</span>
              <button
                onClick={() => setCurrentView('subjects')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${currentView === 'subjects' ? 'bg-[#e3e3e3] dark:bg-[#303134] text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-[#1e1f20]'}`}
              >
                {selectedSemester.name}
              </button>
            </>
          )}
          {selectedSubject && currentView === 'documents' && (
            <>
              <span className="text-gray-400 dark:text-gray-600 text-[10px]">❯</span>
              <span className="px-3 py-1.5 rounded-lg font-medium bg-[#e3e3e3] dark:bg-[#303134] text-gray-900 dark:text-white">
                {selectedSubject.name}
              </span>
            </>
          )}
        </div>

        {isLoading ? (
          // Fixed Skeleton Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <FolderSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {/* VIEW 1: SEMESTERS */}
            {currentView === 'semesters' && (
              // Use responsive grid to prevent stretching
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {semesters.map(sem => (
                  <div
                    key={sem.id}
                    onClick={() => handleProtectedAction(() => {
                      setSelectedSemester(sem);
                      setCurrentView('subjects');
                    })}
                    className="group bg-white dark:bg-[#1e1f20] p-4 rounded-2xl shadow-sm border border-transparent dark:border-gray-800/30 hover:bg-gray-50 dark:hover:bg-[#303134]/40 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex shrink-0 items-center justify-center bg-blue-50 dark:bg-[#303134] rounded-xl text-xl">📁</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-[#e3e3e3]">{sem.name}</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{sem.subjects.length} Subjects</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 2: SUBJECTS */}
            {currentView === 'subjects' && selectedSemester && (
              // Use responsive grid to prevent stretching
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedSemester.subjects.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => handleProtectedAction(() => {
                      setSelectedSubject(sub);
                      setCurrentView('documents');
                    })}
                    className="group bg-white dark:bg-[#1e1f20] p-4 rounded-2xl shadow-sm border border-transparent dark:border-gray-800/30 hover:bg-gray-50 dark:hover:bg-[#303134]/40 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex shrink-0 items-center justify-center bg-indigo-50 dark:bg-[#303134] rounded-xl text-xl">📚</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-[#e3e3e3]">{sub.name}</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{sub.documents.length} Documents</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 3: DOCUMENTS */}
            {currentView === 'documents' && selectedSubject && (
              // Adjusted columns: 1 on mobile, 2 on tablet, 3 on desktop, 4 on ultra-wide
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedSubject.documents.map(doc => (
                  <div key={doc.id} className="bg-white dark:bg-[#1e1f20] rounded-2xl shadow-sm border border-transparent dark:border-gray-800/30 p-4 flex flex-col gap-4 min-h-[160px]">

                    {/* Doc Info */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-[#303134] rounded-xl text-xl flex shrink-0 items-center justify-center">📄</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-[#e3e3e3] leading-snug line-clamp-2">{doc.title}</h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">Added {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleProtectedAction(() => setActivePdfDoc(doc))}
                        className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 py-2 rounded-xl text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleProtectedAction(() => setActiveChatDoc(doc))}
                        className="flex-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <span>✨</span> AI
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProtectedAction(() => handleDownload(doc))}
                          className="w-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303134] rounded-xl transition-colors"
                          title="Download"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>
                        <button
                          onClick={() => handleShare(doc)}
                          className="w-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303134] rounded-xl transition-colors"
                          title="Share"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {activeChatDoc && <ChatModal document={activeChatDoc} onClose={() => setActiveChatDoc(null)} />}
      {activePdfDoc && <PdfModal document={activePdfDoc} onClose={() => setActivePdfDoc(null)} />}
      {isLoggedIn && <FloatingChatbot />}
    </div>
  );
}