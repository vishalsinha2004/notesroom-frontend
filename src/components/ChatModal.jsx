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
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error reading the document.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">AI Tutor</h3>
            <p className="text-xs text-blue-100 line-clamp-1">{document.title}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none shadow-sm text-sm italic">
                Llama is thinking...
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
              placeholder="Ask about this document..." 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              disabled={isTyping}
              className="bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}