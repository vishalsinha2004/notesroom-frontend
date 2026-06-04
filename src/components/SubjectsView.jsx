import React from 'react';
import { motion } from 'framer-motion';

const SubjectsView = ({ 
  selectedSemester, 
  t, 
  handleProtectedAction, 
  setSelectedSubject, 
  setCurrentView 
}) => {
  return (
    <motion.div 
      key="view-subjects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
    >
      {selectedSemester.subjects.map((sub, index) => (
        <motion.div
          key={sub.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
          onClick={() => handleProtectedAction(() => {
            setSelectedSubject(sub);
            setCurrentView('documents');
          })}
          className="group bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800/60 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-purple-900/10 transition-all duration-300 cursor-pointer flex flex-col gap-3 md:gap-4 min-h-[140px] md:min-h-[180px] relative overflow-hidden"
        >
          <div className="flex justify-between items-start w-full">
            <div className="w-12 h-12 md:w-14 md:h-14 flex shrink-0 items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-[#131314] group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-colors shrink-0">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="font-bold text-gray-900 dark:text-[#e3e3e3] text-sm md:text-lg transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">{sub.name}</h3>
            <p className="text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{sub.documents.length} {t.documents}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SubjectsView;