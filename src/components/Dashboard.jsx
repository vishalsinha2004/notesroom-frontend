// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import ChatModal from './ChatModal';
import PdfModal from './PdfModal'; // 1. Import the new PdfModal

export default function Dashboard({ setIsLoggedIn }) {
  const [semesters, setSemesters] = useState([]);
  
  // Modal States
  const [activeChatDoc, setActiveChatDoc] = useState(null);
  const [activePdfDoc, setActivePdfDoc] = useState(null); // 2. Add state for the PDF viewer

  // Navigation State
  const [currentView, setCurrentView] = useState('semesters'); 
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    documentAPI.getAllSemesters()
      .then(response => setSemesters(response.data))
      .catch(err => {
        if (err.response && err.response.status === 401) handleLogout();
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-blue-600">Notesroom Classroom</h1>
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
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8 font-medium bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <button 
            onClick={() => setCurrentView('semesters')} 
            className={`hover:text-blue-600 transition-colors ${currentView === 'semesters' ? 'text-blue-600 font-bold' : ''}`}
          >
            All Semesters
          </button>
          
          {selectedSemester && currentView !== 'semesters' && (
            <>
              <span className="text-gray-400">/</span>
              <button 
                onClick={() => setCurrentView('subjects')} 
                className={`hover:text-blue-600 transition-colors ${currentView === 'subjects' ? 'text-blue-600 font-bold' : ''}`}
              >
                {selectedSemester.name}
              </button>
            </>
          )}

          {selectedSubject && currentView === 'documents' && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-blue-600 font-bold">{selectedSubject.name}</span>
            </>
          )}
        </div>

        {/* View 1: Semesters Grid */}
        {currentView === 'semesters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {semesters.map(sem => (
              <div 
                key={sem.id} 
                onClick={() => { setSelectedSemester(sem); setCurrentView('subjects'); }}
                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col items-center transition-all duration-200 hover:border-blue-300"
              >
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-lg font-bold text-gray-800">{sem.name}</h3>
                <p className="text-sm text-gray-500 mt-2 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  {sem.subjects.length} Subjects
                </p>
              </div>
            ))}
          </div>
        )}

        {/* View 2: Subjects Grid */}
        {currentView === 'subjects' && selectedSemester && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selectedSemester.subjects.map(sub => (
              <div 
                key={sub.id} 
                onClick={() => { setSelectedSubject(sub); setCurrentView('documents'); }}
                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col items-center transition-all duration-200 hover:border-indigo-300"
              >
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-bold text-gray-800 text-center">{sub.name}</h3>
                <p className="text-sm text-gray-500 mt-2 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  {sub.documents.length} Documents
                </p>
              </div>
            ))}
          </div>
        )}

        {/* View 3: Documents Grid */}
        {currentView === 'documents' && selectedSubject && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSubject.documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex-grow flex items-start gap-4 mb-4">
                  <div className="text-4xl">📄</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{doc.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setActiveChatDoc(doc)}
                    className="w-full bg-purple-100 text-purple-700 py-2.5 px-4 rounded-lg text-sm font-bold hover:bg-purple-200 transition-colors flex justify-center items-center gap-2"
                  >
                    ✨ Ask AI (Llama 3.1)
                  </button>
                  
                  {/* 3. UPDATED: View PDF Button now triggers the modal state instead of a link */}
                  <button 
                    onClick={() => setActivePdfDoc(doc)}
                    className="w-full bg-blue-50 text-blue-700 text-center py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    View PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Render Modals */}
      {activeChatDoc && (
        <ChatModal document={activeChatDoc} onClose={() => setActiveChatDoc(null)} />
      )}

      {activePdfDoc && (
        <PdfModal document={activePdfDoc} onClose={() => setActivePdfDoc(null)} />
      )}
    </div>
  );
}