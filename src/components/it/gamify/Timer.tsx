import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, Pause, RefreshCw, Volume2, VolumeX, Music } from 'lucide-react';

// Audio imports
import alarmSoundFile from "./b.mp3";
import interactionSoundFile from "../music/click.mp3";
import musicFile from "./ticking-slow.mp3";
import Side from '../Sidebar'

export default function PomodoroTimer() {
  // Configuration
  const DEFAULT_WORK_TIME = 45 * 60; // 45 minutes
  const DEFAULT_BREAK_TIME = 5 * 60; // 5 minutes

  // State Management
  const [time, setTime] = useState(DEFAULT_WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  // Audio References
  const alarmSound = useRef(new Audio(alarmSoundFile));
  const interactionSound = useRef(new Audio(interactionSoundFile));
  const musicSound = useRef(new Audio(musicFile));

  // Configure music to loop
  useEffect(() => {
    musicSound.current.loop = true;
  }, []);

  // Restore timer state from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem("pomodoro-time");
    const savedIsRunning = localStorage.getItem("pomodoro-isRunning");
    const savedOnBreak = localStorage.getItem("pomodoro-onBreak");

    if (savedTime) setTime(Number(savedTime));
    if (savedIsRunning) setIsRunning(JSON.parse(savedIsRunning));
    if (savedOnBreak) setOnBreak(JSON.parse(savedOnBreak));
  }, []);

  // Save timer state to localStorage
  useEffect(() => {
    localStorage.setItem("pomodoro-time", time.toString());
    localStorage.setItem("pomodoro-isRunning", JSON.stringify(isRunning));
    localStorage.setItem("pomodoro-onBreak", JSON.stringify(onBreak));
  }, [time, isRunning, onBreak]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Time is about to end
            if (onBreak) {
              // End of break, reset to work time
              setTime(DEFAULT_WORK_TIME);
              setOnBreak(false);
            } else {
              // End of work time, switch to break
              setTime(DEFAULT_BREAK_TIME);
              setOnBreak(true);
            }
            
            // Stop the timer
            setIsRunning(false);
            
            // Play alarm if sound is enabled
            if (soundEnabled) {
              alarmSound.current.play();
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onBreak, soundEnabled]);

  // Utility Functions
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    // Only show hours if present
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Sound and Interaction Methods
  const playInteractionSound = () => {
    if (soundEnabled) {
      interactionSound.current.play();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    playInteractionSound();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setOnBreak(false);
    setTime(DEFAULT_WORK_TIME);
    
    // Stop music if it's playing
    if (musicPlaying) {
      musicSound.current.pause();
      musicSound.current.currentTime = 0;
      setMusicPlaying(false);
    }
    
    playInteractionSound();
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    playInteractionSound();
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      musicSound.current.pause();
      musicSound.current.currentTime = 0;
      setMusicPlaying(false);
    } else {
      musicSound.current.play();
      setMusicPlaying(true);
    }
    playInteractionSound();
  };

  const toggleControls = () => {
    setIsControlsOpen(!isControlsOpen);
    playInteractionSound();
  };

  return (<><Side />
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      {/* Large Countdown Overlay */}
      <div className="flex-grow flex items-center justify-center relative w-full h-full">
        <div className="text-center w-full px-4">
          <div 
            className="text-xl sm:text-2xl md:text-3xl mb-2 uppercase tracking-widest opacity-70 text-center"
          >
            {onBreak ? "Break Time" : "Rotate your device"}
          </div>
          <div 
            className="font-mono w-full text-center flex items-center justify-center"
            style={{ 
              fontSize: 'clamp(3rem, 100vw, 80vmin)', 
              fontVariantNumeric: 'tabular-nums',
              lineHeight: '0.9',
              maxWidth: '100%',
              maxHeight: '95%',
            }}
          >
            {formatTime(time)}
          </div>
        </div>

        {/* Small Control Trigger Button */}
        <button 
          onClick={toggleControls}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
            bg-gray-800 hover:bg-gray-700 text-white 
            rounded-full p-2 sm:p-3 transition duration-300 
            flex items-center justify-center
            shadow-lg hover:shadow-xl z-10"
        >
          <Settings size={window.innerWidth < 640 ? 20 : 24} />
        </button>
      </div>

      {/* Popout Controls */}
      {isControlsOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 
            flex items-center justify-center z-50 
            transition-all duration-300"
          onClick={toggleControls}
        >
          <div 
            className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl 
              flex flex-col items-center space-y-4 sm:space-y-6
              w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Timer Controls</h2>
            
            <div className="flex space-x-2 sm:space-x-4">
              <button
                onClick={toggleTimer}
                className="bg-gray-800 hover:bg-gray-700 text-white 
                  font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-full 
                  flex items-center justify-center 
                  transition duration-300"
              >
                {isRunning ? 
                  <Pause size={window.innerWidth < 640 ? 20 : 24} /> : 
                  <Play size={window.innerWidth < 640 ? 20 : 24} />
                }
              </button>
              
              <button
                onClick={resetTimer}
                className="bg-red-900 hover:bg-red-800 text-white 
                  font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-full 
                  flex items-center justify-center 
                  transition duration-300"
              >
                <RefreshCw size={window.innerWidth < 640 ? 20 : 24} />
              </button>
              
              <button
                onClick={toggleSound}
                className={`${
                  soundEnabled ? "bg-green-900" : "bg-gray-900"
                } hover:bg-green-800 text-white 
                  font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-full 
                  flex items-center justify-center 
                  transition duration-300`}
              >
                {soundEnabled ? 
                  <Volume2 size={window.innerWidth < 640 ? 20 : 24} /> : 
                  <VolumeX size={window.innerWidth < 640 ? 20 : 24} />
                }
              </button>
              
              <button
                onClick={toggleMusic}
                className={`${
                  musicPlaying ? "bg-blue-900" : "bg-gray-900"
                } hover:bg-blue-800 text-white 
                  font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-full 
                  flex items-center justify-center 
                  transition duration-300`}
              >
                <Music size={window.innerWidth < 640 ? 20 : 24} />
              </button>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-base text-gray-400">
                {onBreak ? "Break Session" : "Work Session"}
              </p>
              <p className="text-xs text-gray-500">
                Click outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}