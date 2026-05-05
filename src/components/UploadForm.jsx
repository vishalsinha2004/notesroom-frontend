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

    // When sending files, we MUST use FormData instead of standard JSON
    const formData = new FormData();
    formData.append('title', title);
    formData.append('semester', semester);
    formData.append('subject', subject);
    formData.append('file', file);

    try {
      await documentAPI.upload(formData);
      // Clear the form
      setTitle('');
      setSemester('');
      setSubject('');
      setFile(null);
      // Tell the parent component to refresh the list
      onUploadSuccess(); 
    } catch (err) {
      console.error("Upload failed:", err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
      <h3>Upload New Document</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Document Title (e.g., Assignment 3)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Semester (e.g., Semester_4)" 
          value={semester} 
          onChange={(e) => setSemester(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Subject (e.g., IOS)" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          required 
        />
        <input 
          type="file" 
          accept=".pdf" // Restrict to PDFs for now
          onChange={(e) => setFile(e.target.files[0])} 
          required 
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading to Supabase...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
}