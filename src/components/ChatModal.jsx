// src/components/ChatModal.jsx
import { useState } from 'react';
import { documentAPI } from '../services/api';

export default function ChatModal({ document, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm Llama. Ask me anything about "${document.title}".` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex p-4 pb-0 gap-4">
      {/* LEFT SIDE: PDF Viewer */}
      <div className="flex-1 bg-gray-800 rounded-t-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-gray-900 p-3 flex justify-between items-center text-white border-b border-gray-700">
          <h2 className="font-semibold text-gray-200">📄 {document.title}</h2>
        </div>
        <div className="flex-1 w-full bg-white">
          {/* Embeds the PDF directly inside the app */}
          <iframe 
            src={document.file} 
            title={document.title}
            className="w-full h-full border-0"
          >
            Your browser does not support PDFs. 
          </iframe>
        </div>
      </div>

      {/* RIGHT SIDE: AI Chat */}
      <div className="w-full max-w-md bg-white rounded-t-2xl flex flex-col shadow-2xl animate-slide-in-right overflow-hidden border-l border-gray-200">
        
        {/* Chat Header */}
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="font-bold text-lg">AI Tutor</h3>
              <p className="text-xs text-blue-100">Powered by Llama 3.1</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-blue-700 hover:bg-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none shadow-sm text-sm italic flex items-center gap-2">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-75">●</span>
                <span className="animate-pulse delay-150">●</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a question..." 
              className="flex-1 px-4 py-3 bg-gray-100 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button 
              type="submit" 
              disabled={isTyping}
              className="bg-blue-600 text-white p-2 rounded-xl w-12 h-12 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
            >
              ➤
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}