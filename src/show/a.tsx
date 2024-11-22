import React, { useState, useEffect } from 'react';
import { Terminal, Code, Layers, Cpu } from 'lucide-react';

const TerminalLoadingScreen: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messages = [
    { icon: Terminal, text: 'Loading images ... Modules....' },
    { icon: Code, text: 'Good to see you' },
    { icon: Layers, text: 'You are the main character here' },
    { icon: Cpu, text: 'Register or login to use all the features and tools available here' },
    { icon: Code, text: 'Press Enter or Tap anywhere to continue' },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentMessageIndex = 0;
      let currentCharIndex = 0;
      let typingInterval: NodeJS.Timeout;

      const typeMessage = () => {
        if (currentMessageIndex < messages.length) {
          const currentMessage = messages[currentMessageIndex];
          
          if (currentCharIndex < currentMessage.text.length) {
            setText(prev => prev + currentMessage.text[currentCharIndex]);
            currentCharIndex++;
          } else {
            currentMessageIndex++;
            setStage(prev => prev + 1);
            currentCharIndex = 0;
            setText(prev => prev + '\n');
          }
        } else {
          clearInterval(typingInterval);
          
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      };

      typingInterval = setInterval(typeMessage, Math.random() * 50 + 30);

      return () => clearInterval(typingInterval);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (!isLoading) return null;

  const CurrentIcon = messages[Math.min(stage, messages.length - 1)].icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-xl mx-auto bg-[#0a0a0a] rounded-xl shadow-2xl border-2 border-green-800/50 p-6 transform transition-all duration-500 ease-in-out">
        <div className="flex items-center space-x-4 mb-4">
          <CurrentIcon 
            className={`text-green-500 transition-all duration-300 ${
              stage === 0 ? 'animate-pulse' : 'animate-spin-slow'
            }`} 
            size={32} 
          />
          <div className="text-sm text-green-300 tracking-wide">
            System Initialization: Stage {stage + 1}/{messages.length}
          </div>
        </div>
        <div className="bg-[#111] rounded-lg p-4 border border-green-900/50">
          <div className="flex">
            <div className="mr-4 text-green-400 select-none">
            C:\Reboostify&gt;
            </div>
            <pre className="flex-grow text-green-300 font-mono whitespace-pre-wrap break-words">
              {text}
              <span className="animate-blinking-cursor">|</span>
            </pre>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="h-1 w-full bg-green-900/30 overflow-hidden">
            <div 
              className="h-full bg-green-500 transform transition-transform duration-500 ease-out" 
              style={{ width: `${((stage + 1) / messages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalLoadingScreen;