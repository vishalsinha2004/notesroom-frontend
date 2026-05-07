// src/components/PdfModal.jsx
export default function PdfModal({ document, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex p-4 pb-0 justify-center">
      {/* Centered, wide container for the PDF */}
      <div className="w-full max-w-5xl bg-gray-800 rounded-t-2xl overflow-hidden flex flex-col shadow-2xl animate-slide-in-up">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 flex justify-between items-center text-white border-b border-gray-700 shadow-md z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <h2 className="font-semibold text-gray-100 text-lg">{document.title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* PDF Iframe */}
        <div className="flex-1 w-full bg-gray-100">
          <iframe 
            src={document.file} 
            title={document.title}
            className="w-full h-full border-0"
          >
            Your browser does not support PDFs. 
          </iframe>
        </div>

      </div>
    </div>
  );
}