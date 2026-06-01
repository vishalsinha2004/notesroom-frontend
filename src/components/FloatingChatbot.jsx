// src/components/FloatingChatbot.jsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { documentAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid'; 

export default function FloatingChatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAiPage = location.pathname === '/ai';
  const [isOpen, setIsOpen] = useState(isAiPage);
  
  // Reverted Memory: Starts fresh every time
  const [messages, setMessages] = useState([]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); 
  
  const isChatStarted = messages.length > 0;

  useEffect(() => {
    if (isAiPage) setIsOpen(true);
  }, [isAiPage]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(56, Math.min(scrollHeight, 200))}px`;
    }
  }, [input, selectedFile]); 

  const handleClose = () => {
    setIsOpen(false);
    if (isAiPage) navigate('/dashboard'); 
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file); 
    e.target.value = null; 
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Microphone feature is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true; 
    recognition.interimResults = true; 

    recognition.onstart = () => setIsListening(true);
    let currentInput = input; 

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        else interimTranscript += event.results[i][0].transcript;
      }
      setInput(currentInput + (currentInput ? ' ' : '') + finalTranscript + interimTranscript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedFile) || isTyping) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    let userText = input;
    if (selectedFile) userText = `[Attached Document: ${selectedFile.name}]\n${input}`;

    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setSelectedFile(null); 
    setIsTyping(true);
    
    if (textareaRef.current) textareaRef.current.style.height = '56px';

    try {
      const response = await documentAPI.generalChat(userText);
      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the server.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReload = async (index) => {
    if (isTyping) return;
    let userMsg = '';
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === 'user') { userMsg = messages[i].text; break; }
    }
    if (!userMsg) return;
    const newMessages = messages.slice(0, index);
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await documentAPI.generalChat(userMsg);
      setMessages([...newMessages, { role: 'ai', text: response.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', text: 'Sorry, connection error.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleShare = async (text) => {
    if (navigator.share) {
      try { await navigator.share({ title: 'AI Response', text: text }); } catch (err) {}
    } else {
      handleCopy(text, -1);
      alert('Response copied to clipboard!');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((input.trim() || selectedFile) && !isTyping) handleSend(e);
    }
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); 
    } catch (err) {}
  };

  const renderInputForm = () => (
    <div className={`w-full rounded-[34px] p-[2px] transition-all duration-300 ${
      isListening ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-rgb-bg shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-transparent'
    }`}>
      <form onSubmit={handleSend} className="relative flex flex-col w-full bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[32px] focus-within:shadow-md border border-transparent dark:border-gray-800/30 transition-all duration-200">
        
        {selectedFile && (
          <div className="relative inline-flex items-center gap-2 m-4 mb-0 px-3 py-2 bg-white dark:bg-[#131314] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-fade-in self-start z-10">
            <span className="text-lg">{selectedFile.type.includes('pdf') ? '📄' : selectedFile.type.includes('image') ? '🖼️' : '📝'}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{selectedFile.name}</span>
            <button type="button" onClick={() => setSelectedFile(null)} className="ml-1 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-red-100 hover:text-red-500 rounded-full text-[10px]">✕</button>
          </div>
        )}

        <div className="relative flex items-end w-full">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt,image/*" className="hidden" />

          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute left-3 bottom-2 w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#303134] rounded-full transition-colors z-10" title="Attach file">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v12m-6-6h12"></path></svg>
          </button>

          <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={isListening ? "Listening..." : "Ask Notesroom AI..."} disabled={isTyping} rows={1} className="custom-scrollbar w-full pl-14 pr-[120px] py-4 bg-transparent text-gray-900 dark:text-[#e3e3e3] placeholder-gray-500 focus:outline-none resize-none overflow-y-auto rounded-[32px] text-[15px]" style={{ minHeight: '56px' }} />
          
          <div className="absolute right-3 bottom-2 flex items-center gap-1 z-10">
            {!input.trim() && !isListening && !selectedFile ? (
              <button type="button" onClick={toggleListening} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-[#303134] rounded-full transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              </button>
            ) : (
              <button type="submit" disabled={isTyping} className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-[#303134] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-900 dark:text-white rounded-full transition-all disabled:opacity-50">
                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes rgb-bg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-rgb-bg { background-size: 200% 200%; animation: rgb-bg 3s ease infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.4); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(107, 114, 128, 0.6); }
      `}</style>

      {!isOpen && !isAiPage && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-24 md:bottom-6 right-4 md:right-6 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-[#1e1f20] rounded-full shadow-lg border border-gray-100 hover:scale-105 transition-all z-[60] group overflow-hidden">
          <div className="relative flex items-center justify-center">
            <svg className="w-8 h-8 md:w-10 md:h-10 animate-[spin_4s_linear_infinite]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" fill="url(#flowerGradient)"/>
              <defs><linearGradient id="flowerGradient" x1="2" y1="2" x2="22" y2="22"><stop stopColor="#3B82F6"/><stop offset="0.5" stopColor="#8B5CF6"/><stop offset="1" stopColor="#EC4899"/></linearGradient></defs>
            </svg>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-[#131314] flex flex-col animate-fade-in">
          
          <div className="flex items-center justify-between px-6 py-4 bg-transparent shrink-0 z-10 relative border-b border-gray-100 dark:border-gray-800/50">
            <button onClick={handleClose} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 bg-gray-100 dark:bg-[#1e1f20] px-4 py-2 rounded-xl font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Back
            </button>
            <h3 className="font-medium text-gray-900 dark:text-[#e3e3e3] text-lg flex items-center gap-2">
               Notesroom AI
            </h3>
            <div className="w-[100px] hidden md:block"></div>
          </div>

          {!isChatStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[80vw] h-[50vh] bg-blue-500/10 dark:bg-[#1a365d]/40 rounded-[100%] blur-[100px] pointer-events-none"></div>
              
              <h2 className="text-[2.2rem] md:text-[3rem] font-medium text-gray-800 dark:text-[#e3e3e3] mb-8 relative z-10 text-center">
                Where should we start?
              </h2>
              
              <div className="w-full max-w-3xl relative z-10">
                {renderInputForm()}
                <p className="text-center text-xs text-gray-400 mt-4">AI generated content may be inaccurate. Please verify important information.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth z-10">
                <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative flex flex-col max-w-[95%] md:max-w-[85%] px-6 py-4 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#e3e3e3] dark:bg-[#303134] text-gray-900 dark:text-[#e3e3e3] rounded-3xl rounded-br-sm' : 'bg-transparent text-gray-800 dark:text-[#e3e3e3]'}`}>
                        
                        <div className={`markdown-body ${msg.role === 'ai' ? 'pr-2' : ''}`}>
                          {msg.role === 'ai' ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: (props) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                                h2: (props) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                h3: (props) => <h3 className="text-lg font-bold mt-3 mb-2" {...props} />,
                                p: (props) => <p className="mb-3 last:mb-0" {...props} />,
                                ul: (props) => <ul className="list-disc ml-6 mb-3 space-y-1" {...props} />,
                                ol: (props) => <ol className="list-decimal ml-6 mb-3 space-y-1" {...props} />,
                                li: (props) => <li className="pl-1" {...props} />,
                                strong: (props) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                                hr: (props) => <hr className="my-4 border-gray-200 dark:border-gray-800" {...props} />,
                                table: (props) => <div className="overflow-x-auto mb-4 custom-scrollbar"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" {...props} /></div>,
                                th: (props) => <th className="px-4 py-2 bg-gray-50 dark:bg-[#1e1f20] text-left text-xs font-bold text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800" {...props} />,
                                td: (props) => <td className="px-4 py-2 text-sm border-b border-gray-100 dark:border-gray-800/50" {...props} />,
                                
                                // Reverted syntax highlighting, kept Mermaid logic
                                pre: ({ children }) => <>{children}</>,
                                code: ({ className, children, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  if (match && match[1] === 'mermaid') {
                                    return <Mermaid chart={String(children).trim()} />;
                                  }
                                  
                                  if (match) {
                                    return (
                                      <pre className="custom-scrollbar bg-gray-100 dark:bg-[#1e1f20] text-gray-800 dark:text-gray-200 p-4 rounded-xl overflow-x-auto text-sm mb-4 border border-gray-200 dark:border-gray-800">
                                        <code className={className} {...props}>
                                          {children}
                                        </code>
                                      </pre>
                                    );
                                  }
                                  return <code className="bg-gray-100 dark:bg-[#1e1f20] px-1.5 py-0.5 rounded font-mono text-[13px] text-blue-600 dark:text-blue-400" {...props}>{children}</code>;
                                }
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          ) : (
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                          )}
                        </div>

                        {msg.role === 'ai' && (
                          <div className="flex items-center gap-3 mt-4 pt-3">
                            <button onClick={() => handleCopy(msg.text, i)} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#303134] text-gray-500 transition-colors" title="Copy">
                              {copiedIndex === i ? <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                            </button>
                            <button onClick={() => handleReload(i)} disabled={isTyping} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#303134] text-gray-500 transition-colors disabled:opacity-50" title="Regenerate">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            </button>
                            <button onClick={() => handleShare(msg.text)} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#303134] text-gray-500 dark:text-gray-400 transition-colors" title="Share">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-transparent px-6 py-5 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#e3e3e3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-[#e3e3e3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-[#e3e3e3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="shrink-0 px-4 pb-6 pt-2 z-10 bg-white dark:bg-[#131314]">
                <div className="max-w-4xl mx-auto w-full">
                  {renderInputForm()}
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3 font-medium">AI generated content may be inaccurate. Please verify important information.</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}