// src/components/MobileNavbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const navItems = [
    { 
      name: 'Home', 
      path: '/dashboard', 
      icon: (
        // Added dynamic icon sizing (w-5/h-5 for small screens, w-6/h-6 for larger phones)
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ) 
    },
    { 
      name: 'Search', 
      path: '/search', 
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      ) 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ) 
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      
      {/* Replaced 'pb-safe' with native CSS safe-area inset to prevent over-sizing */}
      <div className="bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        
        {/* Enforced a strict, responsive height (60px on very small phones, 70px on larger ones) */}
        <div className="flex justify-around items-center h-[60px] sm:h-[70px] px-1 sm:px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path === '/dashboard' && location.pathname === '/');

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                // Removed vertical padding and used 'h-full' to let flexbox center everything perfectly
                className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ease-out 
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {/* Dynamically scaled the icon background padding */}
                <div className={`p-1 sm:p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 scale-110' : 'scale-100'}`}>
                  {item.icon}
                </div>
                
                {/* Responsive text size to prevent UI crowding */}
                <span className={`text-[9px] sm:text-[11px] mt-0.5 font-medium transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 font-bold' : 'opacity-70 translate-y-0.5'}`}>
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