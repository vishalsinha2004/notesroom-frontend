// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import logo from '../assets/logo.png'; 
import { translations } from '../utils/translations'; // Import the translation dictionary

// ADDED language and setLanguage as props
export default function Profile({ setIsLoggedIn, language, setLanguage }) {
  const navigate = useNavigate();
  
  // Get the correct language object from the dictionary
  const t = translations[language] || translations['English']; // Fallback to English if undefined

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ username: '', email: '', profile_picture: null });
  const [expandedSection, setExpandedSection] = useState(null);
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    setIsLoading(true);
    authAPI.getProfile()
      .then(response => {
        setUserData({
          username: response.data.username || 'User',
          email: response.data.email || 'No email provided',
          profile_picture: response.data.profile_picture || null
        });
      })
      .catch(err => {
        console.error("Failed to fetch profile", err);
        if (err.response?.status === 401) {
          handleLogout();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const toggleSection = (sectionName) => {
    setExpandedSection(prev => prev === sectionName ? null : sectionName);
  };

  const getInitials = (name) => {
    if (!name || name === 'Loading...') return '👤';
    return name.substring(0, 2).toUpperCase();
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setExpandedSection(null); 

    if (selectedTheme === 'system') {
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      localStorage.setItem('theme', selectedTheme);
      if (selectedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    window.dispatchEvent(new Event('theme-changed'));
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang); // Update global app state
    localStorage.setItem('language', lang); // Save preference
    setExpandedSection(null); 
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-[#e3e3e3] transition-colors duration-300 pb-24 md:pb-12 font-sans">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#f0f4f9]/80 dark:bg-[#131314]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-14 md:h-18 items-center">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
               <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e1f20] transition-colors">
                 <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
               </button>
              {/* Translated Profile Title */}
              <h1 className="text-lg md:text-xl font-semibold tracking-tight">{t.profile}</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
        
        {/* User Header with Skeleton Loading */}
        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10 bg-white dark:bg-[#1e1f20] p-4 md:p-6 rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30">
          
          {isLoading ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-700/50 rounded-full shrink-0 animate-pulse border-2 border-white dark:border-[#303134]"></div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex shrink-0 items-center justify-center text-white text-2xl md:text-3xl font-bold border-2 border-white dark:border-[#303134] overflow-hidden">
              {userData.profile_picture ? (
                <img src={userData.profile_picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                getInitials(userData.username)
              )}
            </div>
          )}

          <div className="flex flex-col min-w-0 w-full gap-2">
            {isLoading ? (
              <>
                <div className="h-6 md:h-8 bg-gray-200 dark:bg-gray-700/50 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-4 md:h-5 bg-gray-100 dark:bg-gray-800/60 rounded-lg w-1/2 animate-pulse mt-1"></div>
              </>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-[#e3e3e3] capitalize truncate">
                  {userData.username}
                </h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 truncate">
                  {userData.email}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Translated Preferences Heading */}
        <h3 className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2 md:mb-3 ml-2">{t.preferences}</h3>
        
        <div className="bg-white dark:bg-[#1e1f20] rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30 overflow-hidden mb-6 md:mb-8">
          
          <div className="border-b border-gray-100 dark:border-gray-800/50">
            <button onClick={() => toggleSection('account')} className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                {/* Translated Account Info */}
                <span className="text-sm md:text-base font-medium">{t.accountInfo}</span>
              </div>
              <svg className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${expandedSection === 'account' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            {expandedSection === 'account' && (
              <div className="px-5 py-4 md:py-6 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50">
                <div className="space-y-4 md:space-y-5">
                  <div>
                    {/* Translated Username */}
                    <label className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.username}</label>
                    {isLoading ? (
                       <div className="mt-1.5 h-11 md:h-12 w-full bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse"></div>
                    ) : (
                       <input type="text" value={userData.username} readOnly className="mt-1.5 w-full bg-gray-100 dark:bg-[#1e1f20] border-transparent rounded-xl px-4 py-2.5 text-sm md:text-base text-gray-700 dark:text-gray-300 focus:ring-0 cursor-not-allowed" />
                    )}
                  </div>
                  <div>
                    {/* Translated Email Address */}
                    <label className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.emailAddress}</label>
                    {isLoading ? (
                       <div className="mt-1.5 h-11 md:h-12 w-full bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse"></div>
                    ) : (
                       <input type="email" value={userData.email} readOnly className="mt-1.5 w-full bg-gray-100 dark:bg-[#1e1f20] border-transparent rounded-xl px-4 py-2.5 text-sm md:text-base text-gray-700 dark:text-gray-300 focus:ring-0 cursor-not-allowed" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800/50">
            <button onClick={() => toggleSection('theme')} className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                {/* Translated Appearance */}
                <span className="text-sm md:text-base font-medium">{t.appearance}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] md:text-sm text-gray-500 font-medium capitalize">{theme}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedSection === 'theme' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </button>
            {expandedSection === 'theme' && (
              <div className="px-5 py-4 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-2">
                {['light', 'dark', 'system'].map((t) => (
                  <button 
                    key={t} 
                    onClick={() => handleThemeSelect(t)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${theme === t ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800/50">
            <button onClick={() => toggleSection('notifications')} className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {/* Translated Notifications */}
                <span className="text-sm md:text-base font-medium">{t.notifications}</span>
              </div>
              <svg className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${expandedSection === 'notifications' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            {expandedSection === 'notifications' && (
              <div className="px-5 py-4 md:py-6 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">{t.emailAlerts}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.emailAlertsDesc}</p>
                  </div>
                  <div 
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-11 h-6 md:w-12 md:h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${emailAlerts ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-4 h-4 md:w-5 md:h-5 rounded-full shadow-sm transform transition-transform duration-300 ${emailAlerts ? 'translate-x-5 md:translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-b border-gray-100 dark:border-gray-800/50">
            <button onClick={() => toggleSection('language')} className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                {/* Translated Language Header */}
                <span className="text-sm md:text-base font-medium">{t.language}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* DO NOT translate the currently selected language variable so they always know what to click */}
                <span className="text-[13px] md:text-sm text-gray-500 font-medium">{language}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedSection === 'language' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </button>
            {expandedSection === 'language' && (
              <div className="px-5 py-4 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-2">
                {/* Language options stay in native names for easy identification */}
                {['English', 'Hindi', 'Gujarati'].map((lang) => (
                  <button 
                    key={lang} 
                    onClick={() => handleLanguageSelect(lang)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${language === lang ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-transparent">
            <button onClick={() => toggleSection('ai')} className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                {/* Translated Notesroom AI */}
                <span className="text-sm md:text-base font-medium">{t.notesroomAi}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${expandedSection === 'ai' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </button>
            {expandedSection === 'ai' && (
              <div className="px-5 py-4 md:py-6 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-4">
                <button 
                  onClick={() => navigate('/ai')} 
                  className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {/* Translated Use Notesroom AI */}
                  {t.useAi} 
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Translated Support Heading */}
        <h3 className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2 md:mb-3 ml-2">{t.support}</h3>

        <div className="bg-white dark:bg-[#1e1f20] rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30 overflow-hidden mb-8 md:mb-10">
          
          <div className="border-b border-gray-100 dark:border-gray-800/50">
            <button onClick={() => toggleSection('help')} className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {/* Translated Help & Support */}
                <span className="text-sm md:text-base font-medium">{t.helpSupport}</span>
              </div>
              <svg className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${expandedSection === 'help' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            {expandedSection === 'help' && (
              <div className="px-5 py-5 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50">
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {/* Translated Help Text */}
                  {t.helpText}
                  <div className="text-center text-blue-600 dark:text-blue-400 mt-2 font-medium">notesroomofficial@gmail.com</div>
                </div>
                <a href="mailto:notesroomofficial@gmail.com" className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                  {/* Translated Contact Support */}
                  {t.contactSupport}
                </a>
              </div>
            )}
          </div>

          <div>
            <button onClick={() => toggleSection('about')} className="w-full px-5 py-4 md:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {/* Translated About Notesroom */}
                <span className="text-sm md:text-base font-medium">{t.about}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] md:text-xs text-gray-400 bg-gray-100 dark:bg-[#131314] px-2.5 py-1 rounded-md font-medium">v1.0.0</span>
                <svg className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${expandedSection === 'about' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </button>
            {expandedSection === 'about' && (
              <div className="px-5 py-5 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50">
                <div className="flex justify-center mb-3">
                  <div className="mx-auto w-16 h-16 md:w-20 md:h-20 mb-5 md:mb-6 flex items-center justify-center">
                    <img 
                      src={logo} 
                      alt="Notesroom Logo" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>
                <h4 className="text-center font-bold text-gray-900 dark:text-white mb-1">Notesroom</h4>
                {/* Translated Tagline */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">{t.tagline}</p>
                <div className="text-xs text-center text-gray-400 flex flex-col gap-1">
                  <span>© 2026 Notesroom Inc.</span>
                  {/* Translated Rights Reserved */}
                  <span>{t.rights}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full px-5 py-4 md:py-5 bg-white dark:bg-[#1e1f20] rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30 flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors group"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          {/* Translated Log Out */}
          <span className="text-sm md:text-base font-bold">{t.logOut}</span>
        </button>

      </main>
    </div>
  );
}