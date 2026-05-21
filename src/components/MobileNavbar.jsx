// src/components/MobileNavbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation(); // To track active tab

  // Navigation Items (Added Search)
  const navItems = [
    { 
      name: 'Home', 
      path: '/dashboard', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ) 
    },
    { 
      name: 'Search', 
      path: '/search', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      ) 
    },
    { 
      name: 'AI Chat', 
      path: '/ai', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ) 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ) 
    }
  ];

  return (
    // md:hidden ensures this completely disappears on desktop screens
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      
      {/* Glassmorphism background effect. 
        Supports both Light and Dark mode seamlessly.
      */}
      <div className="bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => {
            // Check if this tab is the currently active one
            const isActive = location.pathname === item.path || 
                             (item.path === '/dashboard' && location.pathname === '/');

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full py-1.5 px-2 rounded-2xl transition-all duration-300 ease-out 
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {/* Icon Container - Adds a subtle background glow if active */}
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 scale-110' : 'scale-100'}`}>
                  {item.icon}
                </div>
                
                {/* Label Text */}
                <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 font-bold' : 'opacity-70 translate-y-0.5'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}