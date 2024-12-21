import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { noterFirestore } from '../firebase/index';

interface UserData {
  name: string;
  email: string;
  message: string;
  preference: string;
  createdAt: {
    toDate: () => Date;
  };
}

const PreferenceStats: React.FC = () => {
  const [stats, setStats] = useState<{ name: string; count: number }[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const preferenceLabels: { [key: string]: string } = {
    'option1': 'Desktop Application',
    'option2': 'Mobile Application',
    'option3': 'Web Application',
    'option4': 'Cross-platform Application'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await noterFirestore.collectionGroup('formInputs').get();
        
        const preferences: { [key: string]: number } = {};
        const users: UserData[] = [];
        
        snapshot.forEach(doc => {
          const data = doc.data() as UserData;
          if (data.preference) {
            preferences[data.preference] = (preferences[data.preference] || 0) + 1;
            users.push(data);
          }
        });

        const formattedStats = Object.entries(preferences).map(([key, value]) => ({
          name: preferenceLabels[key] || key,
          count: value
        }));

        setStats(formattedStats);
        setUserData(users.sort((a, b) => 
          b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
        ));
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-white">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Statistics Chart Section */}
      <h2 className="text-2xl font-bold text-white mb-6">Application Preference Statistics</h2>
      <div className="w-full h-96 mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name"
              tick={{ fill: '#9CA3AF' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#10B981' }}
            />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Registry Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">User Registry</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Preference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {userData.map((user, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.createdAt.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {preferenceLabels[user.preference] || user.preference}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="max-w-xs truncate">
                      {user.message}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PreferenceStats;