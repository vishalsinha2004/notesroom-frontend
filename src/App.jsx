// src/App.jsx
import { useState, useEffect } from 'react'
import { documentAPI } from './services/api'

function App() {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    // Fetch documents when the app loads
    documentAPI.getAll()
      .then(response => {
        setDocuments(response.data)
      })
      .catch(error => {
        console.error("Error fetching documents:", error)
      })
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Notesroom</h1>
      <h2>Semester Files</h2>
      
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>
              {doc.subject} - {doc.title} ({doc.semester})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App