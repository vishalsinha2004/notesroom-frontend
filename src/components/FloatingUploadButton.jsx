// src/components/FloatingUploadButton.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { documentAPI } from '../services/api';

export default function FloatingUploadButton({ semesters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [file, setFile] = useState(null);
  
  // NEW: State for the notification checkbox (default is true)
  const [notifyUsers, setNotifyUsers] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  const availableSubjects = semesters.find(s => s.id === parseInt(selectedSemesterId))?.subjects || [];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !selectedSubjectId || !file) {
      setErrorMsg("Please fill all fields and attach a file.");
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', selectedSubjectId);
    formData.append('file', file);
    
    // NEW: Append the notification choice to the form data
    formData.append('notify_users', notifyUsers);

    try {
      await documentAPI.uploadDocument(formData);
      // UPDATED: Success message no longer mentions admin review
      setSuccessMsg("Document uploaded successfully!");
      
      setTimeout(() => {
        setIsOpen(false);
        setTitle('');
        setSelectedSemesterId('');
        setSelectedSubjectId('');
        setFile(null);
        setNotifyUsers(true);
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      setErrorMsg("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
     {/* The Modern Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-24 md:bottom-6 right-4 md:right-6 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl rounded-full shadow-lg border border-gray-100 dark:border-gray-800/60 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-emerald-900/20 transition-all duration-300 z-[60] group"
          title="Upload Document"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-full shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
        </button>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#1e1f20] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between items-center p-5 md:p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Upload Document
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 md:p-6 flex flex-col gap-4">
                
                {successMsg && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">{successMsg}</div>}
                {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">{errorMsg}</div>}

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Document Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Chapter 1 Notes" className="w-full bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Semester</label>
                  <select value={selectedSemesterId} onChange={e => { setSelectedSemesterId(e.target.value); setSelectedSubjectId(''); }} required className="w-full bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors appearance-none">
                    <option value="" disabled>Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem.id} value={sem.id}>{sem.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                  <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} required disabled={!selectedSemesterId} className="w-full bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors appearance-none disabled:opacity-50">
                    <option value="" disabled>Select Subject</option>
                    {availableSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">File</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" required className="hidden" />
                  <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 bg-gray-50 dark:bg-[#131314] rounded-xl px-4 py-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    {file ? (
                      <span className="text-sm font-medium text-green-600 truncate max-w-[200px]">{file.name}</span>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <span className="text-sm font-medium text-gray-500">Click to attach file</span>
                      </>
                    )}
                  </div>
                </div>

                {/* NEW: Notification Checkbox UI */}
                <div className="flex items-center gap-2 mt-1 px-1">
                  <input 
                    type="checkbox" 
                    id="notifyUsers" 
                    checked={notifyUsers} 
                    onChange={(e) => setNotifyUsers(e.target.checked)} 
                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <label htmlFor="notifyUsers" className="text-[13px] font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                    Send email notification to all students
                  </label>
                </div>

                <button type="submit" disabled={isUploading} className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {isUploading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : "Upload Document"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}