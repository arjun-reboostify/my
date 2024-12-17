import React, { useState,useRef, useEffect } from 'react';
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
import Side from '../../components/it/Sidebar'
import Tut from '../../components/it/tutorial/landing'
import Tracj from './assets/tracker.png'
import Task from './assets/todo.png'
import Tinder from './assets/tinder.png'
import Store from './assets/store.png'
import Black from './assets/blackboard.png'
import Dis from './assets/discussionroom.png'
import Music from './assets/song.png'
import Ai from './assets/Ai.png'
import Gof from './assets/gof.png'
import Reel from './assets/Reel.png'
import Flash from './assets/flash.png'
import Timer from './assets/TIMER.png'
import Clock from './assets/clockify.png'
import Ambi from './assets/ambi.png'
import Fit from './assets/fit.png'
import Flow from './assets/flow.png'
import Thought from './assets/thought.png'
const LandingPage = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const productShowcase = [
    {
      
      title: 'Advanced Tracker',
      description: 'Get visual reward too ,   if and only if you break the previous record',
      image: Tracj,
      features: [
        'manually set the record',
        'reward given boost the dopamine and testosterone',
        'will make you a workaholic'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Task,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Store,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Black,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Dis,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Flash,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Gof,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Music,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
   
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image: Tinder,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
    {
      
      title: 'Innovative Tools Suite',
      description: 'Comprehensive toolkit designed to streamline your workflow and boost productivity.',
      image: Ai,
      features: [
        'Collaboration Tools',
        'Performance Analytics',
        'Seamless Integration'
      ]
    },
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image: Reel,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image:Thought,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image:Timer,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image:Clock,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image:Fit,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image:Ambi,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
    {
   
      title: 'Global Networking',
      description: 'Connect with industry experts and like-minded professionals worldwide.',
      image:Flow,
      features: [
        'Expert-led Workshops',
        'Community Forums',
        'Mentorship Programs'
      ]
    },
  ];
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

  const [scale, setScale] = useState(1); // Initial scale is 1
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Calculate scale based on scroll position
            const scrollY = window.scrollY;
            const scaleValue = Math.max(0.8, 1 - scrollY / 1000); // Scale from 1 to 0.8
            setScale(scaleValue);
          }
        });
      },
      { threshold: [0, 0.5, 1] } // Trigger at different parts of intersection
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  
  
 
  return (<><Side /><Tut /><Nav /><Hero />
    <div className="min-h-screen bg-gray-50 relative">
    

  

    
      
  
  
    {/* image Showcase */}
      <section className="py-5 bg-gradient-to-br from-black via-green-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-5 text-white ">
          Tools We Offer
          </h2>
          <div className="grid  md:grid-cols-3 gap-18">
            {productShowcase.map((product, index) => (
              <div    
                key={index} 
                className="bg-black rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl"
              >
                <div ref={imageRef} className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-90 object-cover"
                  />
                 
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {product.title}
                  </h3>
                  <p className="text-white mb-6">
                    {product.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="flex items-center text-white"
                      >
                        <ArrowRight className="mr-2 w-5 h-5 text-white" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <a 
                    href="/login" 
                    className="flex items-center justify-center bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
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