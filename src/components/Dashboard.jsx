// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentAPI, authAPI } from '../services/api';
import ChatModal from './ChatModal';
import PdfModal from './PdfModal';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';
import { translations } from '../utils/translations'; 
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ isLoggedIn, setIsLoggedIn, language }) {
  const navigate = useNavigate();
  
  const t = translations[language] || translations['English'];

  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeChatDoc, setActiveChatDoc] = useState(null);
  const [activePdfDoc, setActivePdfDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [currentView, setCurrentView] = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [openFaq, setOpenFaq] = useState(null);

  const handleProtectedAction = (action) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      action();
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      setIsProfileLoading(true);
      authAPI.getProfile()
        .then(response => {
          setUsername(response.data.username || 'User');
          setProfilePicture(response.data.profile_picture || null); 
        })
        .catch(err => {
          console.error("Failed to fetch profile for navbar", err);
        })
        .finally(() => {
          setIsProfileLoading(false);
        });
    } else {
      setIsProfileLoading(false);
    }
  }, [isLoggedIn]);

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

  const getInitials = (name) => {
    if (!name) return '👤';
    return name.substring(0, 2).toUpperCase();
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: t.faq1Q || "How do I find and view documents?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq1A1 || "Navigating Notesroom is designed to be effortless. You can browse manually by clicking through your specific Semester and Subject folders directly from this dashboard. Once you locate the desired file, you can instantly view it in our seamless PDF reader or download it to your device for offline studying."}</p>
          <p>{t.faq1A2 || "If you know exactly what you are looking for, we recommend using our lightning-fast global search function to jump straight to your notes without clicking through folders."}</p>
          <button onClick={() => handleProtectedAction(() => navigate('/search'))} className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1.5 mt-2 transition-colors">
            {t.goSearch || "Go to Search Page"} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )
    },
    {
      question: t.faq2Q || "How does the AI Chat assistant work?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq2A1 || "Our intelligent AI assistant transforms how you interact with your study materials. By clicking the '✨ AI' button on any document, our system instantly reads and comprehends the entire PDF text."}</p>
          <p>{t.faq2A2 || "You can ask the AI to summarize complex topics, explain difficult formulas, extract key bullet points, or even generate practice quiz questions based strictly on the document's content. It's like having a personal tutor available 24/7 directly inside your classroom."}</p>
          <button onClick={() => handleProtectedAction(() => navigate('/ai'))} className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1.5 mt-2 transition-colors">
            {t.tryAi || "Try AI Chat Now"} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )
    },
    {
      question: t.faq3Q || "How do I create an account or log in?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq3A1 || "Creating an account unlocks the full potential of Notesroom, giving you unrestricted access to viewing, downloading, and chatting with our curated documents. The registration process is completely secure and takes less than a minute."}</p>
          <p>{t.faq3A2 || "You simply need to provide a username, a valid email address, and a strong password. We will send a secure 6-digit verification code to your email to confirm your identity. If you already have an account, just sign in!"}</p>
          <div className="flex flex-wrap gap-4 mt-3">
            <button onClick={() => navigate('/register')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1.5 transition-colors">
              {t.signUpFree || "Sign Up for Free"} <span aria-hidden="true">&rarr;</span>
            </button>
            <button onClick={() => navigate('/login')} className="text-gray-600 dark:text-gray-300 font-bold hover:text-gray-900 dark:hover:text-white hover:underline flex items-center gap-1.5 transition-colors">
              {t.logInAccount || "Log In to Account"} <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      )
    },
    {
      question: t.faq4Q || "Where can I manage my account and app preferences?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq4A1 || "Your profile acts as your central command center. Here, you can review your account details, verify your active subscription tier, and customize your application experience entirely to your liking."}</p>
          <p>{t.faq4A2 || "You have full control over preferences, including toggling Dark Mode for comfortable late-night studying, turning email alerts on or off, and selecting your preferred display language."}</p>
          <button onClick={() => handleProtectedAction(() => navigate('/profile'))} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1.5 mt-2 transition-colors">
            {t.openProfile || "Open Profile Settings"} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )
    },
    // --- NEW FAQS ADDED BELOW ---
    {
      question: t.faq5Q || "What should I do if I don't receive the email OTP?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq5A1 || "First, please check your Spam or Junk folder, as automated emails occasionally get filtered there. Also, double-check that you entered the correct email address during registration."}</p>
          <p>{t.faq5A2 || "If you still cannot find it, you can request a new OTP from the verification page, or try registering again to ensure there were no typos in your email."}</p>
        </div>
      )
    },
    {
      question: t.faq6Q || "Which languages does Notesroom support?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq6A1 || "Notesroom is fully multi-lingual! We currently support English, Hindi, and Gujarati to make your learning experience as comfortable as possible."}</p>
          <p>{t.faq6A2 || "You can easily switch your preferred language at any time directly from your Profile settings."}</p>
          <button onClick={() => handleProtectedAction(() => navigate('/profile'))} className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1.5 mt-2 transition-colors">
            Change Language in Profile <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )
    },
    {
      question: t.faq7Q || "What should I do if Google Login fails?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq7A1 || "If Google Login is failing, please ensure you have a stable internet connection and that your browser allows pop-ups (some strict ad-blockers block the Google popup)."}</p>
          <p>{t.faq7A2 || "If the issue persists, you can bypass Google entirely by signing up or logging in using the standard Email and Password method."}</p>
          <button onClick={() => navigate('/login')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1.5 mt-2 transition-colors">
            Go to standard Login <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )
    },
    {
      question: t.faq8Q || "I need more help. How can I contact support?",
      answer: (
        <div className="space-y-3">
          <p>{t.faq8A1 || "We are always here to help! If you encounter any bugs, need assistance with your account, or have feature requests, please reach out to our dedicated support team."}</p>
          <a href="mailto:notesroomofficial@gmail.com" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1.5 mt-2 transition-colors">
            Email Support (notesroomofficial@gmail.com) <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )
    },
    {
      question: t.faq9Q || "About Notesroom",
      answer: (
        <div className="space-y-3">
          <p>{t.faq9A1 || "Notesroom is your ultimate AI-powered digital study space. It is designed specifically for students to securely store, organize, and interact with documents, notes, and coursework."}</p>
          <p>{t.faq9A2 || "Our mission is to revolutionize the way students learn by integrating seamless file management with powerful AI tools that act as your personal 24/7 tutor."}</p>
        </div>
      )
    }
  ];

  const FolderSkeleton = () => (
    <div className="bg-white/50 dark:bg-[#1e1f20]/50 backdrop-blur-xl p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm border border-gray-100/50 dark:border-gray-800/40 flex flex-col min-h-[140px] md:min-h-[180px] animate-pulse">
      <div className="flex justify-between items-start w-full">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 dark:bg-gray-700/50 rounded-2xl shrink-0"></div>
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800/50 rounded-full shrink-0"></div>
      </div>
      <div className="mt-auto pt-4 space-y-2 md:space-y-3">
        <div className="h-4 md:h-5 bg-gray-200 dark:bg-gray-700/50 rounded-lg w-3/4"></div>
        <div className="h-3 md:h-3.5 bg-gray-100 dark:bg-gray-800/60 rounded-lg w-2/5"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-[#e3e3e3] transition-colors duration-300 font-sans relative pb-20 md:pb-8">

      <Helmet>
        <title>Notesroom | Your Digital Study Space</title>
        <meta name="description" content="Notesroom is a platform for students to securely store, organize, and search for documents, notes, and coursework." />
      </Helmet>

      {toastMessage && (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-gray-900 dark:bg-[#e3e3e3] text-white dark:text-gray-900 px-5 py-3 rounded-full shadow-lg z-50 animate-slide-in-up text-sm font-medium flex items-center gap-2">
          <span>✅</span> {toastMessage}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#f0f4f9]/80 dark:bg-[#131314]/80 backdrop-blur-xl border-b border-transparent dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-14 md:h-18 items-center">
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                <img 
                  src={logo} 
                  alt="Notesroom Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight hidden sm:block">
                Notesroom
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center gap-6 mr-2">
                    <button
                      onClick={() => navigate('/search')}
                      className="text-[15px] font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {t.search}
                    </button>
                    <button
                      onClick={() => navigate('/profile')}
                      className="text-[15px] font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {t.profile}
                    </button>
                  </div>

                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-sm overflow-hidden"
                    title={t.profile}
                  >
                    {isProfileLoading ? (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-700/80 animate-pulse"></div>
                    ) : profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      getInitials(username)
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs md:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-colors shadow-sm"
                >
                  {t.logIn}
                </button>
              )}
            </div>
            
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* GUEST BANNER */}
        {!isLoggedIn && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4 md:p-6 flex items-center gap-3 md:gap-5 shadow-sm"
          >
            <div className="text-2xl md:text-4xl shrink-0">👋</div>
            <div>
              <h2 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-[#e3e3e3]">{t.guestTitle}</h2>
              <p className="text-[11px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1">{t.guestSubtitle}</p>
            </div>
          </motion.div>
        )}

        {/* BREADCRUMBS */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center p-1.5 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-800/50 shadow-sm mb-6 md:mb-8 max-w-full overflow-x-auto custom-scrollbar"
        >
          <button
            onClick={() => setCurrentView('semesters')}
            className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[11px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 ${
              currentView === 'semesters'
                ? 'bg-white dark:bg-[#303134] text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
            }`}
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            {t.semesters}
          </button>

          {selectedSemester && currentView !== 'semesters' && (
            <>
              <div className="px-1 md:px-2 text-gray-300 dark:text-gray-700 shrink-0">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <button
                onClick={() => setCurrentView('subjects')}
                className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[11px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 ${
                  currentView === 'subjects'
                    ? 'bg-white dark:bg-[#303134] text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                {selectedSemester.name}
              </button>
            </>
          )}

          {selectedSubject && currentView === 'documents' && (
            <>
              <div className="px-1 md:px-2 text-gray-300 dark:text-gray-700 shrink-0">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <div className="flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[11px] md:text-sm font-bold bg-white dark:bg-[#303134] text-red-500 dark:text-red-400 shadow-sm whitespace-nowrap shrink-0">
                {selectedSubject.name}
              </div>
            </>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(8)].map((_, i) => <FolderSkeleton key={i} />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: SEMESTERS + FAQ */}
            {currentView === 'semesters' && (
              <motion.div 
                key="view-semesters"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {semesters.map((sem, index) => (
                    <motion.div
                      key={sem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                      onClick={() => handleProtectedAction(() => {
                        setSelectedSemester(sem);
                        setCurrentView('subjects');
                      })}
                      className="group bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800/60 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 cursor-pointer flex flex-col gap-3 md:gap-4 min-h-[140px] md:min-h-[180px] relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="w-12 h-12 md:w-14 md:h-14 flex shrink-0 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                          </svg>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-[#131314] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors shrink-0">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <h3 className="font-bold text-gray-900 dark:text-[#e3e3e3] text-sm md:text-lg transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">{sem.name}</h3>
                        <p className="text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{sem.subjects.length} {t.subjects}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* FAQ SECTION (Now animates in/out seamlessly with the Semesters View) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: semesters.length * 0.05 }}
                  className="mt-20 pt-8 border-t border-gray-200/60 dark:border-gray-800/50 mb-8"
                >
                  <div className="mb-6 px-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-[#e3e3e3]">
                      {t.faqTitle || "Frequently Asked Questions"}
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                      {t.faqSubtitle || "Everything you need to know about using Notesroom."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-[#303134]/40 transition-colors focus:outline-none group"
                        >
                          <span className="text-sm md:text-base font-bold text-gray-800 dark:text-[#e3e3e3] text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {faq.question}
                          </span>
                          <div className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white/50 dark:bg-[#131314]/80 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors shrink-0 shadow-sm ${openFaq === index ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            <svg className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-5 pb-6 pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                            <div className="text-sm md:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* VIEW 2: SUBJECTS */}
            {currentView === 'subjects' && selectedSemester && (
              <motion.div 
                key="view-subjects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
              >
                {selectedSemester.subjects.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                    onClick={() => handleProtectedAction(() => {
                      setSelectedSubject(sub);
                      setCurrentView('documents');
                    })}
                    className="group bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800/60 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-purple-900/10 transition-all duration-300 cursor-pointer flex flex-col gap-3 md:gap-4 min-h-[140px] md:min-h-[180px] relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-12 h-12 md:w-14 md:h-14 flex shrink-0 items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-[#131314] group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-colors shrink-0">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <h3 className="font-bold text-gray-900 dark:text-[#e3e3e3] text-sm md:text-lg transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">{sub.name}</h3>
                      <p className="text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{sub.documents.length} {t.documents}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* VIEW 3: DOCUMENTS */}
            {currentView === 'documents' && selectedSubject && (
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
                          <svg
                            className="w-3 h-3 md:w-4 md:h-4 animate-[spin_4s_linear_infinite]"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z"
                              fill="url(#flowerGradientDocTop)"
                            />
                            <defs>
                              <linearGradient id="flowerGradientDocTop" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#3B82F6" />
                                <stop offset="0.5" stopColor="#8B5CF6" />
                                <stop offset="1" stopColor="#EC4899" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <span className="font-bold text-[9px] md:text-[11px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent group-hover/ai:opacity-80 transition-opacity">
                          AI
                        </span>
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
                      <button
                        onClick={() => handleProtectedAction(() => setActivePdfDoc(doc))}
                        className="flex-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] sm:text-[11px] md:text-sm font-semibold transition-colors flex items-center justify-center gap-1 md:gap-1.5 overflow-hidden"
                      >
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        <span className="truncate">{t.view}</span>
                      </button>

                      <div className="flex gap-1.5 md:gap-2 shrink-0">
                        <button
                          onClick={() => handleProtectedAction(() => handleDownload(doc))}
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg md:rounded-xl transition-colors"
                          title="Download"
                        >
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>
                        <button
                          onClick={() => handleShare(doc)}
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-[#303134]/50 text-gray-600 dark:text-gray-300 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg md:rounded-xl transition-colors"
                          title="Share"
                        >
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Modals */}
      {activeChatDoc && <ChatModal document={activeChatDoc} onClose={() => setActiveChatDoc(null)} />}
      {activePdfDoc && <PdfModal document={activePdfDoc} onClose={() => setActivePdfDoc(null)} />}
      
    </div>
  );
}