import { useState, useRef, useEffect } from 'react';
import { documentAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatModal({ document, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm your Notesroom AI. Ask me anything about "${document.title}".` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); 

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Perfect Auto-Resize Logic (Grows AND Shrinks)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(52, Math.min(scrollHeight, 150))}px`;
    }
  }, [input]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }

    try {
      const response = await documentAPI.chat(document.id, userText);
      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error communicating with the AI.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReload = async (index) => {
    if (isTyping) return;
    
    let userMsg = '';
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMsg = messages[i].text;
        break;
      }
    }
    
    if (!userMsg) return;

    const newMessages = messages.slice(0, index);
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await documentAPI.chat(document.id, userMsg);
      setMessages([...newMessages, { role: 'ai', text: response.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', text: 'Sorry, an error occurred while reloading.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleShare = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AI Response from Notesroom', text: text });
      } catch (err) {}
    } else {
      handleCopy(text, -1);
      alert('Response copied to clipboard!');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isTyping) {
        handleSend(e);
      }
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); 
  };

  return (
    <>
      <style>{`
        /* Slim Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.4);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.6);
        }
        @media (prefers-color-scheme: dark) {
          html.dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.6);
          }
          html.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(107, 114, 128, 0.8);
          }
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 h-[100dvh] bg-gray-900/60 dark:bg-gray-950/90 backdrop-blur-md z-[100] flex flex-col md:flex-row p-0 md:p-6 gap-0 md:gap-6 font-sans overflow-hidden">
        
        {/* ================= LEFT SIDE: PDF Viewer ================= */}
        <div className="h-[30%] min-h-[200px] md:h-auto md:min-h-0 flex-1 bg-white dark:bg-[#131314] md:rounded-3xl flex flex-col shadow-2xl border-b md:border border-gray-200 dark:border-gray-800 overflow-hidden relative shrink-0 md:shrink">
          
          {/* PDF Header */}
          <div className="bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 z-20 absolute top-0 w-full">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <span className="text-xl shrink-0">📄</span>
              <h2 className="font-bold text-gray-800 dark:text-[#e3e3e3] text-sm truncate" title={document.title}>
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
          <div className="flex-1 w-full bg-gray-100 dark:bg-[#131314] relative mt-[48px] md:mt-[52px]">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <svg className="animate-spin h-8 w-8 text-blue-500/50 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <iframe 
              src={`${document.file}#toolbar=0`} 
              title={document.title}
              className="absolute inset-0 w-full h-full border-0 z-10 bg-transparent custom-scrollbar"
            >
              Your browser does not support PDFs. 
            </iframe>
          </div>
        </div>

        {/* ================= RIGHT SIDE: AI Chat ================= */}
        <div className="flex-1 md:flex-none md:w-[400px] lg:w-[450px] bg-white dark:bg-[#131314] md:rounded-3xl flex flex-col shadow-2xl md:border border-gray-200 dark:border-gray-800 overflow-hidden animate-slide-in-up md:animate-slide-in-right relative">
          
          {/* Chat Header */}
          <div className="px-5 py-3.5 md:py-4 bg-transparent border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-[#1e1f20] rounded-full flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-[#e3e3e3] text-lg leading-tight"> Notesroom AI</h3>
              </div>
            </div>
            
            {/* Desktop Close Button */}
            <button 
              onClick={onClose} 
              className="hidden md:flex w-9 h-9 items-center justify-center bg-gray-100 dark:bg-[#1e1f20] hover:bg-gray-200 dark:hover:bg-[#303134] text-gray-600 dark:text-gray-300 rounded-full transition-all duration-200 hover:rotate-90"
              title="Close Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Chat History Area */}
          <div className="custom-scrollbar flex-1 p-4 md:p-5 overflow-y-auto bg-gray-50/50 dark:bg-[#131314] flex flex-col gap-4 md:gap-5 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative flex flex-col max-w-[95%] md:max-w-[90%] px-5 py-3.5 text-[14.5px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#e3e3e3] dark:bg-[#303134] text-gray-900 dark:text-[#e3e3e3] rounded-3xl rounded-br-sm' 
                    : 'bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-[#e3e3e3] rounded-3xl rounded-bl-sm'
                  }`}>

                  <div className={`markdown-body ${msg.role === 'ai' ? 'pr-2' : ''}`}>
                    {msg.role === 'ai' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-3 mb-2 text-gray-900 dark:text-[#e3e3e3]" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2 text-gray-900 dark:text-[#e3e3e3]" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-bold mt-2 mb-1 text-gray-900 dark:text-[#e3e3e3]" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                          em: ({node, ...props}) => <em className="italic" {...props} />,
                          hr: ({node, ...props}) => <hr className="my-3 border-gray-200 dark:border-gray-700/60" {...props} />,
                          table: ({node, ...props}) => <div className="overflow-x-auto mb-3 custom-scrollbar"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/60" {...props} /></div>,
                          th: ({node, ...props}) => <th className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700" {...props} />,
                          td: ({node, ...props}) => <td className="px-3 py-1.5 text-sm border-b border-gray-100 dark:border-gray-800/40" {...props} />,
                          code: (props) => {
                            const {children, className, node, ...rest} = props
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                              <pre className="custom-scrollbar bg-gray-100 dark:bg-black/50 text-gray-800 dark:text-gray-200 p-3 rounded-xl overflow-x-auto text-[13px] mb-3 border border-gray-200 dark:border-gray-800">
                                <code className={className} {...rest}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-[12px] text-blue-600 dark:text-blue-400" {...rest}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    )}
                  </div>

                  {/* AI Action Buttons */}
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-2 mt-3 pt-2">
                      <button onClick={() => handleCopy(msg.text, i)} className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#303134] text-gray-500 dark:text-gray-400 transition-colors" title="Copy response">
                        {copiedIndex === i ? <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                      </button>
                      <button onClick={() => handleReload(i)} disabled={isTyping} className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#303134] text-gray-500 dark:text-gray-400 transition-colors disabled:opacity-50" title="Regenerate">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                      </button>
                      <button onClick={() => handleShare(msg.text)} className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#303134] text-gray-500 dark:text-gray-400 transition-colors" title="Share">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-transparent px-5 py-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-3 md:p-4 bg-white dark:bg-[#131314] shrink-0 border-t border-gray-100 dark:border-gray-800/50">
            <form onSubmit={handleSend} className="relative flex items-end bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[28px] focus-within:shadow-sm border border-transparent dark:border-gray-800/30 transition-all duration-200">
              
              <textarea 
                ref={textareaRef}
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="Ask about this document..." 
                disabled={isTyping}
                rows={1}
                className="custom-scrollbar w-full pl-5 pr-14 py-3.5 bg-transparent text-gray-900 dark:text-[#e3e3e3] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none leading-relaxed overflow-y-auto rounded-[28px] text-[14px]"
                style={{ minHeight: '52px' }}
              />
              
              <div className="absolute right-2 bottom-1.5">
                <button 
                  type="submit" 
                  disabled={isTyping || !input.trim()}
                  className="w-9 h-9 flex items-center justify-center bg-gray-200 dark:bg-[#303134] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 disabled:opacity-50 disabled:hover:bg-gray-200 dark:disabled:hover:bg-[#303134] disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300"
                >
                  <svg className="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </form>
            <div className="text-center mt-2.5 hidden sm:block">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Verify important information with the document.</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}