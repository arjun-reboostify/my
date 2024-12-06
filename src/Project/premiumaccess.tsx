import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { noterAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PremiumAccess: React.FC = () => {
  const [user] = useAuthState(noterAuth);
  const [premiumCode, setPremiumCode] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  // Check for existing premium status on component mount
  useEffect(() => {
    const storedPremiumStatus = localStorage.getItem('premiumAccess');
    if (storedPremiumStatus === 'true') {
      setIsPremium(true);
    }
  }, []);

  const handlePremiumAccess = () => {
    // Simple premium code validation (replace with your preferred logic)
    if (premiumCode.trim() === '123','345') {
      setIsPremium(true);
      localStorage.setItem('premiumAccess', 'true');
      toast.success('Premium access granted!');
      
      // Redirect to home or a specific premium page
      navigate('/');
    } else {
      toast.error('Invalid premium code');
      setIsPremium(false);
    }
  };

  // If no user is logged in, redirect to login
  if (!user) {
    toast.warning('Please log in first');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Premium Access</h2>
        
        {user && (
          <div className="mb-4 text-center">
            <p className="text-xl font-semibold">{user.displayName || 'User'}</p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        )}

        {!isPremium ? (
          <>
            <div className="mb-4">
              <input 
                type="text" 
                value={premiumCode}
                onChange={(e) => setPremiumCode(e.target.value)}
                placeholder="Enter 3-digit premium code" 
                maxLength={3}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={handlePremiumAccess}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-300"
            >
              Unlock Premium Access
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-500 font-bold mb-4">✓ Premium Access Granted</p>
            <div className="space-y-2">
              <p>You now have access to:</p>
              <ul className="list-disc list-inside text-left">
                <li>Fu (Reward) Route</li>
                <li>Additional Premium Features</li>
                <li>Exclusive Content</li>
              </ul>
              <button 
                onClick={() => navigate('/Fu')}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
              >
                Go to Premium Route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumAccess;