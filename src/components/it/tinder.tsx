import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MessageCircle, ArrowLeft, ArrowRight, Info, Plus, Upload, Save,Camera } from 'lucide-react';
import Webcam from 'react-webcam';
import Side from './Sidebar';
// Sample images (replace with your actual image imports)
import A from './img/08e7afa211903fbb15f36d9bf9fc166fb52e4ad74b3c9b9bf4ea35a52d513674.webp';
import B from './img/1326cb3e-be11-4ab7-afdf-ab82bdcc0801.webp';
import C from './img/17840656cfaa0e1dffd11686d24cbd8ddafc88e2_high.webp'

// Profile Interface
interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  fullBio: string;
  imageUrl: string;
  interests: string[];
  distance: number;
  job: string;
  education: string;
}

// Mock Profiles
const mockProfiles: Profile[] = [
  {
    id: 1,
    name: 'Emma',
    age: 28,
    bio: 'Software engineer who loves hiking and coffee',
    fullBio: 'Passionate software engineer with a love for creating ioasts.',
    imageUrl: C,
    interests: ['Tech', 'Travel', 'Photography'],
    distance: 3,
    job: 'Senior Software Engineer',
    education: 'Mastence'
  },
  {
    id: 1,
    name: 'Emma',
    age: 28,
    bio: 'Software engineer who loves hiking and coffee',
    fullBio: 'Passionate software engineer with a love for creating ioasts.',
    imageUrl: A,
    interests: ['Tech', 'Travel', 'Photography'],
    distance: 3,
    job: 'Senior Software Engineer',
    education: 'Mastence'
  },
  {
    id: 2,
    name: 'Alex',
    age: 32,
    bio: 'Music producer and adventure seeker',
    fullBio: 'Music is my passion, and I spend my days creating beats and producing tracks for my next adventure.',
    imageUrl: B,
    interests: ['Music', 'Fitness', 'Cooking'],
    distance: 5,
    job: 'Music Producer',
    education: 'Bachelsic Production'
  }
];


// Profile Info Popover Component
const ProfileInfoPopover: React.FC<{ 
  profile: Profile, 
  onClose: () => void 
}> = ({ profile, onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{profile.name}'s Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-700 mb-4">{profile.fullBio}</p>
          
          <div className="space-y-2">
            <div>
              <strong>Job:</strong> {profile.job}
            </div>
            <div>
              <strong>Education:</strong> {profile.education}
            </div>
            <div>
              <strong>Interests:</strong> {profile.interests.join(', ')}
            </div>
            <div>
              <strong>Distance:</strong> {profile.distance} miles away
            </div>
            <div>
  <strong>Visit:</strong> 
  <a 
    href={`https://example.com/profile/${profile.name.toLowerCase()}`} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="ml-2 text-blue-500 hover:underline"
  >
    View Full Profile
  </a>
</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
const WebcamCapture: React.FC<{
    onCapture: (imageSrc: string) => void;
    onClose: () => void;
  }> = ({ onCapture, onClose }) => {
    const webcamRef = useRef<Webcam>(null);
  
    const capture = useCallback(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }, [webcamRef, onCapture]);
    return (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white">Take Photo</h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg mb-4"
            />
            
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={capture}
                className="bg-blue-500 text-white p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera size={24} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      );
    };
// Profile Creation Modal Component
const ProfileCreationModal: React.FC<{ 
    onClose: () => void,
    onSave: (profile: Profile) => void 
  }> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [interests, setInterests] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showWebcam, setShowWebcam] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleWebcamCapture = (imageSrc: string) => {
      setImagePreview(imageSrc);
      setShowWebcam(false);
    };
  
    const handleSave = () => {
      if (!name || !age || !bio || !imagePreview) {
        alert('Please fill in all fields and upload an image');
        return;
      }
  
      const newProfile: Profile = {
        id: Date.now(),
        name,
        age: parseInt(age),
        bio,
        fullBio: bio,
        imageUrl: imagePreview,
        interests: interests.split(',').map(i => i.trim()),
        distance: 0,
        job: 'Not specified',
        education: 'Not specified'
      };
  
      onSave(newProfile);
      onClose();
    };
  
  



  return (
    <>
    
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 dark:bg-gray-900/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Create Your Profile</h2>
        
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <input 
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea 
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input 
            type="text"
            placeholder="Interests (comma separated)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full p-2 border rounded"
          />
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
         <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white p-2 rounded flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={20} />
                <span>Upload Photo</span>
              </motion.button>

              <motion.button
                onClick={() => setShowWebcam(true)}
                className="bg-green-500 text-white p-2 rounded flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera size={20} />
                <span>Take Photo</span>
              </motion.button>
              
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="w-20 h-20 object-cover rounded"
                />
              )}
            </div>
          </div>
       
        
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={onClose}
            className="bg-gray-200 text-gray-800 p-2 rounded"
          >
            Cancel
          </button>
          <motion.button
            onClick={handleSave}
            className="bg-green-500 text-white p-2 rounded flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save size={20} />
            <span>Save Profile</span>
          </motion.button>
        </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showWebcam && (
          <WebcamCapture 
            onCapture={handleWebcamCapture}
            onClose={() => setShowWebcam(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
// Tinder Card Component
const TinderCard: React.FC<{ 
  profile: Profile, 
  onSwipe: (direction: 'left' | 'right') => void,
  onChat?: () => void,
  onMoreInfo?: () => void
}> = ({ profile, onSwipe, onChat, onMoreInfo }) => {
  const cardRef = useRef(null);

  const handleDragEnd = (_e: any, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 150) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 0.5,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div 
        className="w-full h-full rounded-2xl overflow-hidden relative"
        style={{
          backgroundImage: `url(${profile.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <motion.div 
            className="absolute bottom-4 left-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold">{profile.name}, {profile.age}</h2>
            <p className="text-sm mt-2">{profile.bio}</p>
            <div className="flex space-x-2 mt-3">
              {profile.interests.map(interest => (
                <motion.span 
                  key={interest} 
                  className="bg-white/20 px-3 py-1 rounded-full text-xs"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {interest}
                </motion.span>
              ))}
            </div>
            <p className="text-xs mt-2">{profile.distance} miles away</p>
            
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <motion.button 
                onClick={onMoreInfo}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-blue-500 text-white p-3 rounded-full shadow-xl"
              >
                <Info size={20} />
              </motion.button>
              <motion.button 
                onClick={onChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-green-500 text-white p-3 rounded-full shadow-xl"
              >
                <MessageCircle size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Tinder Clone Component
const TinderClone: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showProfileCreation, setShowProfileCreation] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    const newIndex = direction === 'right' 
      ? Math.min(currentProfileIndex + 1, profiles.length - 1)
      : Math.max(currentProfileIndex - 1, 0);
    
    setHistory(prev => [...prev, currentProfileIndex]);
    setCurrentProfileIndex(newIndex);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const lastIndex = history[history.length - 1];
      setCurrentProfileIndex(lastIndex);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleChat = () => {
    const chatUrl = '/chat'; // The target URL
    alert(`Starting chat with ${profiles[currentProfileIndex].name}`);
    window.location.href = chatUrl; // Navigate to the chat page
  };
  

  const handleAddProfile = (newProfile: Profile) => {
    setProfiles(prev => [newProfile, ...prev]);
    setCurrentProfileIndex(0);
  };

  const currentProfile = profiles[currentProfileIndex];

  return (<><Side />
    <div className=" w-full h-screen flex flex-col items-center justify-center bg-black text-white ">
      <div className="w-full max-w-md h-[70vh] relative">
        <AnimatePresence>
          {currentProfile && (
            <TinderCard 
              key={currentProfile.id} 
              profile={currentProfile} 
              onSwipe={handleSwipe}
              onChat={handleChat}
              onMoreInfo={() => setShowProfileInfo(true)}
            />
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        className="flex space-x-8 mt-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button 
          onClick={() => handleSwipe('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-red-500 text-white p-4 rounded-full shadow-xl"
        >
          <ArrowLeft size={24} />
        </motion.button>
        
        <motion.button 
          onClick={() => handleSwipe('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-green-500 text-white p-4 rounded-full shadow-xl"
        >
          <ArrowRight size={24} />
        </motion.button>
      </motion.div>

      <motion.button
        onClick={() => setShowProfileCreation(true)}
        className="absolute bottom-4 left-4 bg-white text-purple-500 p-3 rounded-full shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus size={24} />
      </motion.button>

      <AnimatePresence>
      
  {showProfileInfo && currentProfile && (
    <ProfileInfoPopover 
      profile={currentProfile} 
      onClose={() => setShowProfileInfo(false)}
    />
  )}

        {showProfileCreation && (
          <ProfileCreationModal 
            onClose={() => setShowProfileCreation(false)}
            onSave={handleAddProfile}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default TinderClone;