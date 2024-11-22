import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, Clock, Globe, Shield, Zap, Heart, Coffee, Book, Award } from 'lucide-react';
import A from '../components/it/img/17840656cfaa0e1dffd11686d24cbd8ddafc88e2_high.webp'

// Types
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
// Constants
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
    icon: <CheckCircle className="w-12 h-12 text-green-500 mb-4" />,
    emoji: '⚡',
    title: "Streamlined Workflow",
    description: "Optimize your daily tasks with our intuitive interface"
  },
  {
    icon: <Users className="w-12 h-12 text-green-500 mb-4" />,
    emoji: '👥',
    title: "Team Collaboration",
    description: "Work seamlessly with your team in real-time"
  },
  {
    icon: <Star className="w-12 h-12 text-green-500 mb-4" />,
    emoji: '⭐',
    title: "Premium Features",
    description: "Access advanced tools to boost your productivity"
  },
  {
    icon: <Globe className="w-12 h-12 text-green-500 mb-4" />,
    emoji: '🌎',
    title: "Global Access",
    description: "Work from anywhere, anytime"
  },
  {
    icon: <Shield className="w-12 h-12 text-green-500 mb-4" />,
    emoji: '🔒',
    title: "Enterprise Security",
    description: "State-of-the-art security measures"
  },
  {
    icon: <Zap className="w-12 h-12 text-green-500 mb-4" />,
    emoji: '⚡',
    title: "Lightning Fast",
    description: "Optimized performance for quick results"
  }
];

const IMAGES = [
  { src: "/api/placeholder/400/600", alt: "Team member", delay: 0.2 },
  { src: "/api/placeholder/500/300", alt: "Workspace", delay: 0.4 },
  { src: "/api/placeholder/400/400", alt: "Product demo", delay: 0.6 },
  { src: "/api/placeholder/450/450", alt: "Features", delay: 0.8 },
  { src: "/api/placeholder/600/300", alt: "Dashboard", delay: 1.0 }
];

const STATS = [
  { number: "10K+", label: "Active Users", emoji: "👥" },
  { number: "95%", label: "Satisfaction Rate", emoji: "😊" },
  { number: "24/7", label: "Support", emoji: "🛟" },
  { number: "50+", label: "Integrations", emoji: "🔌" }
];

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
  
  // Background Image Component
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

// Main Component
const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations after initial load
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isLoaded && (
        <div className="min-h-screen bg-gray-50">
          {/* Navbar */}
          <nav className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
          }`}>
            <GravityAnimation delay={0.1}>
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-3xl text-green-500 font-bold">
                  🚀 Reboostify
                </h1>
                <div className="hidden md:flex space-x-6">
                  {NAVIGATION_ITEMS.map((item, index) => (
                    <GravityAnimation key={index} delay={0.1 + index * 0.1}>
                      <a href={item.href} className="text-gray-600 hover:text-green-500 transition-colors">
                        {item.label}
                      </a>
                    </GravityAnimation>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <GravityAnimation delay={0.8}>
                    <Link to="/login" className="text-gray-600 hover:text-gray-900">
                      🔑 Login
                    </Link>
                  </GravityAnimation>
                  <GravityAnimation delay={0.9}>
                    <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105">
                      Get Started 🎯
                    </Link>
                  </GravityAnimation>
                </div>
              </div>
            </GravityAnimation>
          </nav>

          <main className="pt-20">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center">
              <div className="max-w-7xl mx-auto px-4 py-20">
                <GravityAnimation delay={1.0}>
                  <h2 className="text-6xl font-bold text-center text-gray-900 mb-6">
                    Transform Your Workflow
                    <span className="text-green-500"> Today </span>
                    <span className="inline-block animate-bounce">🚀</span>
                  </h2>
                  <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                    Join thousands of professionals who have already elevated their productivity. ✨
                  </p>
                </GravityAnimation>

                {/* Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                  {IMAGES.map((image, index) => (
                    <ImageDropIn
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      delay={1.2 + image.delay}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-20">
              <div className="max-w-7xl mx-auto px-4">
                <GravityAnimation delay={1.5}>
                  <h3 className="text-3xl font-bold text-center mb-12">
                    Why Choose Reboostify? 🤔
                  </h3>
                </GravityAnimation>
                <div className="grid md:grid-cols-3 gap-8">
                  {FEATURES.map((feature, index) => (
                    <GravityAnimation key={index} delay={1.7 + index * 0.1}>
                      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex justify-center items-center mb-4">
                          {feature.icon}
                          <span className="text-3xl ml-2">{feature.emoji}</span>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </GravityAnimation>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {STATS.map((stat, index) => (
                    <GravityAnimation key={index} delay={2.0 + index * 0.1}>
                      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="text-5xl mb-4">{stat.emoji}</div>
                        <div className="text-4xl font-bold text-green-500 mb-2">
                          {stat.number}
                        </div>
                        <div className="text-gray-600">{stat.label}</div>
                      </div>
                    </GravityAnimation>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-green-500 text-white py-20">
              <GravityAnimation delay={2.4}>
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h3 className="text-3xl font-bold mb-4">
                    Ready to Transform Your Workflow? 🎯
                  </h3>
                  <p className="text-lg mb-8">
                    Join thousands of satisfied users today! ✨
                  </p>
                  <Link to="/register" className="bg-white text-green-500 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                    Start Your Free Trial 🚀 <ArrowRight size={20} />
                  </Link>
                </div>
              </GravityAnimation>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400 py-12">
            <GravityAnimation delay={2.6}>
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h4 className="text-2xl text-green-500 font-bold mb-6">
                  🚀 Reboostify
                </h4>
                <p className="mb-8">Making productivity simple and efficient. ✨</p>
                <div className="flex justify-center space-x-6">
                  {['Twitter 🐦', 'LinkedIn 💼', 'GitHub 🐙', 'Discord 💭'].map((social, index) => (
                    <a key={index} href="#" className="hover:text-white transition-colors">
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </GravityAnimation>
          </footer>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LandingPage;