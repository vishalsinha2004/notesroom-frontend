// src/App.jsx
import { useState, useEffect } from 'react'
import { documentAPI, authAPI } from './services/api'
import UploadForm from './components/UploadForm' // <-- 1. Import the component

function App() {
  const [documents, setDocuments] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'))
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      fetchDocuments();
    }
  }, [isLoggedIn])

  const fetchDocuments = () => {
    documentAPI.getAll()
      .then(response => setDocuments(response.data))
      .catch(err => {
        console.error("Error fetching documents:", err);
        if (err.response && err.response.status === 401) {
          handleLogout();
        }
      })
  }
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.delete(id);
        // Refresh the list after deleting
        fetchDocuments(); 
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("Failed to delete document.");
      }
    }
  }

  const handleLogin = async (e) => {
    // ... (Keep your existing handleLogin code exactly the same)
    e.preventDefault();
    try {
      const response = await authAPI.login(username, password);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Invalid username or password');
    }
  }

  const handleLogout = () => {
    // ... (Keep your existing handleLogout code exactly the same)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setDocuments([]);
  }

  if (!isLoggedIn) {
    // ... (Keep your existing Login UI exactly the same)
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Notesroom Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Log In</button>
        </form>
      </div>
    )
  }

  // --- DASHBOARD UI ---
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notesroom</h1>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      
      {/* 2. Add the Upload Form here! */}
      <UploadForm onUploadSuccess={fetchDocuments} />
      
      <h2>Semester Files</h2>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map(doc => (
            <li key={doc.id} style={{ marginBottom: '10px' }}>
              <strong>{doc.subject}</strong> - {doc.title} ({doc.semester}) 
              
              <a href={doc.file} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px', color: 'blue' }}>
                [View PDF]
              </a>
              
              {/* NEW DELETE BUTTON */}
              <button 
                onClick={() => handleDelete(doc.id)}
                style={{ marginLeft: '10px', color: 'white', backgroundColor: 'red', border: 'none', padding: '2px 8px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App