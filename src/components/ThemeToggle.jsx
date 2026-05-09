// src/components/ThemeToggle.jsx
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { id: 'light', label: 'Light', icon: '' },
    { id: 'dark', label: 'Dark', icon: '' },
    { id: 'system', label: 'System', icon: '' }
  ];

  // Find the currently selected option to display on the main button
  const currentOption = options.find(o => o.id === theme) || options[2];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{currentOption.icon}</span>
        <span className="hidden sm:inline font-medium">{currentOption.label}</span>
        <span className="text-xs ml-1 opacity-60">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-slide-in-up">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setTheme(option.id);
                setIsOpen(false); // Close menu after selecting
              }}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                theme === option.id
                  ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}