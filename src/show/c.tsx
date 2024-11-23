import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, Clock, Globe, Shield, Zap, Heart, Coffee, Book, Award } from 'lucide-react';
import A from './assets/image copy.png'
import B from './assets/image.png'
import C from './assets/image copy 2.png'
import D from './assets/image copy 3.png'
import E from './assets/image copy 4.png'
import F from './assets/image copy 5.png'


const GALLERY_IMAGES = [
  { 
    src: A,
    alt: "Store and organise your notes ",
    category: "Workspace",
    description: "Seamless team collaboration tools for enhanced productivity"
  },
  { 
    src: B, 
    alt: "Play Music",
    category: "Analytics",
    description: "Comprehensive project analytics and insights"
  },
  { 
    src: C,
    alt: "Task Manager",
    category: "Organization",
    description: "Intuitive task management and organization"
  },
  { 
    src: D,
    alt: "Real-time Updates",
    category: "Communication",
    description: "Stay updated with real-time project notifications"
  },
  
  { 
    src: E,
    alt: "Real-time Updates",
    category: "Communication",
    description: "Stay updated with real-time project notifications"
  },
  { 
    src: F,
    alt: "Dating made Simple ",
    category: "Management",
    description: "Efficient resource allocation and planning tools"
  }
];
// Types and Constants remain the same as in the original file
interface GravityAnimationProps {
    children: ReactNode;
    delay?: number;
    className?: string;
  }
  
interface ImageDropInProps {
    src: string;
    alt: string;
    delay: number;
  }

const INITIAL_DROP_HEIGHT = -1000;
const BOUNCE_STIFFNESS = 100;
const BOUNCE_DAMPING = 8;

const NAVIGATION_ITEMS = [
  { label: '🏠 Home', href: '#home' },
  { label: '✨ Features', href: '#features' },
  { label: '📊 Stats', href: '#stats' },
  { label: '💡 Solutions', href: '#solutions' },
  { label: '📞 Contact', href: '#contact' },
  { label: '📑 Terms', href: '/urlterm' }
];

const FEATURES = [
  {
    icon: <CheckCircle className="w-12 h-12 text-blue-500 mb-4" />,
    emoji: '⚡',
    title: "Streamlined Workflow",
    description: "Optimize your daily tasks with our intuitive interface"
  },
  {
    icon: <Users className="w-12 h-12 text-blue-500 mb-4" />,
    emoji: '👥',
    title: "Team Collaboration",
    description: "Work seamlessly with your team in real-time"
  },
  {
    icon: <Star className="w-12 h-12 text-blue-500 mb-4" />,
    emoji: '⭐',
    title: "Premium Features",
    description: "Access advanced tools to boost your productivity"
  },
  {
    icon: <Globe className="w-12 h-12 text-blue-500 mb-4" />,
    emoji: '🌎',
    title: "Global Access",
    description: "Work from anywhere, anytime"
  },
  {
    icon: <Shield className="w-12 h-12 text-blue-500 mb-4" />,
    emoji: '🔒',
    title: "Enterprise Security",
    description: "State-of-the-art security measures"
  },
  {
    icon: <Zap className="w-12 h-12 text-blue-500 mb-4" />,
    emoji: '⚡',
    title: "Lightning Fast",
    description: "Optimized performance for quick results"
  }
];



const STATS = [
  { number: "10K+", label: "Active Users", emoji: "👥" },
  { number: "95%", label: "Satisfaction Rate", emoji: "😊" },
  { number: "24/7", label: "Support", emoji: "🛟" },
  { number: "50+", label: "Integrations", emoji: "🔌" }
];

// Components remain similar with theme adjustments
const GravityAnimation: React.FC<GravityAnimationProps> = ({ children, delay = 0, className = "" }) => {
    return (
      <motion.div
        initial={{ y: INITIAL_DROP_HEIGHT, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: BOUNCE_STIFFNESS,
          damping: BOUNCE_DAMPING,
          mass: 1,
          delay
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };
  
const ImageDropIn: React.FC<ImageDropInProps> = ({ src, alt, delay }) => {
    return (
      <GravityAnimation delay={delay}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
        />
      </GravityAnimation>
    );
  };
  
const BackgroundImage: React.FC = () => {
    return (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 0.15 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed top-0 right-0 w-full h-full -z-10 pointer-events-none"
      >
        <img
          src={A}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </motion.div>
    );
  };

// Main Landing Page Component with Responsive Modifications
const LandingPage = () => {

  const [activeImage, setActiveImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => setIsLoaded(true), 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations after initial load
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AuthSection = () => (
    <section className="relative py-20 bg-gradient-to-b from-green to-black">
      <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm"></div>
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Begin Your Journey Today ✨
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their workflow
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto"
          >
            <Link
              to="/login"
              className="block w-full md:w-auto text-center bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Login
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto"
          >
            <Link
              to="/register"
              className="block w-full md:w-auto text-center bg-green-900 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Register
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
  
  
  const ImageGallerySection = () => (
    <section className="py-24 bg-gradient-to-b from-green to-black">
      {/* Main Heading and Description */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
           Tools We Offer
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover how our cutting-edge features transform the way teams work together. 
            Experience seamless collaboration and enhanced productivity.
          </p>
        </motion.div>
      </div>
  
      {/* Categories Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {Array.from(new Set(GALLERY_IMAGES.map(img => img.category))).map((category, index) => (
            <button
              key={index}
              className="px-6 py-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 
                       transition-all duration-300 text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>
  
      {/* Image Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="group relative rounded-2xl border-4 border-blue-500/10 
                        shadow-2xl transition-all duration-300 hover:border-blue-500/30 
                        hover:shadow-blue-500/20 bg-gray-800"
            >
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 
                            to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                            rounded-xl" />
              
              {/* Image */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto rounded-xl transform transition-transform 
                         duration-500 group-hover:scale-110"
              />
              
              {/* Image Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 
                            group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 
                               rounded-full text-sm font-medium mb-3">
                  {image.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {image.alt}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed opacity-0 
                             group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {image.description}
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto"
          >
            <Link
              to="/login"
              className="block w-full md:w-auto text-center bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Login
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto"
          >
            <Link
              to="/register"
              className="block w-full md:w-auto text-center bg-green-900 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Register
            </Link>
          </motion.div>
        </div>
              </div>
            </motion.div>
          ))}
        </div>
  
        {/* Bottom Section Description */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our platform is designed to empower teams with powerful tools and intuitive interfaces. 
            Experience the future of collaborative work.
          </p>
          <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                            rounded-xl transition-all duration-300 transform hover:scale-105 
                            shadow-lg hover:shadow-blue-500/20">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
  

  return (<>
    <AnimatePresence>
      {isLoaded && (
        <div className="min-h-screen bg-black text-white">
          {/* Responsive Navbar */}
          <nav className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
          }`}>
            <GravityAnimation delay={0.1}>
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 object-contain"
              src="/notes.svg"
              alt="logo"
            />
           <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 
               bg-clip-text text-transparent">
  Reboostify
</h1></div>

                
                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white focus:outline-none"
                  >
                    {isMobileMenuOpen ? '✕' : '☰'}
                  </button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-6">
                  {NAVIGATION_ITEMS.map((item, index) => (
                    <GravityAnimation key={index} delay={0.1 + index * 0.1}>
                      <a href={item.href} className="text-gray-300 hover:text-blue-500 transition-colors">
                        {item.label}
                      </a>
                    </GravityAnimation>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex space-x-4">
                  <GravityAnimation delay={0.8}>
                    <Link to="/login" className="text-gray-300 hover:text-white">
                      🔑 Login
                    </Link>
                  </GravityAnimation>
                  <GravityAnimation delay={0.9}>
                    <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                      Get Started 🎯
                    </Link>
                  </GravityAnimation>
                </div>
              </div>
            </GravityAnimation>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 bg-black z-40">
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  {NAVIGATION_ITEMS.map((item, index) => (
                    <a 
                      key={index} 
                      href={item.href} 
                      className="text-2xl text-gray-300 hover:text-blue-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="flex space-x-4 mt-8">
                    <Link 
                      to="/login" 
                      className="text-gray-300 hover:text-white text-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      🔑 Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started 🎯
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>
          <AuthSection />
          
          {/* Add Image Gallery before Features section */}
          <ImageGallerySection />
          <main className="pt-20">
            {/* Hero Section - Responsive Adjustments */}
          

            {/* Features Section - Responsive Adjustments */}
            <section className="bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h3 className="text-4xl font-bold mb-6 text-white">
                  Why Choose Reboostify? 🚀
                </h3>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Experience the perfect blend of power and simplicity
                </p>
              </motion.div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className="group"
                  >
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-800/80">
                      <div className="flex justify-center items-center mb-6">
                        <div className="p-4 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </div>
                      <h4 className="text-2xl font-semibold mb-4 text-white">
                        {feature.title} {feature.emoji}
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

            {/* Stats Section - Responsive Adjustments */}
            <section className="bg-black py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {STATS.map((stat, index) => (
                    <GravityAnimation key={index} delay={2.0 + index * 0.1}>
                      <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="text-5xl mb-4">{stat.emoji}</div>
                        <div className="text-4xl font-bold text-blue-500 mb-2">
                          {stat.number}
                        </div>
                        <div className="text-gray-300">{stat.label}</div>
                      </div>
                    </GravityAnimation>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section - Responsive Adjustments */}
            <section   className="bg-blue-700 text-white py-20">
              <GravityAnimation delay={2.4}>
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to Transform Your Workflow? 🎯
                  </h3>
                  <p className="text-base md:text-lg mb-8">
                    Join thousands of satisfied users today! ✨
                  </p>
                  <Link to="/register" className="bg-white text-blue-700 px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                    Start Your Free Trial 🚀 <ArrowRight size={20} />
                  </Link>
                </div>
              </GravityAnimation>
            </section>
          </main>


          {/* Footer - Responsive and Dark Theme Adjustments */}
          <footer  className="bg-gray-900 text-gray-400 py-12">
            <GravityAnimation delay={2.6}>
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h4 className="text-2xl text-blue-500 font-bold mb-6">
                  🚀 Reboostify
                </h4>
                <p className="mb-8">Making productivity simple and efficient. ✨</p>
                <div className="flex justify-center space-x-6 flex-wrap">
                  {['Twitter 🐦', 'LinkedIn 💼', 'GitHub 🐙', 'Discord 💭'].map((social, index) => (
                    <a 
                      key={index} 
                      href="#" 
                      className="m-2 text-gray-300 hover:text-white transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
                <div className="mt-8 text-sm text-gray-500">
                  <div className="flex justify-center space-x-4 mb-4">
                    <a href="#" className="hover:text-white">Privacy Policy</a>
                    <a href="#" className="hover:text-white">Terms of Service</a>
                    <a href="#" className="hover:text-white">Contact Us</a>
                  </div>
                  <p>&copy; 2024 Reboostify. All rights reserved.</p>
                </div>
              </div>
            </GravityAnimation>
          </footer>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default LandingPage;