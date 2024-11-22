import React, { useState, useEffect } from "react";

import { X } from 'lucide-react';
import A from './a'
import C from './c'
import B from './b'


const Porn: React.FC = () => {
    const [isFirstVisit, setIsFirstVisit] = useState(!localStorage.getItem('firstVisitComplete'));
    const [showA, setShowA] = useState(false);
    const [showB, setShowB] = useState(false);
    const [showC, setShowC] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
  
    useEffect(() => {
      if (isFirstVisit) {
        // Staggered timeouts for different components
        const timeoutA = setTimeout(() => {
          setShowA(true);
        }, 2000); // A shows after 2 seconds
        
        const timeoutB = setTimeout(() => {
          setShowB(true);
        }, 4000); // B shows after 4 seconds
        
        const finalTimeout = setTimeout(() => {
          localStorage.setItem('firstVisitComplete', 'true');
          setIsFirstVisit(false);
          setShowC(true);
        }, 6000); // C shows and first visit is marked complete after 6 seconds
        
        return () => {
          clearTimeout(timeoutA);
          clearTimeout(timeoutB);
          clearTimeout(finalTimeout);
        };
      } else {
        // Subsequent visits: immediately show C
        setShowC(true);
      }
    }, [isFirstVisit]);
  
    const handleReset = () => {
      localStorage.removeItem('firstVisitComplete');
      window.location.reload();
    };
  
    return (
      <div className="relative h-screen">
       
       <div 
          className="fixed bottom-4 left-4 z-50 cursor-pointer hover:bg-red-100 rounded-full p-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowResetConfirm(true);
          }}
        >
          <X size={24} color="red" />
        </div>
  
        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
            onClick={() => setShowResetConfirm(false)}
          >
            <div 
              className="bg-white p-6 rounded-lg shadow-xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl mb-4">Reset First-Time Experience?</h2>
              <div className="flex justify-center space-x-4">
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button 
                  className="bg-gray-200 text-black px-4 py-2 rounded"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Component Rendering */}
        {isFirstVisit && (
          <>
            {showA && <A />}
            {showB && <B />}
          </>
        )}
        {showC && <C />}
      </div>
    );
  };

export default Porn;