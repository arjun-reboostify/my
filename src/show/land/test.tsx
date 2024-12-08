import React, { useState } from 'react';
import { 
  Home, 
  Book, 
  Users, 
  Settings, 
  ChartBar, 
  Mail, 
  Calendar, 
  Shield, 
  Bell, 
  Menu, 
  X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Book, path: '/term', label: 'Terms' },
    { icon: Users, path: '/team', label: 'Team' },
    { icon: Settings, path: '/settings', label: 'Settings' },
    { icon: ChartBar, path: '/analytics', label: 'Analytics' },
    { icon: Mail, path: '/messages', label: 'Messages' },
    { icon: Calendar, path: '/schedule', label: 'Schedule' },
    { icon: Shield, path: '/security', label: 'Security' },
    { icon: Bell, path: '/notifications', label: 'Notifications' },
    { icon: Home, path: '/dashboard', label: 'Dashboard' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-lg z-50 hidden md:block"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Company Name */}
            <div className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 100 100" 
                  className="w-10 h-10"
                >
                  <circle cx="50" cy="50" r="45" fill="#3B82F6" />
                  <path 
                    d="M30 50 Q50 30, 70 50 T110 50" 
                    stroke="white" 
                    strokeWidth="5" 
                    fill="transparent" 
                  />
                </svg>
                <span className="text-xl font-bold text-gray-800">
                  VeryThought
                </span>
              </motion.div>
            </div>

            {/* Navigation Items */}
            <div className="flex space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 300 
                  }}
                >
                  <Link 
                    to={item.path} 
                    className="text-gray-600 hover:text-blue-600 
                               transition-colors duration-300 
                               flex items-center space-x-2 
                               px-3 py-2 rounded-lg 
                               hover:bg-blue-50"
                  >
                    <item.icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        {/* Mobile Menu Toggle */}
        
        <motion.button
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.9 }}
          className="fixed top-1 right-1 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
 
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed top-0 left-0 h-[5vh] justify-center items-center w-full bg-white/80 backdrop-blur-md flex gap-4 shadow-lg z-45 md:block"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 100 100" 
                  className="w-10 h-10"
                >
                  <circle cx="50" cy="50" r="45" fill="#3B82F6" />
                  <path 
                    d="M30 50 Q50 30, 70 50 T110 50" 
                    stroke="white" 
                    strokeWidth="5" 
                    fill="transparent" 
                  />
                </svg>
                <span className="text-xl font-bold text-gray-800">
                  VeryThought
                </span>
              </motion.div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-40"
            >
              <div className="flex flex-col mt-16 space-y-2 px-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      type: "spring", 
                      stiffness: 300 
                    }}
                  >
                    <Link 
                      to={item.path} 
                      onClick={toggleMobileMenu}
                      className="flex items-center space-x-3 
                                 px-4 py-3 rounded-lg 
                                 hover:bg-blue-50 
                                 transition-colors duration-300"
                    >
                      <item.icon size={20} className="text-gray-600" />
                      <span className="text-gray-800">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NavBar;