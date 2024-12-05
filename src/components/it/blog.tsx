import React, { useState, useEffect } from 'react';
import getCurrentUser from '../../firebase/utils/getCurrentUser';

// Define the user type explicitly
type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser ? {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
    } : null);
  }, []);

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-lg max-w-md mx-auto mt-10">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User Information</h1>
          <p className="text-gray-700"><strong>User ID:</strong> {user.uid}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email || 'No email provided'}</p>
          <p className="text-gray-700"><strong>Display Name:</strong> {user.displayName || 'No display name set'}</p>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No user is currently logged in.</p>
      )}
    </div>
  );
};

export default UserInfo;
