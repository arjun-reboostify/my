import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  LogOut, 
  Briefcase, 
  Minimize2, 
  Maximize2, 
  Menu, 
  X, 
  ChevronLeft 
} from 'lucide-react';
import { noterAuth } from "../../firebase";

interface MenuItem {
  label: string;
  path: string;
  emoji: string;
  icon?: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { label: 'Redo', path: '/', emoji: '🎯' },
  { label: 'WebStorer', path: '/Url', emoji: '🛒' },
  { label: 'Second Brain', path: '/Notes', emoji: '📝' },
  { label: 'Black Board', path: '/Can', emoji: '🧹' },
  { label: 'Tracker', path: '/Cou', emoji: '📈' },
  { label: 'Music', path: '/Song', emoji: '🎶' },
  // { label: 'Tinder', path: '/tinder', emoji: '🔞' },
  { label: 'Big Timer', path: '/tmkc', emoji: '⏳' },
  { label: 'Discussion Group', path: '/chat', emoji: '⏳' },
  { label: 'Discussion Group', path: '/fu', emoji: '⏳' },

  
];

const CompactResponsiveSidebar: React.FC = () => {
  const [sidebarState, setSidebarState] = useState<'closed' | 'mini' | 'full'>('closed');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();

  // Fullscreen toggle function (unchanged from previous version)
  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          (document.documentElement as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen toggle error", err);
    }
  };

  // Sidebar state management with swipe functionality
  const toggleSidebar = () => {
    setSidebarState(prev => {
      switch(prev) {
        case 'closed': return 'mini';
        case 'mini': return 'full';
        case 'full': return 'closed';
      }
    });
  };

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;
    };
    const handleTouchEnd = () => {
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Configurable gesture region with percentage or pixel-based options
      const gestureRegion = {
        widthPercentage: {
          min: 90, // Start from 80% of screen width
          max: 100 // To 100% of screen width
        },
        heightPercentage: {
          min: 50, // Start from 70% of screen height
          max: 90, // To 100% of screen height
        }
      };
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const swipeThreshold = 50; // Increased threshold for more deliberate gestures
      const minSwipeDistance = 30; // Minimum movement to filter out accidental touches
      
      // Check if gesture starts within the defined region
      const isInTargetRegion = 
        startX >= screenWidth * (gestureRegion.widthPercentage.min / 100) &&
        startX <= screenWidth * (gestureRegion.widthPercentage.max / 100) &&
        startY >= screenHeight * (gestureRegion.heightPercentage.min / 100) &&
        startY <= screenHeight * (gestureRegion.heightPercentage.max / 100);
      
      // Horizontal swipe logic
      if (
        isInTargetRegion && 
        Math.abs(diffX) > swipeThreshold && 
        Math.abs(diffX) > minSwipeDistance
      ) {
        if (diffX > 0 && sidebarState !== 'full') {
          // Swipe left to open/expand
          setSidebarState((prev) => (prev === 'closed' ? 'mini' : 'full'));
        } else if (diffX < 0 && sidebarState !== 'closed') {
          // Swipe right to close
          setSidebarState('closed');
        }
      }
      
      // Enhanced Vertical swipe logic with more intuitive interactions
      if (
        isInTargetRegion && 
        Math.abs(diffY) > swipeThreshold && 
        Math.abs(diffY) > minSwipeDistance
      ) {
        // Downward swipe logic
        if (diffY > 0) {
          switch (sidebarState) {
            case 'closed':
              // Swipe down from closed state opens mini sidebar
              setSidebarState('mini');
              break;
            case 'mini':
              // Swipe down from mini state reduces to closed
              setSidebarState('closed');
              break;
            case 'full':
              // Swipe down from full state reduces to mini
              setSidebarState('mini');
              break;
          }
        }
        
        // Upward swipe logic
        if (diffY < 0) {
          switch (sidebarState) {
            case 'closed':
              // Swipe up from closed state opens mini sidebar
              setSidebarState('mini');
              break;
            case 'mini':
              // Swipe up from mini state expands to full
              setSidebarState('full');
              break;
            case 'full':
              // Already in full state, no action
              break;
          }
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarState]);
  
  
  // Keyboard and outside click handling (mostly unchanged)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current && 
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setSidebarState('closed');
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarState !== 'closed') {
        setSidebarState('closed');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [sidebarState]);

  // Sidebar variants with improved animations
  const sidebarVariants = {
    mini: {
      x: 0,
      transition: { 
        type: 'tween', 
        duration: 0.3 
      }
    },
    full: {
      opacity: 1,
      transition: { 
        duration: 0.3 
      }
    },
    closed: {
      x: '100%',
      opacity: 0,
      transition: { 
        type: 'tween', 
        duration: 0.3 
      }
    }
  };

  return (
    <>
      {/* Main Menu Toggle Button - Positioned bottom right */}
      <motion.button
        ref={toggleButtonRef}
        onClick={toggleSidebar}
        initial={{ rotate: 0 }}
        animate={{ 
          rotate: sidebarState === 'closed' ? 0 : 90,
          transition: { duration: 0.3 }
        }}
        className="fixed right-0 top-0 
                   bg-black/80 text-white p-3 rounded-full z-[100] 
                   shadow-lg hover:bg-black/90 transition-all"
        aria-label="Toggle Menu"
      >
        {sidebarState === 'closed' ? <Menu size={24} /> : <X size={24} />}
      </motion.button>

      {/* Compact Emoji Menu - Positioned below toggle button */}
      <AnimatePresence>
        {(sidebarState === 'mini' || sidebarState === 'full') && (
          <motion.div
            initial={{ x: '100%' }}
            animate={sidebarState === 'mini' ? 'mini' : 'full'}
            exit={{ x: '100%' }}
            variants={sidebarVariants}
            className="fixed right-4 bottom-20 
                       w-12 bg-black/80 rounded-l-xl z-50 
                       flex flex-col py-2 space-y-1 
                       backdrop-blur-sm"
          >
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="text-xl hover:bg-white/20 p-1.5 text-center 
                           transition-colors duration-200 rounded-md
                           scale-hover touch-manipulation"
                title={item.label}
              >
                {item.emoji}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blur Background Overlay */}
      <AnimatePresence>
        {sidebarState !== 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarState('closed')}
          />
        )}
      </AnimatePresence>

      {/* Full Sidebar */}
      <AnimatePresence>
        {sidebarState === 'full' && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-72 
                       bg-black/90 backdrop-blur-lg z-[60] 
                       shadow-2xl rounded-l-xl flex flex-col 
                       touch-pan-y"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 object-contain"
                  src="/notes.svg"
                  alt="logo"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 
                  bg-clip-text text-transparent">
                  Reboostify
                </h1>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-yellow-100/20 hover:bg-yellow-100/40 
                             rounded-full transition-colors"
                  aria-label="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>
            </div>

            {/* Scrollable Menu */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin 
                            scrollbar-thumb-gray-700 scrollbar-track-transparent
                            touch-pan-y">
              <ul className="p-3 space-y-1">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative touch-manipulation"
                  >
                    <a
                      href={item.path}
                      className="flex items-center gap-3 p-2.5 rounded-lg 
                                 text-gray-300 hover:text-white 
                                 hover:bg-white/10 transition-all"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 space-y-2">
              <button
                onClick={() => noterAuth.signOut()}
                className="w-full flex items-center justify-center gap-2 p-2.5 
                           text-gray-300 hover:text-white hover:bg-white/10 
                           rounded-lg transition-colors touch-manipulation"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
              <a
                href="/yay"
                className="w-full flex items-center justify-center gap-2 p-2.5 
                           text-gray-300 hover:text-white hover:bg-white/10 
                           rounded-lg transition-colors touch-manipulation"
              >
                <Briefcase size={18} />
                <span className="font-medium">About Me</span>
              </a>
              <p className="text-xs text-gray-500 text-center flex 
                            items-center justify-center gap-2">
                Made with <span className="text-red-500">❤️</span> by ARJUN
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompactResponsiveSidebar;