// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import UploadForm from './UploadForm';

export default function Dashboard({ setIsLoggedIn }) {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = () => {
    documentAPI.getAll()
      .then(response => setDocuments(response.data))
      .catch(err => {
        if (err.response && err.response.status === 401) handleLogout();
      });
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.delete(id);
        fetchDocuments();
      } catch (err) { alert("Failed to delete document."); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-blue-600">Notesroom Dashboard</h1>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <UploadForm onUploadSuccess={fetchDocuments} />
        
        <h2 className="text-xl font-semibold text-gray-800 mb-6 mt-8">My Files</h2>
        
        {/* Modern Grid Layout for Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                    {doc.semester}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{doc.subject}</h3>
                  <p className="text-sm text-gray-500">{doc.title}</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-3 pt-4 border-t border-gray-100">
                <a 
                  href={doc.file} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 bg-blue-50 text-blue-700 text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  View PDF
                </a>
                <button 
                  onClick={() => handleDelete(doc.id)} 
                  className="flex-none bg-red-50 text-red-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {documents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">You haven't uploaded any files yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}