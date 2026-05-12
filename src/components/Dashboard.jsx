// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // IMPORT NAVIGATE
import { documentAPI } from '../services/api';
import ChatModal from './ChatModal';
import PdfModal from './PdfModal';
import ThemeToggle from './ThemeToggle';

// Accept isLoggedIn as a prop from App.jsx
export default function Dashboard({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate(); // Initialize navigation

  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [activeChatDoc, setActiveChatDoc] = useState(null);
  const [activePdfDoc, setActivePdfDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Navigation State
  const [currentView, setCurrentView] = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // REDIRECT FLOW: This function protects document clicks
  const handleProtectedAction = (action) => {
    if (!isLoggedIn) {
      // If user is not logged in, send them to login page
      navigate('/login');
    } else {
      // If logged in, execute the action (view, chat, etc.)
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
    <div className="bg-white dark:bg-gray-800/80 p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col items-center w-full animate-pulse backdrop-blur-sm">
      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-5"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-100 dark:bg-gray-700/50 rounded-full w-1/2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans relative">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-in-up font-bold flex items-center gap-2">
          <span>✅</span> {toastMessage}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <span className="font-bold text-xl">N</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
                Notesroom
              </h1>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-5">
              <ThemeToggle />

              {/* DYNAMIC BUTTON: Show Log Out if logged in, Log In if guest */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* NEW: GUEST WELCOME MESSAGE BANNER */}
        {!isLoggedIn && (
          <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-bounce">👋</div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Log in to unlock your notes!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Happy learning! Sign in to view, download, and ask AI about your documents. 😊
                </p>
              </div>
            </div>
            {/* <button
              onClick={() => navigate('/login')}
              className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              Log In Now
            </button> */}
          </div>
        )}
        {/* BREADCRUMBS */}
        <div className="inline-flex flex-wrap items-center gap-2 mb-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={() => setCurrentView('semesters')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${currentView === 'semesters' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            All Semesters
          </button>
          {selectedSemester && currentView !== 'semesters' && (
            <>
              <span className="text-gray-300 dark:text-gray-600">❯</span>
              <button
                onClick={() => setCurrentView('subjects')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${currentView === 'subjects' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {selectedSemester.name}
              </button>
            </>
          )}
          {selectedSubject && currentView === 'documents' && (
            <>
              <span className="text-gray-300 dark:text-gray-600">❯</span>
              <span className="px-4 py-2 rounded-xl text-sm font-bold bg-purple-600 text-white shadow-md shadow-purple-500/20">
                {selectedSubject.name}
              </span>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <FolderSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {/* VIEW 1: SEMESTERS GRID */}
            {currentView === 'semesters' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {semesters.map(sem => (
                  <div
                    key={sem.id}
                    // CORRECTED: Use 'sem' and 'subjects' instead of 'sub' and 'documents'
                    onClick={() => handleProtectedAction(() => {
                      setSelectedSemester(sem);
                      setCurrentView('subjects');
                    })}
                    className="group relative bg-white dark:bg-gray-800/80 p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 flex items-center justify-center bg-blue-50 dark:bg-gray-700/50 rounded-2xl group-hover:scale-110 transition-transform duration-300 ease-out mb-5">
                        <span className="text-4xl">📁</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{sem.name}</h3>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full">
                        {sem.subjects.length} Subjects
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 2: SUBJECTS GRID */}
            {currentView === 'subjects' && selectedSemester && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {selectedSemester.subjects.map(sub => (
                  <div
                    key={sub.id}
                    // CORRECTED: Wrap the subjects click as well
                    onClick={() => handleProtectedAction(() => {
                      setSelectedSubject(sub);
                      setCurrentView('documents');
                    })}
                    className="group relative bg-white dark:bg-gray-800/80 p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 flex items-center justify-center bg-indigo-50 dark:bg-gray-700/50 rounded-2xl group-hover:scale-110 transition-transform duration-300 ease-out mb-5">
                        <span className="text-4xl">📚</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{sub.name}</h3>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full">
                        {sub.documents.length} Documents
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 3: DOCUMENTS GRID */}
            {currentView === 'documents' && selectedSubject && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {selectedSubject.documents.map(doc => (
                  <div key={doc.id} className="group relative flex flex-col bg-white dark:bg-gray-800/80 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700/50 p-6 transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800/50 backdrop-blur-sm overflow-hidden">

                    {/* Ask AI - Uses handleProtectedAction */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={() => handleProtectedAction(() => setActiveChatDoc(doc))}
                        className="relative group/ai p-[2px] rounded-full overflow-hidden shadow-sm hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full opacity-80 group-hover/ai:opacity-100 transition-opacity duration-300"></span>
                        <div className="relative bg-white dark:bg-gray-900 px-3 py-1.5 rounded-[999px] flex items-center gap-1.5 hover:bg-transparent dark:hover:bg-transparent transition-colors duration-300">
                          <span className="text-sm group-hover/ai:animate-bounce text-white">✨</span>
                          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 group-hover/ai:text-white transition-colors duration-300 whitespace-nowrap">Ask AI</span>
                        </div>
                      </button>
                    </div>

                    <div className="flex items-start gap-4 mb-6 mt-1 pr-28">
                      <div className="p-3.5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">📄</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.title}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium">Added {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      {/* View Button - Uses handleProtectedAction */}
                      <button
                        onClick={() => handleProtectedAction(() => setActivePdfDoc(doc))}
                        className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white dark:hover:text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex justify-center items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        View
                      </button>

                      <div className="flex gap-2">
                        {/* Download & Share - Uses handleProtectedAction */}
                        <button
                          onClick={() => handleProtectedAction(() => handleDownload(doc))}
                          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex justify-center items-center gap-1.5"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleProtectedAction(() => handleShare(doc))}
                          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex justify-center items-center gap-1.5"
                        >
                          Share
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
    </div>
  );
}