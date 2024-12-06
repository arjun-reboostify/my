import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { noterAuth } from '../firebase';
import { toast } from 'react-toastify';

export const PremiumRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user] = useAuthState(noterAuth);
  const location = useLocation();
  const isPremium = localStorage.getItem('premiumAccess') === 'true';

  if (!user) {
    toast.warning('Please log in first');
    return <Navigate to="/show" state={{ from: location }} />;
  }

  if (!isPremium) {
    toast.warning('Premium access required');
    return <Navigate to="/premium" />;
  }

  return <>{children}</>;
};