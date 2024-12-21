import React, { useState } from 'react';
import { noterFirestore, firebaseTimestamp } from '../firebase/index';
import getCurrentUser from '../firebase/utils/getCurrentUser';

// Define the form data interface
interface FormData {
  name: string;
  email: string;
  message: string;
  preference: string;
}

const InputForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    preference: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Define the options for multiple choice
  const preferenceOptions = [
    { value: 'option1', label: 'Desktop Application' },
    { value: 'option2', label: 'Mobile Application' },
    { value: 'option3', label: 'Web Application' },
    { value: 'option4', label: 'Cross-platform Application' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('No user found. Please log in first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formRef = noterFirestore
        .collection('app')
        .doc(currentUser.uid)
        .collection('formInputs');

      await formRef.add({
        ...formData,
        createdAt: firebaseTimestamp()
      });

      setSuccessMessage('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '', preference: '' });
    } catch (err) {
      setError('Failed to submit the form: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
    <div className='flex'>
    <img 
  src="/logo.png"
                  className="h-10 m-5 w-10"
/> <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 mb-16 m-5
bg-clip-text text-transparent">
Blackboard
</h1></div>
      <h2 className="text-2xl font-bold text-white mb-16">Submit Your Details</h2>
      {error && <div className="bg-red-600 text-white p-3 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-600 text-white p-3 rounded mb-4">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-400 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-400 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-400 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            rows={4}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Preferred Application Type</label>
          <div className="space-y-2">
            {preferenceOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="preference"
                  value={option.value}
                  checked={formData.preference === option.value}
                  onChange={handleInputChange}
                  className="mr-2 text-green-500 focus:ring-green-500"
                  required
                />
                <label htmlFor={option.value} className="text-white">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={`w-full px-6 py-2 text-white rounded-lg transition-colors ${isLoading ? 'bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;