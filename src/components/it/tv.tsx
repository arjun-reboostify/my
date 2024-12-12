import React, { 
  useState, 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo 
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import A from './video/YouCut_20241212_152946550.mp4'
import B from './video//YouCut_20241212_171351362.mp4'
import D from './video/YouCut_20241212_174907902.mp4'
import E from './video/YouCut_20241212_175514596.mp4'
import C from './video/YouCut_20241212_175925267.mp4'
import F from './video/YouCut_20241212_180509379.mp4'
import G from './video/YouCut_20241212_180731203.mp4'
import H from './video/YouCut_20241212_180943917.mp4'

interface Reel {
  id: string;
  videoUrl: string;
  username: string;
  caption: string;
  profilePic?: string;
}

const ReelsPlayer: React.FC = () => {
  const reels: Reel[] = [
   
    { 
      id: '2', 
      videoUrl: F, 
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '3', 
      videoUrl:G, 
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '4', 
      videoUrl: H, 
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '1', 
      videoUrl: C, 
      username: '@creator1',
      caption: 'Amazing sunset vibes! 🌅 #nature',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '5', 
      videoUrl: E, 
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '5', 
      videoUrl: A, 
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '5', 
      videoUrl: B, 
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '5', 
      videoUrl: D, 
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
  ];

  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [videoState, setVideoState] = useState({
    isPlaying: true,
    isMuted: false,
    progress: 0,
    isLocked: false
  });

  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeLockTimerRef = useRef<NodeJS.Timeout | null>(null);

  const videoControls = useMemo(() => ({
    togglePlayPause: (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      const currentVideo = videosRef.current[currentReelIndex];
      if (!currentVideo) return;

      if (currentVideo.paused) {
        currentVideo.play().catch(console.error);
        setVideoState(prev => ({ ...prev, isPlaying: true }));
      } else {
        currentVideo.pause();
        setVideoState(prev => ({ ...prev, isPlaying: false }));
      }
    },
    toggleMute: () => {
      const currentVideo = videosRef.current[currentReelIndex];
      if (!currentVideo) return;

      currentVideo.muted = !currentVideo.muted;
      setVideoState(prev => ({
        ...prev,
        isMuted: currentVideo.muted
      }));
    },
    seekVideo: (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentVideo = videosRef.current[currentReelIndex];
      if (!currentVideo) return;
    
      const seekTime = parseFloat(e.target.value);
      currentVideo.currentTime = (seekTime / 100) * currentVideo.duration;
      
      setVideoState(prev => ({
        ...prev,
        progress: seekTime
      }));
    },
  }), [currentReelIndex]);

  const navigateReels = useCallback((direction: 'up' | 'down') => {
    if (videoState.isLocked) return;

    const totalReels = reels.length;
    const newIndex = direction === 'up' 
      ? (currentReelIndex + 1) % totalReels 
      : (currentReelIndex - 1 + totalReels) % totalReels;

    const currentVideo = videosRef.current[currentReelIndex];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }

    setCurrentReelIndex(newIndex);
    setVideoState(prev => ({
      ...prev, 
      progress: 0, 
      isPlaying: true,
      isLocked: true
    }));

    const nextVideo = videosRef.current[newIndex];
    if (nextVideo) {
      nextVideo.play().catch(console.error);
    }

    swipeLockTimerRef.current = setTimeout(() => {
      setVideoState(prev => ({ ...prev, isLocked: false }));
    }, 800);

  }, [currentReelIndex, reels.length, videoState.isLocked]);

  const handleSwipe = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    
    const startY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const handleMove = (moveEvent: TouchEvent | MouseEvent) => {
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : (moveEvent as MouseEvent).clientY;
      const deltaY = currentY - startY;
      
      if (Math.abs(deltaY) > 50) {
        navigateReels(deltaY < 0 ? 'up' : 'down');
        
        // Remove event listeners after swipe
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchend', handleEnd);
        document.removeEventListener('mouseup', handleEnd);
      }
    };
    
    const handleEnd = () => {
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mouseup', handleEnd);
    };
    
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('mouseup', handleEnd);
  }, [navigateReels]);

  useEffect(() => {
    const currentVideo = videosRef.current[currentReelIndex];
    if (!currentVideo) return;

    const trackProgress = () => {
      const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
      setVideoState(prev => ({
        ...prev,
        progress,
        isPlaying: !currentVideo.paused
      }));

      if (progress >= 99.9) {
        navigateReels('up');
      }
    };

    const progressInterval = setInterval(trackProgress, 100);
    return () => clearInterval(progressInterval);
  }, [currentReelIndex, navigateReels]);

  useEffect(() => {
    return () => {
      if (swipeLockTimerRef.current) {
        clearTimeout(swipeLockTimerRef.current);
      }
    };
  }, []);

  return (
    <div 
  ref={containerRef}
  className="relative w-full max-w-md h-[calc(100vh-20px)] mx-auto overflow-hidden rounded-xl touch-none select-none"
  onTouchStart={(e) => {
    // Check if the touch is on the slider
    if (e.target instanceof HTMLInputElement && e.target.type === 'range') {
      return;
    }
    handleSwipe(e);
  }}
  onMouseDown={(e) => {
    // Check if the click is on the slider
    if (e.target instanceof HTMLInputElement && e.target.type === 'range') {
      return;
    }
    handleSwipe(e);
  }}
>
      <AnimatePresence>
        {reels.map((reel, index) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: index === currentReelIndex ? 1 : 0, 
              scale: index === currentReelIndex ? 1 : 0.9 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
            className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
            onClick={videoControls.togglePlayPause}
          >
            <video
              ref={(el) => { videosRef.current[index] = el; }}
              src={reel.videoUrl}
              className="w-full h-full object-cover"
              playsInline
              muted={videoState.isMuted}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-xl" />

            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="flex items-center">
                <img 
                  src={reel.profilePic} 
                  alt={reel.username} 
                  className="w-10 h-10 rounded-full mr-3 border-2 border-white"
                />
                <div>
                  <div className="font-bold text-white text-sm">{reel.username}</div>
                  <div className="text-xs text-gray-200">{reel.caption}</div>
                </div>
              </div>

              {videoState.isLocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/30 z-50"
                />
              )}

             {/* Video Seek Slider */}
{/* Video Seek Slider */}
<div 
  className="absolute top-0 left-0 right-0 z-[60]"
  onClick={(e) => e.stopPropagation()}
>
  <input 
    type="range" 
    min="0" 
    max="100" 
    value={videoState.progress} 
    onChange={videoControls.seekVideo}
    className="w-full h-4 bg-transparent appearance-none cursor-pointer 
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:w-4 
      [&::-webkit-slider-thumb]:h-4 
      [&::-webkit-slider-thumb]:bg-white 
      [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-track]:h-1 
      [&::-webkit-slider-track]:bg-white/30
      [&::-moz-range-thumb]:appearance-none 
      [&::-moz-range-thumb]:w-4 
      [&::-moz-range-thumb]:h-4 
      [&::-moz-range-thumb]:bg-white
      [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-track]:h-1 
      [&::-moz-range-track]:bg-white/30"
    style={{
      background: `linear-gradient(to right, white ${videoState.progress}%, rgba(255,255,255,0.3) ${videoState.progress}%)`
    }}
  />
</div>

              {!videoState.isPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Play className="w-16 h-16 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateReels('down')}
          className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition"
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateReels('up')}
          className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={videoControls.toggleMute}
        className="absolute top-4 right-4 z-50 bg-black/50 rounded-full p-2"
      >
        {videoState.isMuted ? <VolumeX color="white" /> : <Volume2 color="white" />}
      </motion.button>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {reels.map((_, index) => (
          <div 
            key={index} 
            className={`h-1 w-8 rounded-full transition-colors duration-300 ${
              index === currentReelIndex 
                ? 'bg-white' 
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReelsPlayer;