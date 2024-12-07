import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  ScreenShareIcon, 
  Send, 
  Star, 
  MessageCircle, 
  Globe, 
  Linkedin, 
  Twitter, 


  Instagram,
  Menu,
  X,
  LogIn,
  UserPlus,
  ArrowRight
 
} from 'lucide-react';
import A from '../components/it/img/FELLOW.jpg'

const LandingPage = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  // Scroll event listener to show/hide nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsNavVisible(scrollPosition > 300); // Adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Services offered
  const services = [
    { 
      icon: '📚', 
      title: 'Online Courses', 
      description: 'Comprehensive learning paths' 
    },
    { 
      icon: '🛠️', 
      title: 'Tools', 
      description: 'Cutting-edge resources' 
    },
    { 
      icon: '📊', 
      title: 'Analytics', 
      description: 'Insightful data solutions' 
    },
    { 
      icon: '🚀', 
      title: 'Consulting', 
      description: 'Expert guidance' 
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Jane Doe',
      role: 'CEO, Tech Innovations',
      quote: '🌟 Incredible platform that transformed our learning approach!',
      avatar: '👩‍💼'
    },
    {
      name: 'John Smith',
      role: 'CTO, Digital Solutions',
      quote: '💡 The most comprehensive resource I\'ve found!',
      avatar: '👨‍💻'
    }
  ];

  // Social links
  const socialLinks = [
    { 
      icon: <Globe className="w-6 h-6" />, 
      url: 'https://website.com' 
    },
    { 
      icon: <Linkedin className="w-6 h-6" />, 
      url: 'https://linkedin.com' 
    },
    { 
      icon: <Twitter className="w-6 h-6" />, 
      url: 'https://twitter.com' 
    },
    { 
      icon: <Instagram className="w-6 h-6" />, 
      url: 'https://instagram.com' 
    }
  ];

  const productShowcase = [
    {
      icon: '🚀',
      title: 'Advanced Learning Platform',
      description: 'Cutting-edge AI-powered learning experience with personalized learning paths.',
      image: '/api/placeholder/400/300',
      features: [
        'Adaptive Curriculum',
        'Real-time Progress Tracking',
        'Interactive Modules'
      ]
    },
    {
      icon: '💡',
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: '/api/placeholder/400/300',
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
      icon: '🌐',
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image: '/api/placeholder/400/300',
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    }
  ];


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll event listener to show/hide nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsNavVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Product Showcase Items



  const renderMobileNavigation = () => (
    <div className={`fixed inset-0 bg-white z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
      <nav className="flex flex-col space-y-6 p-6">
        <a href="#courses" className="flex items-center text-xl hover:text-blue-600">
          <BookOpen className="mr-4 w-6 h-6" /> Courses
        </a>
        <a href="#resources" className="flex items-center text-xl hover:text-blue-600">
          <ScreenShareIcon className="mr-4 w-6 h-6" /> Resources
        </a>
        <a href="#contact" className="flex items-center text-xl hover:text-blue-600">
          <Send className="mr-4 w-6 h-6" /> Contact
        </a>
        <div className="border-t pt-6 flex space-x-4">
          <a 
            href="/login" 
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <LogIn className="mr-2 w-5 h-5" /> Login
          </a>
          <a 
            href="/signup" 
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            <UserPlus className="mr-2 w-5 h-5" /> Sign Up
          </a>
        </div>
      </nav>
      <button 
        onClick={() => setIsMobileMenuOpen(false)} 
        className="absolute top-4 right-4"
      >
        <X className="w-8 h-8" />
      </button>
    </div>
  );

  const renderNavbar = () => (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 100 100" 
          className="w-10 h-10"
        >
          <circle cx="50" cy="50" r="45" fill="#3B82F6" />
          <text 
            x="50" 
            y="55" 
            textAnchor="middle" 
            fill="white" 
            fontSize="30"
          >
            C
          </text>
        </svg>
        <span className="font-bold text-xl ml-2">CompanyName</span>
      </div>
      <button 
        onClick={() => setIsMobileMenuOpen(true)} 
        className="md:hidden"
      >
        <Menu className="w-8 h-8" />
      </button>
    </div>
  );

 
  return (
    <div className="min-h-screen bg-gray-50 relative">
    {/* Mobile Navigation Toggle */}
    <div className="md:hidden fixed top-4 right-4 z-50">
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>

    {/* Mobile Navigation Menu */}
    {renderNavbar()}
    {renderMobileNavigation()}

    {/* Desktop Navigation Bar */}
    {isNavVisible && (
      <nav className="hidden md:block fixed top-0 left-0 w-full bg-white shadow-md z-50 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 100 100" 
              className="w-10 h-10"
            >
              <circle cx="50" cy="50" r="45" fill="#3B82F6" />
              <text 
                x="50" 
                y="55" 
                textAnchor="middle" 
                fill="white" 
                fontSize="30"
              >
                C
              </text>
            </svg>
            <span className="font-bold text-xl">CompanyName</span>
          </div>
          
          <div className="flex space-x-6 items-center">
            <a href="#courses" className="flex items-center hover:text-blue-600">
              <BookOpen className="mr-2 w-5 h-5" /> Courses
            </a>
            <a href="#resources" className="flex items-center hover:text-blue-600">
              <ScreenShareIcon className="mr-2 w-5 h-5" /> Resources
            </a>
            <a href="#contact" className="flex items-center hover:text-blue-600">
              <Send className="mr-2 w-5 h-5" /> Contact
            </a>
            <div className="flex space-x-4">
              <a 
                href="/login" 
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <LogIn className="mr-2 w-5 h-5" /> Login
              </a>
              <a 
                href="/signup" 
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                <UserPlus className="mr-2 w-5 h-5" /> Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
    )}

      {/* Hero Section */}
      <header 
      className={`
        relative h-[60vh] w-full bg-cover bg-center flex justify-center items-center
        transition-all duration-300 ease-in-out
        ${isNavVisible ? 'mt-20' : 'mt-0'}
      `}
      style={{
        backgroundImage: `url(${A})`,
        backgroundBlendMode: 'overlay',
     
      }}
      aria-label="Hero Section"
    >
      {!isNavVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center items-center text-center px-4"
        >
          <h1 
    className="
      text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-lg tracking-tight 
      text-white text-center w-full max-w-2xl
    "
    aria-describedby="header-subtitle"
  >
    skksm
  </h1>

  {/* Subtitle */}
  <p
    id="header-subtitle"
    className="
      text-lg md:text-xl max-w-xl text-gray-200 font-medium 
      text-center mt-4
    "
  >
    mkqslqwuihdqwdqwndnqwnd hdwid
  </p>

  {/* Buttons */}
  <div
    className="
      grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 
      place-items-center mt-8 w-full max-w-4xl
    "
  >
    {/* Button 1 */}
    <a
      href="#courses"
      className="
        inline-block border border-white hover:bg-white hover:text-blue-500 
        text-white px-6 py-3 rounded-full font-semibold 
        transition duration-300 transform hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
        text-center w-full
      "
      aria-label="Explore Courses"
    >
      Explore Courses
    </a>

    {/* Button 2 */}
    <a
      href="#contact"
      className="
        inline-block border border-white hover:bg-white hover:text-blue-500 
        text-white px-6 py-3 rounded-full font-semibold 
        transition duration-300 transform hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
        text-center w-full
      "
      aria-label="Contact Us"
    >
      Contact Us
    </a>

    {/* Additional buttons */}
    <a
      href="#resources"
      className="
        inline-block border border-white hover:bg-white hover:text-blue-500 
        text-white px-6 py-3 rounded-full font-semibold 
        transition duration-300 transform hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
        text-center w-full
      "
      aria-label="Resources"
    >
      Resources
    </a>

    <a
      href="#about"
      className="
        inline-block border border-white hover:bg-white hover:text-blue-500 
        text-white px-6 py-3 rounded-full font-semibold 
        transition duration-300 transform hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
        text-center w-full
      "
      aria-label="About Us"
    >
      About Us
    </a>
  </div>

        </motion.div>
      )}
    </header>
    {/* image Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Explore Our Innovative Solutions 🌟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {productShowcase.map((product, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl"
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-full">
                    <span className="text-2xl">{product.icon}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {product.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="flex items-center text-gray-700"
                      >
                        <ArrowRight className="mr-2 w-5 h-5 text-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <a 
                    href="#" 
                    className="flex items-center justify-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="courses" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services 🚀</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md text-center hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="font-bold text-xl mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Clients Say 💬</h2>
          <div className="flex justify-center space-x-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md max-w-md"
              >
                <div className="text-5xl mb-4">{testimonial.avatar}</div>
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us 📧</h2>
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <form>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-3 mb-4 border rounded-md"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-3 mb-4 border rounded-md"
            />
            <textarea 
              placeholder="Your Message" 
              className="w-full p-3 mb-4 border rounded-md h-32"
            ></textarea>
            <button 
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer with Social Links */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto flex justify-between items-center">
          <p>© 2024 CompanyName. All Rights Reserved.</p>
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;