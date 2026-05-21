// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { authAPI } from '../services/api'; 

export default function Profile({ setIsLoggedIn }) {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({ username: 'Loading...', email: 'Loading...' });
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    authAPI.getProfile()
      .then(response => {
        setUserData({
          username: response.data.username || 'User',
          email: response.data.email || 'No email provided'
        });
      })
      .catch(err => {
        console.error("Failed to fetch profile", err);
        if (err.response?.status === 401) {
          handleLogout();
        }
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

  return (
    // Background matches the Deep Dark Gemini color (#131314)
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-[#e3e3e3] transition-colors duration-300 pb-24 md:pb-12 font-sans">
      
      {/* Slim Navbar */}
      <nav className="sticky top-0 z-40 bg-[#f0f4f9]/80 dark:bg-[#131314]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/30">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/dashboard')}>
               <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e1f20] transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
               </button>
              <h1 className="text-xl font-medium tracking-tight">Settings</h1>
            </div>
            {/* Theme Toggle moved directly to Navbar on desktop and mobile for quick access */}
            <div className="scale-90">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container - Shrink max width to 2xl for a slimmer look */}
      <main className="max-w-2xl mx-auto px-4 py-6 md:py-8 animate-fade-in">
        
        {/* 1. Slim User Header */}
        <div className="flex items-center gap-4 mb-8 bg-white dark:bg-[#1e1f20] p-4 rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex shrink-0 items-center justify-center text-white text-2xl font-bold border-2 border-white dark:border-[#303134]">
            {getInitials(userData.username)}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xl font-medium text-gray-900 dark:text-[#e3e3e3] capitalize truncate">
              {userData.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {userData.email}
            </p>
            <div className="mt-1.5 inline-flex">
               <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md font-medium">Free Plan</span>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2 ml-2">Preferences</h3>
        
        {/* 2. Slim Settings List */}
        <div className="bg-white dark:bg-[#1e1f20] rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30 overflow-hidden mb-6">
          
          {/* Account Details Accordion */}
          <div className="border-b border-gray-100 dark:border-gray-800/50">
            <button 
              onClick={() => toggleSection('account')}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span className="text-sm font-medium text-gray-800 dark:text-[#e3e3e3]">Account Info</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedSection === 'account' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            
            {expandedSection === 'account' && (
              <div className="px-5 py-4 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50">
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Username</label>
                    <input type="text" value={userData.username} readOnly className="mt-1 w-full bg-gray-100 dark:bg-[#1e1f20] border-transparent rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-0 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Email Address</label>
                    <input type="email" value={userData.email} readOnly className="mt-1 w-full bg-gray-100 dark:bg-[#1e1f20] border-transparent rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-0 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Accordion */}
          <div className="border-b border-gray-100 dark:border-gray-800/50">
            <button 
              onClick={() => toggleSection('notifications')}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="text-sm font-medium text-gray-800 dark:text-[#e3e3e3]">Notifications</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedSection === 'notifications' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            
            {expandedSection === 'notifications' && (
              <div className="px-5 py-4 bg-gray-50/50 dark:bg-[#131314]/50 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">Email Alerts</p>
                  </div>
                  <div className="w-10 h-5 bg-blue-500 rounded-full flex items-center p-1 cursor-pointer">
                    <div className="bg-white w-3.5 h-3.5 rounded-full shadow-sm transform translate-x-5"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Language Row */}
          <button className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              <span className="text-sm font-medium text-gray-800 dark:text-[#e3e3e3]">Language</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-gray-500">English (US)</span>
            </div>
          </button>
        </div>

        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2 ml-2">Support</h3>

        {/* 3. Secondary Info List */}
        <div className="bg-white dark:bg-[#1e1f20] rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30 overflow-hidden mb-8">
          
          <button className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-sm font-medium text-gray-800 dark:text-[#e3e3e3]">Help & Support</span>
            </div>
          </button>

          <button className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#303134]/50 transition-colors border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-sm font-medium text-gray-800 dark:text-[#e3e3e3]">About Notesroom</span>
            </div>
            <span className="text-[11px] text-gray-400 bg-gray-100 dark:bg-[#131314] px-2 py-0.5 rounded-md">v1.0</span>
          </button>

        </div>

        {/* 4. Slim Log Out Button */}
        <button 
          onClick={handleLogout}
          className="w-full px-5 py-3.5 bg-white dark:bg-[#1e1f20] rounded-[24px] shadow-sm border border-transparent dark:border-gray-800/30 flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className="text-sm font-medium">Log Out</span>
        </button>

      </main>
    </div>
  );
}