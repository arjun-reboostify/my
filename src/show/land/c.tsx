import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import E from './assets/a.jpg'
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
Cpu,

  Instagram,
  Menu,
  X,
  LogIn,
  UserPlus,
  ArrowRight
 
} from 'lucide-react';
import Nav from './test'
import Contact from './Contactform'
import Hero from './hero'

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
      icon: '🛠️', 
      title: 'Tools', 
      description: 'Cutting-edge resources' 
    },
    { 
      icon: '📚', 
      title: 'Online Courses', 
      description: 'Comprehensive learning paths' 
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
      icon: <Cpu />,
      title: 'Advanced Fare Calculating Algorithm',
      description: 'We can calculate the best fare keeping in mind the driver\'s profit and ours too.',
      image: E,
      features: [
        'Fares according to the type of fuel the vehicle uses',
        'Realtime fuel prices integration',
        'Easy to use'
      ]
    },
    // {
    //   icon: '💡',
    //   title: 'Innovative Tools Suite',
    //   description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
    //   image: '/api/placeholder/400/300',
    //   features: [
    //     'Collaboration Tools',
    //     'Performance Analytics',
    //     'Seamless Integration'
    //   ]
    // },
    // {
    //   icon: '🌐',
    //   title: 'Global Networking',
    //   description: 'Connect with industry experts and like-minded professionals worldwide.',
    //   image: '/api/placeholder/400/300',
    //   features: [
    //     'Expert-led Workshops',
    //     'Community Forums',
    //     'Mentorship Programs'
    //   ]
    // }
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



  
  
 
  return (<><Nav /><Hero />
    <div className="min-h-screen bg-gray-50 relative">
    

  

    
      
  
  
    {/* image Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          🌟 Explore Our Innovative Digital Products 🌟
          </h2>
          <div className="grid  md:grid-cols-1 gap-18">
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
                  <div className="absolute top-4 left-4 bg-white-500 text-white p-2 rounded-full">
                    <span className="text-2xl text-black">{product.icon}</span>
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
                    href="/login" 
                    className="flex items-center justify-center bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Get started to use this tool <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/*     
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
      </section> */}

      <Contact />

      {/* Footer with Social Links */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto flex justify-between items-center">
          <p>© 2024 FirstCabs. All Rights Reserved.</p>
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
    </div></>
  );
};

export default LandingPage;