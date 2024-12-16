import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Briefcase, 
  Minimize2, 
  Maximize2, 
  Menu, 
  X, 

  ChevronsUp 
} from 'lucide-react';
import { noterAuth } from "../../firebase";

interface MenuItem {
  label: string;
  path: string;
  emoji: string;
}

const menuItems: MenuItem[] = [
  { label: 'Redo', path: '/', emoji: '🎯' },
  { label: 'WebStorer', path: '/Url', emoji: '🛒' },
  { label: 'Second Brain', path: '/Notes', emoji: '📝' },
  { label: 'Black Board', path: '/Can', emoji: '🧹' },
  { label: 'Tracker', path: '/Cou', emoji: '📈' },
  { label: 'Music', path: '/Song', emoji: '🎶' },
  { label: 'Big Timer', path: '/tmkc', emoji: '⏳' },

  { label: 'Discussion Group', path: '/chat', emoji: '💬' },
];

const ResponsiveTouchSidebar: React.FC = () => {
  const [isFullNav, setIsFullNav] = useState(false);
  const [isCompactNavVisible, setIsCompactNavVisible] = useState(true);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fullscreen toggle function
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
  const [selectedEmoji, setSelectedEmoji] = useState<MenuItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Auto-hide toggle button after 2 seconds
  useEffect(() => {
    if (isCompactNavVisible) {
      toggleTimerRef.current = setTimeout(() => {
        setIsCompactNavVisible(false);
      }, 5000);
    }

    return () => {
      if (toggleTimerRef.current) {
        clearTimeout(toggleTimerRef.current);
      }
    };
  }, [isCompactNavVisible]);
  useEffect(() => {
    if (isFullNav) {
      toggleTimerRef.current = setTimeout(() => {
        setIsFullNav(false);
      }, 5000);
    }

    return () => {
      if (toggleTimerRef.current) {
        clearTimeout(toggleTimerRef.current);
      }
    };
  }, [isFullNav]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const touchDiff = touchStartY - currentY;

    // Swipe down to reveal compact nav or toggle full nav
    if (touchDiff < -50) {
      setIsCompactNavVisible(true);
    }
  };

  const toggleFullNav = () => {
    setIsFullNav(!isFullNav);
    setIsCompactNavVisible(true);
  };
  const navigationTimerRef = useRef<NodeJS.Timeout | null>(null);
 
  const handleEmojiSelect = (item: MenuItem) => {

    // Cancel previous timer if exists
  
    if (navigationTimerRef.current) {
  
     clearTimeout(navigationTimerRef.current);
  
    }
  
  
  
    // Set selected emoji
  
    setSelectedEmoji(item);
  
  
  
    // Start navigation timer
  
    navigationTimerRef.current = setTimeout(() => {
  
     // Navigate to the selected path
  
     window.location.href = item.path;
  
    }, 1000);
  
   };
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (scrollRef.current && !scrollRef.current.contains(event.target as Node)) {
        setIsCompactNavVisible(false); // Ensure this matches your state setter
        setIsFullNav(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex justify-center items-center  bottom-0 left-0 right-0 z-50">
      {/* Compact Nav Trigger (Half V-shaped) */}
      <AnimatePresence>
        {!isCompactNavVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0  transform -translate-x-1/2 
                       bg-black/50 text-white rounded-t-full 
                       w-24 h-12 flex items-center justify-center 
                       cursor-pointer hover:bg-black/80 transition-all"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onClick={() => setIsCompactNavVisible(true)}
          >
            <ChevronsUp size={24} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Navigation */}
      <AnimatePresence>
        {isCompactNavVisible && (
          <motion.div ref={scrollRef}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 
                       bg-black/80 backdrop-blur-sm 
                       flex justify-between items-center 
                       px-4 py-2 z-50"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Menu Items */}
            <div
  ref={scrollRef}
  className="relative z-50 w-full overflow-x-auto flex items-center justify-start space-x-4 py-4 scroll-smooth"
  style={{
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
  }}
>
  {menuItems.map((item) => (
    <div
      key={item.path}
      data-path={item.path}
      onClick={() => handleEmojiSelect(item)}
      className={`
        flex-shrink-0 flex flex-col items-center
        transition-all duration-300
        ${selectedEmoji?.path === item.path
          ? 'scale-150 opacity-100 shadow-2xl'
          : 'scale-100 opacity-70'}
        cursor-pointer touch-manipulation
      `}
      style={{
        scrollSnapAlign: 'center',
        willChange: 'transform, opacity',
      }}
    >
      <div
        className={`
          text-5xl sm:text-4xl md:text-5xl transition-all duration-300
          ${selectedEmoji?.path === item.path ? 'text-6xl drop-shadow-2xl' : ''}
        `}
      >
        {item.emoji}
      </div>
      {selectedEmoji?.path === item.path && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-white/80 mt-2"
        >
          {item.label}
        </motion.div>
      )}
    </div>
  ))}
</div>




{/* Navigation Indicator */}

{selectedEmoji && (

<motion.div

  initial={{ width: 0 }}

  animate={{ width: '100%' }}

  transition={{ duration: 1 }}

  className="absolute bottom-1 left-0 h-1 bg-green-800"

/>

)}
            {/* Toggle Buttons */}
            <div className="flex items-center space-x-2">
              {/* Full Navigation Toggle */}
              <motion.button 
                onClick={toggleFullNav}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 hover:bg-white/30 
                           rounded-full p-2 transition-colors"
              >
                {isFullNav ? <ChevronsUp size={20} /> : <Menu size={20} />}
              </motion.button>

              {/* Close Compact Nav */}
              <motion.button 
                onClick={() => setIsCompactNavVisible(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 hover:bg-white/30 
                           rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Navigation */}
      <AnimatePresence>
        {isFullNav && (
          <motion.div
          ref={scrollRef}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed inset-y-0 right-0 w-72 
                     bg-black/50 backdrop-blur-lg z-[60] 
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
              <motion.button

        onClick={toggleFullNav}

        whileHover={{ scale: 1.1 }}

        whileTap={{ scale: 0.9 }}

        className="bg-white/20 hover:bg-white/30 

              rounded-full p-2 transition-colors"

       >

        <X size={24} />

       </motion.button>
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
    </div>
  );
};

export default ResponsiveTouchSidebar;