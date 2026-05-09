// src/components/ChatModal.jsx
import { useState, useRef, useEffect } from 'react';
import { documentAPI } from '../services/api';

export default function ChatModal({ document, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm your AI Tutor. Ask me anything about "${document.title}".` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref for auto-scrolling to the bottom of the chat
  const messagesEndRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await documentAPI.chat(document.id, userText);
      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error communicating with the AI.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    // Backdrop with 100dvh to prevent mobile address bar jumping
    <div className="fixed inset-0 h-[100dvh] bg-gray-900/60 dark:bg-gray-950/90 backdrop-blur-md z-[100] flex flex-col md:flex-row p-0 md:p-6 gap-0 md:gap-6 font-sans overflow-hidden">
      
      {/* ================= LEFT SIDE: PDF Viewer ================= */}
      {/* On mobile: min 200px, 30% height. On desktop: takes remaining space perfectly */}
      <div className="h-[30%] min-h-[200px] md:h-auto md:min-h-0 flex-1 bg-white dark:bg-gray-900 md:rounded-3xl flex flex-col shadow-2xl border-b md:border border-gray-200 dark:border-gray-800 overflow-hidden relative shrink-0 md:shrink">
        
        {/* PDF Header */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 z-20 absolute top-0 w-full">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <span className="text-xl shrink-0">📄</span>
            <h2 className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate" title={document.title}>
              {document.title}
            </h2>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose} 
            className="md:hidden shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* PDF Iframe */}
        <div className="flex-1 w-full bg-gray-100 dark:bg-gray-950 relative mt-[48px] md:mt-[52px]">
          {/* Loading Spinner */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <svg className="animate-spin h-8 w-8 text-blue-500/50 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <iframe 
            src={`${document.file}#toolbar=0`} 
            title={document.title}
            className="absolute inset-0 w-full h-full border-0 z-10 bg-transparent"
          >
            Your browser does not support PDFs. 
          </iframe>
        </div>
      </div>

      {/* ================= RIGHT SIDE: AI Chat ================= */}
      {/* On mobile: takes up the rest of the flex space. On desktop: fixed width side panel */}
      <div className="flex-1 md:flex-none md:w-[400px] lg:w-[450px] bg-white dark:bg-gray-900 md:rounded-3xl flex flex-col shadow-2xl md:border border-gray-200 dark:border-gray-800 overflow-hidden animate-slide-in-up md:animate-slide-in-right relative">
        
        {/* Chat Header */}
        <div className="px-5 py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">AI Tutor</h3>
              <p className="text-[11px] text-blue-100 font-medium uppercase tracking-wider">Powered by Llama 3.1</p>
            </div>
          </div>
          
          {/* Desktop Close Button */}
          <button 
            onClick={onClose} 
            className="hidden md:flex w-9 h-9 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 hover:rotate-90"
            title="Close Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 p-4 md:p-5 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 flex flex-col gap-4 md:gap-5 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] md:max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-sm' 
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-sm'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          {/* Dummy div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area (With extra padding on bottom for mobile swipe bars) */}
        <div className="p-3 md:p-4 pb-4 md:pb-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-10 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a question..." 
              disabled={isTyping}
              className="w-full pl-4 md:pl-5 pr-14 py-3 md:py-3.5 bg-gray-100 dark:bg-gray-800 border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-gray-900 transition-all disabled:opacity-50 text-sm md:text-base"
            />
            <button 
              type="submit" 
              disabled={isTyping || !input.trim()}
              className="absolute right-1.5 md:right-2 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-500/20"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
          <div className="text-center mt-2.5 md:mt-3 hidden sm:block">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">AI can make mistakes. Verify important info in the PDF.</span>
          </div>
        </div>

      </div>
    </div>
  );
}