import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import your track and cover images
import track1 from './music/Espresso.mp3';
import track2 from './music/Escaping Forever.mp3';
import track3 from './music/a.mp3';
import track13 from './music/man-his-dog-sit-hill-looking-sunset_777078-3045.avif';
import track4 from './music/Espresso.mp3';
import coverImage from './music/espresso.jpg';
import Side from './Sidebar';
import dhm from './music/dhm.mp3'
import dhm1 from './music/Mike-OHearn.webp'
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

const songsList = [
  { 
    name: 'Haddaway', 
    artist: 'Baby Dont Hurt Me', 
    src: dhm, 
    cover: dhm1 
  },
  { 
    name: 'Paul Westerberg', 
    artist: 'Good Day', 
    src: track3, 
    cover: track13 
  },
  { 
    name: 'narvent', 
    artist: 'Memory Reboot', 
    src: track1, 
    cover: coverImage 
  },
  { 
    name: '', 
    artist: 'fainted', 
    src: track4, 
    cover: coverImage 
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

  const toggleFullScreen = () => {
    const albumArt = albumArtRef.current;
    
    if (!document.fullscreenElement) {
      if (albumArt.requestFullscreen) {
        albumArt.requestFullscreen();
      } else if (albumArt.mozRequestFullScreen) { // Firefox
        albumArt.mozRequestFullScreen();
      } else if (albumArt.webkitRequestFullscreen) { // Chrome, Safari and Opera
        albumArt.webkitRequestFullscreen();
      } else if (albumArt.msRequestFullscreen) { // IE/Edge
        albumArt.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
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
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
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
  ref={albumArtRef}
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="relative w-20 h-20 " >
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
      className="object-contain w-full h-full"
    />
    
    {/* Full Screen Toggle */}
    <button 
      onClick={toggleFullScreen} 
      className="absolute top-2 right-2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
    >
      {isFullScreen ? <Minimize2 color="white" /> : <Maximize2 color="white" />}
    </button>
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
            {songsList[currentSong].artist}
          </h2>
          <p className="text-gray-400 text-xl lg:text-2xl truncate max-w-[60vw]">
            {songsList[currentSong].name || 'Untitled'}
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
            {isSongSelectorOpen ? 'Close Playlist' : 'Open Playlist'}
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