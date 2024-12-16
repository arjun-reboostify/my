import React, { useState, useRef } from 'react';

type Instruction = {
  text: string;
};

const OverlayInstructions: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState<number>(0);

  const instructions: Instruction[] = [
    { text: 'To navigate tap on the upward double arrow in the bottom' },
    { text: 'Swipe up if double arraw gets hidden' },
  ];

  const instructionRef = useRef<HTMLDivElement | null>(null); // Reference to instruction box

  const handleNext = () => {
    if (currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
    }
  };

  const handleFinish = () => {
    alert('You have completed the instructions!');
    setShowInstructions(false); // Hide instructions after finishing
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close instructions if click is outside the instruction box
    if (instructionRef.current && !instructionRef.current.contains(e.target as Node)) {
      setShowInstructions(false);
    }
  };

  return (
    <div className="relative">
      {/* Toggle Icon */}
      <button
        onClick={toggleInstructions}
        className="absolute top-4 left-4  text-white text-xl z-10"
      >
        {showInstructions ? '❌' : 'ℹ'}
      </button>

      {/* Overlay */}
      {showInstructions && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-20"
          onClick={handleOverlayClick} // Handle click on the overlay
        >
          {/* Instruction Box with Transparent Frame */}
          <div
            ref={instructionRef}
            className="relative p-6 border-4 border-white rounded-md bg-transparent text-white"
          >
            <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-white z-10" />
            <div className="relative z-20 text-center">
              <p className="mb-4">{instructions[currentInstructionIndex].text}</p>
              <div className="flex justify-between">
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Next
                </button>
                {currentInstructionIndex === instructions.length - 1 && (
                  <button
                    onClick={handleFinish}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverlayInstructions;
