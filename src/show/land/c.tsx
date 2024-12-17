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
import Travel from './assets/Travel.png'
import Thought from './assets/thought.png'
const LandingPage = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const productShowcase = [
    {
      
      title: 'Track your actions',
      description: 'Get visual reward too ,   if and only if you break the previous record',
      image: Tracj,
      features: [
        'manually edit the record',
        'reward given boost the dopamine and testosterone',
        'will make you a workaholic'
      ]
    },
    {
      
      title: 'All in one planner',
      description: 'build strategies to achieve anything',
      image: Task,
      features: [
        'good to build one time habits',
        'have progress indicator and timer too',
        'built-in various categories so your tasks are well organised'
      ]
    },
    {
      
      title: 'Store the places',
      description: 'we loose various sites snippets and credentials, now store here and chill',
      image: Store,
      features: [
        'store url of your favourite website',
        'if you use some code snippets repeatedly or prompts can store here',
        'Has hash encrytion so feel free to store credentials too'
      ]
    },
    {
      
      title: 'Take visual notes',
      description: 'Have any idea thought or design just jot down here and save',
      image: Black,
      features: [
        'has colour pallete',
        'touch and pointer friendly',
        'edit your saved illustrations'
      ]
    },
    {
      
      title: 'Discussion Room',
      description: 'join a tribe or create your own',
      image: Dis,
      features: [
        'everyone is ANONYMOUS here ',
        'Bad word filter coming soon',
        'Become moderator too'
      ]
    },
    {
      
      title: 'Flashcards',
      description: 'Now never forget facts',
      image: Flash,
      features: [
        'Memorise formula',
        'Categorise the cards',
        'do spaced repetition'
      ]
    },
    {
      
      title: 'Your Life Gamified',
      description: 'Now you are a playable character',
      image: Gof,
      features: [
        'Earn points',
        'Increase your level',
        'Purchase rewards'
      ]
    },
    {
      
      title: 'Lite Music Player',
      description: 'Play the quality world class music',
      image: Music,
      features: [
        'loop',
        'shuffle',
        'background play support'
      ]
    },
   
    {
   
      title: 'Tinder but better',
      description: 'Socialize',
      image: Tinder,
      features: [
        'Create your profile',
        'Chat',
        '\"Adult content\" so proceed at your own risk'
      ]
    },
    {
      
      title: 'A.I. Assistant',
      description: 'Our new model but still training',
      image: Ai,
      features: [
        'We are training it currently',
        'Intelligent responses',
        'reliable'
      ]
    },
    {
   
      title: 'Watch Reels',
      description: 'Quality content',
      image: Reel,
      features: [
        'Boost in hormones',
        'Can be addictive',
        '18+ content from 5th reel so watch at your own risk'
      ]
    },
    {
   
      title: 'Best Quotes',
      description: 'HAndpicked by us.',
      image:Thought,
      features: [
        'Really make you question your existence',
        'Thoughtfull',
        'will be Updating it daily'
      ]
    },
    {
   
      title: 'Big Screen TImer',
      description: 'Specially made for focusing',
      image:Timer,
      features: [
        'Ticking sound for concentration',
        'Best if wanting to do pomodoros',
        'Clean UI'
      ]
    },
    {
   
      title: 'Follow your Routine',
      description: 'Effiecient way to follow your routune',
      image:Clock,
      features: [
        'Assign your work to time blocks',
        'Understandable UI',
        'Increase your awareness where your time is going and on what things'
      ]
    },
    {
   
      title: 'Step Counter',
      description: 'Track your activity.',
      image:Fit,
      features: [
        'Adjustable according to your device sensor',
        'Good for runs and jumping jacks',
        'Simple ui to avoid distractions'
      ]
    },
    {
   
      title: 'Travel Cost Calculator',
      description: 'Plan the journey accordingly',
      image:Travel,
      features: [
        'Only covering the delhi region soon will add more',
        'Gps Tracking also available',
        'Currently add more features'
      ]
    },
    {
   
      title: 'Todo For flowstate',
      description: 'You will definitely enter the flowstate',
      image:Ambi,
      features: [
        'Ambient',
        'Responsive',
        'Soothing background music'
      ]
    },
    {
   
      title: 'FlowChart Maker',
      description: 'Create Robust FlowChart',
      image:Flow,
      features: [
        'Easy to use',
        'Save the flowcharts locally on your device',
        'More features coming soon'
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
    // { 
    //   icon: <Globe className="w-6 h-6" />, 
    //   url: 'https://website.com' 
    // },
    { 
      icon: <Linkedin className="w-6 h-6" />, 
      url: 'https://www.linkedin.com/in/reboostify/' 
    },
    // { 
    //   icon: <Twitter className="w-6 h-6" />, 
    //   url: 'https://twitter.com' 
    // },
    // { 
    //   icon: <Instagram className="w-6 h-6" />, 
    //   url: 'https://instagram.com' 
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
                    Get started to use this tool <ArrowRight className="ml-2 w-5 h-5 animate-bounce" />
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
          <p>© 2024 Reboostify All Rights Reserved.</p>
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