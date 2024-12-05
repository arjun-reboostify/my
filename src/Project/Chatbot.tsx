import { useState, useEffect, useRef } from 'react';
import { 
  Camera, XCircle, Download, Trash, Video, Mic, 
  Settings, Image as ImageIcon, Sparkles, Layout, Minimize2,
  Maximize2, Volume2, VolumeX, RefreshCcw, Pause,
  Play, Square, Sliders, SunMoon, Layers, Save,
  RotateCcw, Share2, Filter, Clock, Info
} from 'lucide-react';
import Chat from '../components/it/Chat'
import Ai from '../components/it/Quote'

const SmartChatBot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [Open, setOpen] = useState<boolean>(false);
  
  // Create separate refs for each div
  const chatToggleRef = useRef<HTMLDivElement>(null);
  const aiToggleRef = useRef<HTMLDivElement>(null);

  // Close chat when clicking outside
  useEffect(() => {
    const handleChatClickOutside = (event: MouseEvent) => {
      if (chatToggleRef.current && !chatToggleRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (Open) {
      document.addEventListener("mousedown", handleChatClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleChatClickOutside);
    };
  }, [Open]);

  // Close AI quote when clicking outside
  useEffect(() => {
    const handleAiClickOutside = (event: MouseEvent) => {
      if (aiToggleRef.current && !aiToggleRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleAiClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleAiClickOutside);
    };
  }, [isOpen]);

  return (<>
    <div 
      ref={chatToggleRef} 
      className="fixed top-[4%] left-[0] z-[9999]"
    >
      <button
        onClick={() => setOpen(!Open)}
        className="bg-transparent text-white p-3 rounded-full shadow-lg focus:outline-none z-[9999]"
      >
        {Open ? '❌' : '💬 '}
      </button>

      {Open && (<Chat />)}
    </div>
    
    <div
      ref={aiToggleRef}
      className="fixed top-[95%] left-[0%] z-[9999] flex flex-col items-start"
    >
      {isOpen && (
        <div className="absolute bottom-[1500%]">
          <Ai />
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent text-white p-3 rounded-full shadow-lg focus:outline-none z-[9999]"
      >
        {isOpen ? "❌" : "🤖"}
      </button>
    </div>
    </>
  );
};

export default SmartChatBot;