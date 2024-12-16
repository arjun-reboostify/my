import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import D from './assets/bike.png'
// import { ReactComponent as HeroVisual } from './assets/phone.svg';
const HeroSection: React.FC = () => {
  const [showHeading, setShowHeading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeading(false);
      setShowDescription(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (<><div className="h-[8vh] bg-black

 p-6 visibility-hidden"></div>
    <div className="h-[60vh] flex flex-col lg:flex-row items-center justify-center p-6 bg-gradient-to-br from-black via-black to-green-900

">
      <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 mb-8 lg:mb-0 lg:pr-12">
        {showHeading && (
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 
            animate-fade-in transform transition-all duration-700 
            hover:scale-105 cursor-pointer"
          >
            Innovative Solutions 
            <ArrowRight className="inline-block ml-3 text-blue-600 animate-bounce" />
          </h1>
        )}

        {showDescription && (
          <div 
            className="animate-slide-up opacity-0 transform transition-all 
            duration-700 ease-out"
          >
            <blockquote 
              className="text-xl md:text-2xl lg:text-3xl italic text-gray-700 
              border-l-4 border-blue-500 pl-4"
            >
              "Transforming challenges into opportunities through cutting-edge technology 
              and creative problem-solving."
            </blockquote>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center">
         <div className="relative w-25 h-25">
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50 rounded-full"></div>
        {/* Image */}
        <img src={D} alt="Icon" className="w-25 h-25 object-cover rounded-full" />
      </div>
      
          {/* <HeroVisual className="w-30 h-60" /> */}
        </div>
   
    </div>
    </>
  );
};

export default HeroSection;