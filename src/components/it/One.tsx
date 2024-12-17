import React, { useState } from 'react';
import soundFile from './music/click.mp3';
import Side from './Sidebar';

import { Quote, ArrowRight } from 'lucide-react';

const QuoteBox = () => {
  const quotes = [
    {
      text: "until death all defeats are psychological",
      author: "fact"
    },
    {
      text: "It is not the man who has too little, but the man who craves more, that is poor",
      author: "Seneca"
    },
    {
      text: "Mind and it's thought are everything it takes action, decides ,dreams ,hope,feels pain, it is only one that percieves the surrounding , it is the only one that make us us ,it is the only one which belongs to us as everything else can be taken because if the mind is taken away from us then we no longer exist so through it try to gain control over what it can and leave the rest as can only whine about it waste reactions",
      author: "Marcus Aurelius"
    },
    // Add more quotes as needed
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  const showNextQuote = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setFadeIn(false);

    // Play the original click sound
    const quoteAudio = new Audio(soundFile);
    quoteAudio.play();

    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      setFadeIn(true);
    }, 500);

    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (<><Side /><div className='flex'>
    <img 
  src="/logo.png"
                  className="h-10 w-10"
/> <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-900 
bg-clip-text text-transparent">
Thoughts
</h1></div>
  
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-4xl w-full">
          {/* Quote Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <Quote className="w-12 h-12 text-green-500 opacity-50" />
            </div>

            {/* Quote Text */}
            <div 
              className={`transition-opacity duration-500 ease-in-out mb-8 ${
                fadeIn ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="text-white text-xl sm:text-2xl lg:text-3xl text-center font-light leading-relaxed mb-6">
                "{quotes[currentQuoteIndex].text}"
              </p>
              <p className="text-green-500 text-lg sm:text-xl text-center font-medium">
                - {quotes[currentQuoteIndex].author}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-1 rounded-full mb-8">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentQuoteIndex + 1) / quotes.length) * 100}%` 
                }}
              />
            </div>

            {/* Next Quote Button */}
            <div className="flex items-center justify-center">
              <button
                className="group bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                onClick={showNextQuote}
                disabled={isAnimating}
              >
                <span className="text-sm sm:text-base font-medium">Show Next Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quote Counter */}
          <div className="text-center mt-6 text-gray-400">
            {currentQuoteIndex + 1} / {quotes.length}
          </div>
        </div>
      </div>
      </>
  );
};

export default QuoteBox;