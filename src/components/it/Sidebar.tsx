import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, LogOut } from 'lucide-react';
import { noterAuth } from "../../firebase";

interface MenuItem {
  label: string;
  path: string;
  emoji: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  { label: 'Quote', path: '/One', emoji: '❝ ❞', description: 'Manage your notes' },
  { label: 'Tracker', path: '/Cou', emoji: '📈', description: 'Manage your notes' },
  { label: 'Notes', path: '/Notes', emoji: '📝', description: 'Manage your notes' },
  { label: 'Visual Notes', path: '/Can', emoji: '🧹', description: 'Manage your notes' },
  { label: 'Music', path: '/Song', emoji: '🎶', description: 'Your music collection' },
  { label: 'Todo', path: '/todo', emoji: '🎯', description: 'Task management' },
  { label: 'Chat', path: '/Chat', emoji: '💬', description: 'Message center' },
  { label: 'WebStore', path: '/Url', emoji: '🛒', description: 'Online shopping' },
  { label: 'FlashCard', path: '/flash', emoji: '📸', description: 'Online shopping' },
  { label: 'ReboostifyAI', path: '/quote', emoji: '֎🇦🇮', description: 'Message center' },
  { label: 'Blogs', path: '/blog', emoji: '✍️', description: 'Message center' },
  { label: 'T.V', path: '/Tv', emoji: '📺', description: 'Message center' },
  { label: 'Tinder', path: '/tinder', emoji: '🔞', description: 'Dating platform' }
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Toggle Button with Animation */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 p-2 text-2xl bg-black hover:bg-gray-800 
                   text-white rounded-lg shadow-lg z-50 transition-colors duration-200"
        aria-label="Open menu"
      >
        ☰
      </motion.button>

      {/* Animated Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Animated Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-black 
                   shadow-2xl z-50 flex flex-col"
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

          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </motion.button>
        </div>

        {/* Scrollable Menu */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 
                       scrollbar-track-transparent">
          <ul className="p-3 space-y-2">
            {menuItems.map((item) => (
              <motion.li
                key={item.path}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <a
                  href={item.path}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-300 
                           hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
                {hoveredItem === item.path && item.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-sm 
                             text-gray-300 rounded-md whitespace-nowrap z-50"
                  >
                    {item.description}
                  </motion.div>
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => noterAuth.signOut()}
            className="w-full flex items-center justify-center gap-2 p-2 text-gray-300 
                     hover:text-white hover:bg-white/10 rounded-lg transition-colors 
                     duration-200 mb-4"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            Made with <span className="text-red-500">❤️</span> by ARJUN
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;