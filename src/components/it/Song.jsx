import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Side from './Sidebar'
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import Sweet from './music/sweet.mp3'
import Sweect from './music/swet.jpeg'
import Get from'./music/GetLow.mp3'
import Get1 from'.//img/sexy4.webp'
import Neon from './music/NEON BLADE.mp3'
import Neona from './img/sexy5.webp'
import Esc from './music/Escaping Forever.mp3'
import Vois from './music/vois.mp3'
import Vois1 from './img/sexy3.webp'
import Vois1a from './img/sexy2.webp'
const songsList = [

  { 
    name: 'sweet but psycho', 
    artist: 'ava max', 
    src: Sweet, 
    cover: Sweect 
  },
  { 
    name: 'get low', 
    artist: 'zed', 
    src: Get, 
    cover: Get1
  },
  { 
    name: 'Neon Blade', 
    artist: 'ava max', 
    src: Neon, 
    cover:Neona
  },
  { 
    name: 'Vois sur ton chemin', 
    artist: 'ava max', 
    src: Vois, 
    cover: Vois1
  },
  { 
    name: 'escaping forever', 
    artist: 'ava max', 
    src: Esc, 
    cover: Vois1a 
  },
 
 
];

const SongBox = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isSongSelectorOpen, setIsSongSelectorOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const albumArtRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(songsList[currentSong].src);
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  // Song change effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = songsList[currentSong].src;
      audioRef.current.volume = volume;
      
      if (playing) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setPlaying(false);
        });
      }
    }
  }, [currentSong]);

  // Progress and event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const updateProgress = () => {
      if (audioElement.duration) {
        setProgress((audioElement.currentTime / audioElement.duration) * 100);
      }
    };

    const handleEnd = () => {
      if (loop) {
        audioElement.currentTime = 0;
        audioElement.play();
      } else if (shuffle) {
        const randomIndex = Math.floor(Math.random() * songsList.length);
        setCurrentSong(randomIndex);
        setPlaying(true);
      } else {
        nextSong();
      }
    };

    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('ended', handleEnd);

      return () => {
        audioElement.removeEventListener('timeupdate', updateProgress);
        audioElement.removeEventListener('ended', handleEnd);
      };
    }
  }, [loop, shuffle]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setPlaying(false);
        });
      }
      setPlaying(!playing);
    }
  };

  const nextSong = useCallback(() => {
    const nextIndex = shuffle 
      ? Math.floor(Math.random() * songsList.length)
      : (currentSong + 1) % songsList.length;
    setCurrentSong(nextIndex);
    setPlaying(true);
  }, [currentSong, shuffle]);

  const prevSong = useCallback(() => {
    const prevIndex = shuffle 
      ? Math.floor(Math.random() * songsList.length)
      : (currentSong - 1 + songsList.length) % songsList.length;
    setCurrentSong(prevIndex);
    setPlaying(true);
  }, [currentSong, shuffle]);

  const seek = (e) => {
    const rect = progressBarRef.current?.getBoundingClientRect();
    if (rect && audioRef.current) {
      const pos = ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
      audioRef.current.currentTime = pos;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const selectSong = (index) => {
    setCurrentSong(index);
    setPlaying(true);
    setIsSongSelectorOpen(false);
  };

  const toggleLoop = () => {
    setLoop(!loop);
    setShuffle(false);
    if (audioRef.current) {
      audioRef.current.loop = !loop;
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
    setLoop(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

 

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);


  return (
    <div className="relative inset-0 bg-gradient-to-b from-gray-900 to-black overflow-auto">
      {/* Blurred Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
        style={{ backgroundImage: `url(${songsList[currentSong].cover})` }}
      />
      
      {/* Main Container */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Side />
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="absolute top-0 left-0 z-50 flex p-6 rounded-lg shadow-lg"
>
  <img
    src="/logo.png"
    className="h-10 w-10"
    alt="Logo"
  />
  <h1
    className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-900
               bg-clip-text text-transparent"
  >
    MUSIC
  </h1>
</motion.div>

        <motion.div 
  ref={albumArtRef}
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="relative w-25 h-25 " >
  <motion.div
    animate={{ 
      rotate: playing ? 360 : 0,
      scale: playing ? 1 : 1.05
    }}
    transition={{ 
      rotate: { 
        repeat: Infinity, 
        duration: 20, 
        ease: "linear" 
      },
      scale: { duration: 0.3 }
    }}
    className="relative w-full h-full bg-gray-900 border-8 border-gray-800 shadow-2xl hover:scale-105 transition-transform"
  >
    <img 
      src={songsList[currentSong].cover}
      alt="Album Art"
      className="cursor-pointer w-40 h-40 object-contain"
    />
    
  </motion.div>
</motion.div>



        {/* Song Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-2"
        >
          <h2 className="text-white text-3xl lg:text-4xl font-bold truncate max-w-[70vw]">
            {songsList[currentSong].name}
          </h2>
          <p className="text-gray-400 text-xl lg:text-2xl truncate max-w-[60vw]">
            {songsList[currentSong].artist || 'Untitled'}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <motion.div 
            ref={progressBarRef} 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
            onClick={seek}
          >
            <div 
              className="bg-green-500 h-full rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </motion.div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(audioRef.current?.duration || 0)}</span>
          </div>
        </div>

        {/* Controls Container */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center space-y-4 w-full max-w-md"
        >
          {/* Volume Controls */}
          <div className="w-full flex items-center space-x-2">
            <button onClick={toggleMute} className="text-white">
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none"
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-6 bg-gray-800/50 backdrop-blur-lg p-4 rounded-full shadow-2xl">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSong} 
              className="text-3xl hover:text-green-500 transition-colors"
            >
              ⏮️
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause} 
              className="text-5xl bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition-all transform hover:scale-110"
            >
              {playing ? '⏸️' : '▶️'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSong} 
              className="text-3xl hover:text-green-500 transition-colors"
            >
              ⏭️
            </motion.button>
            
            {/* Loop Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLoop}
              className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                loop ? 'bg-yellow-500' : 'bg-gray-700'
              }`}
            >
              <span className="text-2xl">🔁</span>
            </motion.button>

            {/* Shuffle Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleShuffle}
              className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                shuffle ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            >
              <span className="text-2xl">🔀</span>
            </motion.button>
          </div>

          {/* Song Selector Toggle */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSongSelectorOpen(!isSongSelectorOpen)}
            className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full mt-4 transition-colors"
          >
            {isSongSelectorOpen ? 'Close' : 'Select Song'}
          </motion.button>

          {/* Song Selector / Playlist */}
          <AnimatePresence>
            {isSongSelectorOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-md bg-gray-800/80 rounded-lg p-4 mt-4 max-h-60 overflow-y-auto"
            >
              {songsList.map((song, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectSong(index)}
                  className={`p-2 cursor-pointer hover:bg-gray-700 rounded flex items-center ${
                    currentSong === index ? 'bg-blue-600' : ''
                  }`}
                >
                  <div 
                    className="w-12 h-12 bg-cover bg-center rounded-md mr-3"
                    style={{ backgroundImage: `url(${song.cover})` }}
                  />
                  <div>
                    <span className="font-bold text-white block">{song.artist}</span>
                    <span className="text-gray-400 text-sm">{song.name || 'Untitled'}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
          )}</AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SongBox;