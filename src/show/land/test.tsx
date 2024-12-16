import React, { useState, useRef, useEffect } from 'react';
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
import S from './assets/Leonardo_Phoenix_A_sleek_professional_logo_featuring_the_lette_0.jpg'
const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Book, path: '/login', label: 'Login' },
    { icon: Users, path: '/register', label: 'Signup' },
   
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md shadow-lg z-50 hidden md:block"
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
                   <img
                src={S}
                alt="Company Logo"
                className="h-8 w-auto sm:h-10 lg:h-12"
              />
  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 
                bg-clip-text text-transparent">
                Reboostify
              </h1>
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
                    className="text-white hover:text-blue-600 
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
      <div    ref={sidebarRef} className="md:hidden fixed top-0 left-0 w-full z-50">
        {/* Mobile Menu Toggle */}
        
        <motion.button
      
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.9 }}
          className="fixed top-1 right-1 bg-black text-white p-2 rounded-full shadow-lg z-50"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
 
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed top-0 left-0 h-[5vh] justify-center items-center w-full bg-black/80 backdrop-blur-md flex gap-4 shadow-lg z-45 md:block"
                >
                  <img
                src={S}
                alt="Company Logo"
                className="h-8 w-auto sm:h-10 lg:h-12"
              />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 
                bg-clip-text text-transparent">
                Reboostify
              </h1>
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
              className="fixed top-0 left-0 h-full w-64 bg-black shadow-2xl z-40"
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
                                 hover:bg-black-50 
                                 transition-colors duration-300"
                    >
                      <item.icon size={20} className="text-white" />
                      <span className="text-white">{item.label}</span>
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