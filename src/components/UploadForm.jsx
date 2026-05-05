// src/components/UploadForm.jsx
import { useState } from 'react';
import { documentAPI } from '../services/api';

export default function UploadForm({ onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('semester', semester);
    formData.append('subject', subject);
    formData.append('file', file);

    try {
      await documentAPI.upload(formData);
      setTitle('');
      setSemester('');
      setSubject('');
      setFile(null);
      onUploadSuccess(); 
    } catch (err) {
      console.error("Upload failed:", err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Upload New Document</h3>
      
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          placeholder="Document Title (e.g., Assignment 3)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        />
        <input 
          type="text" 
          placeholder="Semester (e.g., Semester_4)" 
          value={semester} 
          onChange={(e) => setSemester(e.target.value)} 
          required 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        />
        <input 
          type="text" 
          placeholder="Subject (e.g., IOS)" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          required 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        />
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setFile(e.target.files[0])} 
          required 
          className="px-4 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <button 
          type="submit" 
          disabled={isUploading}
          className="md:col-span-2 w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isUploading ? 'Uploading to Supabase...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
}