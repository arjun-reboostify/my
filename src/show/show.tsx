import React, { useState, useEffect } from "react";
import { X } from 'lucide-react';
import A from './a';
import B from './b';
import C from './land/c';

const Show = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(!localStorage.getItem('firstVisitComplete'));
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const [showC, setShowC] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    let timeoutA: NodeJS.Timeout;
    let timeoutB: NodeJS.Timeout;
    let finalTimeout: NodeJS.Timeout;

    if (isFirstVisit) {
      // Reset all states when starting the sequence
      setShowA(false);
      setShowB(false);
      setShowC(false);
      
      timeoutA = setTimeout(() => {
        setShowA(true);
      }, 500);
      
      timeoutB = setTimeout(() => {
        setShowB(true);
      }, 5500);
      
      finalTimeout = setTimeout(() => {
        localStorage.setItem('firstVisitComplete', 'true');
        setIsFirstVisit(false);
        setShowC(true);
      }, 8500);
    } else {
      setShowC(true);
    }

    return () => {
      clearTimeout(timeoutA);
      clearTimeout(timeoutB);
      clearTimeout(finalTimeout);
    };
  }, [isFirstVisit]);

  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem('firstVisitComplete');
    
    // Reset states without page reload
    setIsFirstVisit(true);
    setShowA(false);
    setShowB(false);
    setShowC(false);
    setShowResetConfirm(false);
  };

  return (
    <div className="relative h-screen">
      <div 
        className="fixed bottom-8 left-8 z-50 cursor-pointer hover:bg-red-100 rounded-full p-2 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setShowResetConfirm(true);
        }}
      >
        <X size={24} color="red" />
      </div>

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

export default Show;