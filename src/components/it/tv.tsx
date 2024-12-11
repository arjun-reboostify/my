import React, { 
  useState, 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo 
} from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
      id: '2', 
      videoUrl: C, 
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
    progress: 0
  });

  // Refs for video and touch interactions
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Advanced navigation handler
  const navigateReels = useCallback((direction: 'up' | 'down') => {
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
      isPlaying: true
    }));

    // Play new video
    const nextVideo = videosRef.current[newIndex];
    if (nextVideo) {
      nextVideo.play().catch(console.error);
    }
  }, [currentReelIndex, reels.length]);

  // Touch and wheel interaction handler
  const handleInteraction = useCallback((e: React.TouchEvent | React.WheelEvent) => {
    if ('deltaY' in e) {
      // Wheel event (desktop)
      navigateReels(e.deltaY > 0 ? 'up' : 'down');
    } else {
      // Touch event (mobile)
      const touch = 'touches' in e ? e.touches[0] : e as unknown as Touch;
      
      if (!touchStartY.current) {
        touchStartY.current = touch.clientY;
        return;
      }

      const swipeDistance = touchStartY.current - touch.clientY;
      const minSwipeThreshold = 50;

      if (Math.abs(swipeDistance) > minSwipeThreshold) {
        navigateReels(swipeDistance > 0 ? 'up' : 'down');
        touchStartY.current = null;
      }
    }
  }, [navigateReels]);

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

  // Memoized video control handlers
  const videoControls = useMemo(() => ({
    togglePlayPause: () => {
      const currentVideo = videosRef.current[currentReelIndex];
      if (!currentVideo) return;

      currentVideo.paused 
        ? currentVideo.play().catch(console.error)
        : currentVideo.pause();

      setVideoState(prev => ({
        ...prev,
        isPlaying: !currentVideo.paused
      }));
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

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md h-[calc(100vh-20px)] mx-auto overflow-hidden rounded-xl touch-none select-none"
      onTouchStart={handleInteraction as React.TouchEventHandler}
      onTouchMove={handleInteraction as React.TouchEventHandler}
      onWheel={handleInteraction as React.WheelEventHandler}
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
              onClick={videoControls.togglePlayPause}
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
                  onClick={videoControls.togglePlayPause}
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

export default ReelsPlayer;