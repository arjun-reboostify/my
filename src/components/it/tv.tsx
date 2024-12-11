import React, { 
  useState, 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo 
} from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share2, 
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import A from './video/done.webm'
import B from './video/2.mp4'
import D from './video/AQMXAuOyHLHLOPIo0Rm1AfP9UdZQXUtqTZcqgUW_93Ml6SpI5VVShtgaMRuAC9C1wqFNttL3UD6K4bVX2acjIIOYkfeLmKTdLOKzar4.mp4'
import E from './video/AQNPA5uwNwKSJ0GJpGOxDhhPry1w9Zbk_o_w4ezjhDuPJDYO_FGUcHeiTvUhnjfRZLfoZ0ESJR9-aHLjMAddsI1v9CWTCGw2coUNKxY.mp4'
import C from './video/AQPgMwgHbhffk2iw4B8RUJ5woHnoiZ7sMyDh7mPAegI25WpF3CP-SeLFYnhNSQypPjPmghr9tF-pdMMQ4ZHJFlFDAeBazhPFtE1Vq6g.mp4'

// Define the type for a reel with comprehensive metadata
interface Reel {
  id: string;
  videoUrl: string;
  likes: number;
  comments: number;
  username: string;
  caption: string;
  profilePic?: string;
}

// Interactive Button Component with Animation
const InteractiveButton: React.FC<{
  icon: React.ElementType;
  count?: number;
  activeColor?: string;
}> = ({ icon: Icon, count, activeColor = 'text-white' }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsActive(!isActive)}
      className="flex flex-col items-center bg-white/20 rounded-full p-2"
    >
      <motion.div
        animate={{ 
          scale: isActive ? [1, 1.2, 1] : 1,
          color: isActive ? 'rgb(239, 68, 68)' : 'white'
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon 
          className={`w-6 h-6 ${
            isActive ? `${activeColor} fill-current` : 'text-white'
          }`} 
        />
      </motion.div>
      {count !== undefined && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs mt-1 text-white"
        >
          {isActive ? count + 1 : count}
        </motion.span>
      )}
    </motion.button>
  );
};

const ReelsPlayer: React.FC = () => {
  // Sample reels data (replace with actual data source)
  const reels: Reel[] = [
    { 
      id: '1', 
      videoUrl: A, 
      likes: 1234,
      comments: 56,
      username: '@creator1',
      caption: 'Amazing sunset vibes! 🌅 #nature',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '2', 
      videoUrl: B, 
      likes: 5678,
      comments: 123,
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '3', 
      videoUrl: C, 
      likes: 5678,
      comments: 123,
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '4', 
      videoUrl: D, 
      likes: 5678,
      comments: 123,
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
    { 
      id: '5', 
      videoUrl: E, 
      likes: 5678,
      comments: 123,
      username: '@creator2',
      caption: 'Workout motivation! 💪 #fitness',
      profilePic: '/api/placeholder/50/50'
    },
  ];

  // Enhanced state management
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [videoState, setVideoState] = useState({
    isPlaying: true,
    isMuted: false,
    progress: 0,
    isLocked: false,
    dragStart: { x: 0, y: 0 }
  });

  // Refs for video and interaction management
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeLockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Video control handlers
  const videoControls = useMemo(() => ({
    togglePlayPause: (e?: React.MouseEvent | React.TouchEvent) => {
      // Prevent event propagation to avoid conflicts
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
    }
  }), [currentReelIndex]);

  // Advanced navigation handler with lock mechanism
  const navigateReels = useCallback((direction: 'up' | 'down') => {
    // Prevent navigation if locked
    if (videoState.isLocked) return;

    const totalReels = reels.length;
    const newIndex = direction === 'up' 
      ? (currentReelIndex + 1) % totalReels 
      : (currentReelIndex - 1 + totalReels) % totalReels;

    // Pause current video and reset
    const currentVideo = videosRef.current[currentReelIndex];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }

    // Set new index and reset video state
    setCurrentReelIndex(newIndex);
    setVideoState(prev => ({
      ...prev, 
      progress: 0, 
      isPlaying: true,
      isLocked: true
    }));

    // Play new video
    const nextVideo = videosRef.current[newIndex];
    if (nextVideo) {
      nextVideo.play().catch(console.error);
    }

    // Unlock after a delay
    swipeLockTimerRef.current = setTimeout(() => {
      setVideoState(prev => ({ ...prev, isLocked: false }));
    }, 800);

  }, [currentReelIndex, reels.length, videoState.isLocked]);

  // Enhanced drag interaction handler
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const event = 'touches' in e ? e.touches[0] : e;
    setVideoState(prev => ({
      ...prev,
      dragStart: { x: event.clientX, y: event.clientY }
    }));
  }, []);

  const handleDragEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent drag if locked
    if (videoState.isLocked) return;

    const event = 'changedTouches' in e ? e.changedTouches[0] : e;
    const { x, y } = videoState.dragStart;
    const dragEndX = event.clientX;
    const dragEndY = event.clientY;

    const deltaX = Math.abs(dragEndX - x);
    const deltaY = Math.abs(dragEndY - y);
    const swipeThreshold = 50;

    if (deltaY > swipeThreshold && deltaY > deltaX) {
      // Vertical swipe
      navigateReels(dragEndY < y ? 'up' : 'down');
    } else if (deltaX <= swipeThreshold && deltaY <= swipeThreshold) {
      // Short tap, toggle play/pause
      videoControls.togglePlayPause(e);
    }
  }, [navigateReels, videoControls, videoState]);

  // Video progress and auto-navigation tracking
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

      // Auto-navigate when video completes
      if (progress >= 99.9) {
        navigateReels('up');
      }
    };

    const progressInterval = setInterval(trackProgress, 100);
    return () => clearInterval(progressInterval);
  }, [currentReelIndex, navigateReels]);

  // Cleanup effect for lock timer
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
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
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
          >
            <video
              ref={(el) => { videosRef.current[index] = el; }}
              src={reel.videoUrl}
              className="w-full h-full object-cover"
              playsInline
              muted={videoState.isMuted}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-xl" />

            {/* Reel Content Overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              {/* User Info */}
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

              {/* Interactive Buttons */}
              <div className="absolute right-4 bottom-32 flex flex-col space-y-4">
                <InteractiveButton 
                  icon={Heart}
                  count={reel.likes}
                  activeColor="text-red-500"
                />
                <InteractiveButton 
                  icon={MessageCircle}
                  count={reel.comments}
                />
                <button className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition">
                  <Share2 className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Locked Overlay */}
              {videoState.isLocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/30 z-50"
                />
              )}

              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${videoState.progress}%` }}
                  transition={{ 
                    type: 'tween', 
                    duration: 0.1 
                  }}
                  className="h-full bg-white rounded-full" 
                />
              </div>

              {/* Pause Overlay */}
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

      {/* Navigation Buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateReels('down')}className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition"
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
  
        {/* Mute Toggle */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={videoControls.toggleMute}
          className="absolute top-4 right-4 z-50 bg-black/50 rounded-full p-2"
        >
          {videoState.isMuted ? <VolumeX color="white" /> : <Volume2 color="white" />}
        </motion.button>
  
        {/* Reel Progress Indicator */}
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