import Fomb from './music/Sunder - Really Slow Motion.mp3'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, Volume2, VolumeX, Clock, Code, 
  X, Pause, Play, RotateCcw 
} from 'lucide-react';
import Side from './Sidebar'

interface Experience {
  id: number;
  title: string;
  description: string;
  bgSound: string;
  tags: string[];
  duration: string;
  technologies: string[];
  highlights: string[];
  color: string;
}

const experiences: Experience[] = [
  // {
  //   id: 1,
  //   title: "Aquiring Transcendental Knowledge",
  //   description: "Be in the battle be in the suck there are 24 hours were you have to be with your mind Well your mind can get attached to something it like not seeing how shallow it is so to gain the meaning fullness and perform activities which i cannot control through just a mere screen i created this experience section so you want to get experience of having transcendental knowledge so here we enter first of all sit with legg crossed and back againt a perpendicular wall you just need a writing system and information source so basically just write out the question you want the ability to solve them then search them in the source read watch whatever you want untill you reach the solution ",
  //   bgSound: Fomb,
  //   tags: ["will power ", "third person view ","self control"],
  //   duration: "5 hours",
  //   technologies: ["Pen","CardBoard","paper","Mobile"],
  //   highlights: [
  //     "New Pipe From f droid",
  //     "browser knowing filetype browsing ",
  //     "keyboard with audio input"
  //   ],
  //   color: "bg-blue-900"
  // },
  {
    id: 2,
    title: "Managing ",
    description: "i dont know what to write test tes tets ststststst.\n\nUtilized data-driven approaches to prioritize features, conducted user research, and implemented agile methodologies to accelerate product development cycles.\n\nManaged complex stakeholder relationships and translated technical complexities into clear, actionable strategies.",
    bgSound: Fomb,
    tags: ["Product Strategy", "UX Research", "Agile"],
    duration: "2 Years",
    technologies: ["Jira", "Figma", "Mixpanel", "Amplitude"],
    highlights: [
      "Led 3 major product launches",
      "Improved user retention by 25%",
      "Developed comprehensive product strategy"
    ],
    color: "bg-green-900"
  },
];

const ExperienceTiles: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [displayText, setDisplayText] = useState<string>("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setTimerActive(true);
    setTimerPaused(false);
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      setTimerPaused(true);
    }
  };

  const resumeTimer = () => {
    startTimer();
  };

  const resetTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimer(0);
    setTimerActive(false);
    setTimerPaused(false);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTileClick = (experience: Experience) => {
    setSelectedExperience(experience);
    setDisplayText("");
    setIsAudioPlaying(true);
    resetTimer();
    startTimer();
    
    if (audioRef.current) {
      audioRef.current.src = experience.bgSound;
      audioRef.current.loop = true;
      audioRef.current.play();
    }
  };

  const handleClose = () => {
    setSelectedExperience(null);
    setIsAudioPlaying(false);
    resetTimer();
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (selectedExperience) {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < selectedExperience.description.length) {
          setDisplayText(prev => prev + selectedExperience.description[index]);
          index++;

          if (descriptionRef.current) {
            descriptionRef.current.scrollTop = descriptionRef.current.scrollHeight;
          }
        } else {
          clearInterval(typingInterval);
        }
      }, Math.random() * 50 + 30);

      return () => clearInterval(typingInterval);
    }
  }, [selectedExperience]);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const renderExperienceDetails = () => {
    if (!selectedExperience) return null;

    return (
      <div className="relative flex flex-col md:flex-row w-full h-[80vh] max-h-[800px]">
        {/* Timer Section */}
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 
          ${selectedExperience.color} px-6 py-2 rounded-full flex items-center space-x-4`}>
          <span className="text-white text-xl font-mono">
            {formatTime(timer)}
          </span>
          <div className="flex space-x-2">
            {!timerActive || timerPaused ? (
              <button 
                onClick={timerPaused ? resumeTimer : startTimer}
                className="text-white hover:text-gray-200"
              >
                <Play size={20} />
              </button>
            ) : (
              <button 
                onClick={pauseTimer}
                className="text-white hover:text-gray-200"
              >
                <Pause size={20} />
              </button>
            )}
            <button 
              onClick={resetTimer}
              className="text-white hover:text-gray-200"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div 
          ref={descriptionRef}
          className="w-full md:w-2/3 bg-gray-900 text-green-400 font-mono p-6 overflow-y-auto custom-scrollbar relative"
        >
          {/* Audio and Close Controls */}
          <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm flex justify-between items-center pb-4">
            <h2 className="text-2xl md:text-3xl font-bold">{selectedExperience.title}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={toggleAudio} 
                className="hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                {isAudioPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <button 
                onClick={handleClose} 
                className="hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          {/* Description Text */}
          <p className="typing-text">{displayText}|</p>
          
          <div className="mt-4 flex space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock size={16} />
              <span>{selectedExperience.duration}</span>
            </div>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-800 text-gray-300 p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {/* Technologies */}
            <div>
              <h3 className="font-bold mb-2 flex items-center">
                <Code size={16} className="mr-2" /> Required Extrinsic Gears
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedExperience.technologies.map(tech => (
                  <span 
                    key={tech} 
                    className="bg-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="font-bold mb-2">Required Software</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedExperience.highlights.map(highlight => (
                  <li key={highlight} className="text-sm">{highlight}</li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-bold mb-2">Required Intrinsic Gears</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExperience.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (<><Side />
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <audio ref={audioRef} className="hidden" />
      
      <AnimatePresence>
        {!selectedExperience ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {experiences.map(exp => (
              <motion.div
                key={exp.id}
                className={`${exp.color} text-white p-6 rounded-xl cursor-pointer hover:opacity-90 transition-all`}
                onClick={() => handleTileClick(exp)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h2 className="text-2xl font-bold mb-2">{exp.title}</h2>
                <p className="text-sm opacity-70">{exp.duration}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-6xl h-[80vh] max-h-[800px] rounded-xl overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {renderExperienceDetails()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default ExperienceTiles;