import React, { useState, useEffect } from 'react';
import Side from '../Sidebar'

const StepCounter: React.FC = () => {
  const [steps, setSteps] = useState(0);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [lastAcceleration, setLastAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [sensitivity, setSensitivity] = useState(1.5); // Default sensitivity

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
      if (x && y && z) {
        // Calculate the change in acceleration
        const deltaX = Math.abs(x - lastAcceleration.x);
        const deltaY = Math.abs(y - lastAcceleration.y);
        const deltaZ = Math.abs(z - lastAcceleration.z);

        // Update if movement exceeds the step threshold based on sensitivity
        if (deltaX + deltaY + deltaZ > sensitivity) {
          setSteps((prevSteps) => prevSteps + 1);
        }

        // Update the last acceleration values
        setLastAcceleration({ x, y, z });
        setAcceleration({ x, y, z });
      }
    };

    // Add the motion event listener
    window.addEventListener('devicemotion', handleMotion);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [lastAcceleration, sensitivity]);

  const handleSensitivityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSensitivity(parseFloat(event.target.value));
  };

  return (< ><Side /><div className='flex'>
    <img 
  src="/logo.png"
                  className="h-10 w-10"
/> <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-900 
bg-clip-text text-transparent">
Fitness
</h1></div>
    <div className="flex flex-col items-center justify-center h-screen bg-black p-4">
      <h1 className="text-2xl font-semibold text-white mb-4">Step meter </h1>
      <div className="text-6xl font-bold text-green-500">{steps}</div>
      <p className="text-gray-600 mt-2">Steps</p>

      {/* Sensitivity Control */}
      <div className="mt-6 w-full max-w-md">
        <label htmlFor="sensitivity" className="block text-green-600 font-medium mb-2">
          Sensitivity: {sensitivity.toFixed(1)}
        </label>
        <input
  id="sensitivity"
  type="range"
  min="0"
  max="100"
  step="0.1"
  value={sensitivity}
  onChange={handleSensitivityChange}
  className="w-full accent-green-500"
/>

        <p className="text-white text-sm mt-1">
          Lower values make it more sensitive to movement, higher values make it less sensitive.
        </p>
      </div>
    </div>
    </>
  );
};

export default StepCounter;
