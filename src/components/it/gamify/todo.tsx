import React, { useState, useEffect, useRef } from 'react';
import { Trash2, PlusCircle, Check, AlertTriangle, RotateCcw, RefreshCw, Timer, Minimize2, Square, X } from 'lucide-react';
import A from './b.mp3';
import B from '../music/aa.mp3';
import Side from '../Sidebar'

interface Task {
  id: string;
  text: string;
  status: 'todo' | 'inProgress' | 'completed';
  startTime?: number;
}

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const [inProgressTask, setInProgressTask] = useState<Task | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (inProgressTask) {
      const startTime = Date.now();
      setTimeElapsed(0);
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeElapsed(elapsed);
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setTimeElapsed(0);
    }
  }, [inProgressTask]);
  const revertCompletedTask = (task: Task) => {
    // First, check if there's an in-progress task
    if (inProgressTask) {
      setErrorMessage('Complete the task in progress first!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
  
    // Explicitly type the reverted task as Task
    const revertedTask: Task = {
      ...task, 
      status: 'inProgress', 
      startTime: Date.now()
    };
  
    // Revert to in-progress first, if no other task is in progress
    setTasks((prevTasks) => 
      prevTasks.map(t => 
        t.id === task.id ? revertedTask : t
      )
    );
    
    // Set the reverted task as the in-progress task
    setInProgressTask(revertedTask);
    startBgMusic();
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        text: newTask,
        status: 'todo'
      };
      setTasks((prevTasks) => [...prevTasks, newTaskObj]);
      setNewTask('');
    }
  };

  const resetTasks = () => {
    setTasks((prevTasks) => prevTasks.map(task => ({ ...task, status: 'todo' })));
    setInProgressTask(null);
    stopBgMusic();
  };

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  const startBgMusic = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.play();
    }
  };

  const stopBgMusic = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const moveTask = (task: Task) => {
    playClickSound();

    if (task.status === 'todo') {
      if (inProgressTask) {
        setErrorMessage('Complete the task in progress first!');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
      
      const updatedTask: Task = { ...task, status: 'inProgress', startTime: Date.now() };
      setTasks((prevTasks) => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
      setInProgressTask(updatedTask);
      startBgMusic();
    } else if (task.status === 'inProgress') {
      setTasks((prevTasks) => 
        prevTasks.map(t => 
          t.id === task.id ? { ...t, status: 'completed' } : t
        )
      );
      setInProgressTask(null);
      stopBgMusic();
    }
  };

  const revertTask = () => {
    if (inProgressTask) {
      setTasks((prevTasks) => 
        prevTasks.map(t => 
          t.id === inProgressTask.id ? { ...t, status: 'todo' } : t
        )
      );
      setInProgressTask(null);
      stopBgMusic();
    }
  };

  const removeTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
    if (inProgressTask?.id === id) {
      setInProgressTask(null);
      stopBgMusic();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (<><Side />  <div className="
    fixed top-0 left-0 right-0 
    bg-gradient-to-r from-green-900 to-indigo-900 
    text-white text-center 
    py-2 
    text-lg 
    font-semibold 
    tracking-wide 
    z-20
  ">
  ←←←←←←(Acess more tools here)
  </div>
    <div className={`
      fixed inset-0 flex justify-center items-center 
     
      bg-gradient-to-br from-indigo-900 via-green-900 to-pink-900
    `}>
     
      <audio ref={clickSoundRef} src={A} preload="auto" />
      <audio ref={bgMusicRef} src={B} preload="auto" />

      <div className={`
        w-full max-w-7xl 
        ${isFullScreen ? 'h-full' : 'max-h-[90vh]'}
        bg-white/10 rounded-xl shadow-2xl 
        overflow-hidden backdrop-blur-sm 
        border border-white/20 flex flex-col
        ${isMinimized ? 'h-12 min-h-[3rem]' : ''}
      `}>
        {/* Window Header */}
        <div className="
          bg-gray-900/80 text-white 
          px-4 py-2 flex justify-between items-center 
          draggable cursor-move
        ">
          <span className="font-semibold">SelfCoach</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMinimize}
              className="hover:bg-gray-700 p-1 rounded"
            >
              <Minimize2 size={16} />
            </button>
            <button 
              onClick={toggleFullScreen}
              className="hover:bg-gray-700 p-1 rounded"
            >
              <Square size={16} />
            </button>
            <button 
              onClick={() => window.close()}
              className="hover:bg-red-600 p-1 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {errorMessage && (
              <div className="bg-red-600/80 p-3 flex items-center justify-center space-x-2">
                <AlertTriangle size={24} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="px-4 py-3 bg-gray-900/50 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={resetTasks}
                  className="bg-red-500 text-white px-3 py-1 rounded flex items-center space-x-2 hover:bg-red-600"
                >
                  <RefreshCw size={16} />
                  <span className="hidden md:inline">Reset All</span>
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Check size={18} className="text-green-400" />
                <span>{completedTasks.length} Completed</span>
              </div>
            </div>
            
            <div className="p-4 flex space-x-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task"
                className="
                  flex-grow p-2 border border-green-700 
                  bg-black/50 rounded text-white 
                  placeholder-green-300
                "
              />
              <button 
                onClick={addTask}
                className="
                  bg-gradient-to-r from-red-500 to-green-600 
                  text-white p-2 rounded 
                  hover:from-red-600 hover:to-green-700
                "
              >
                <PlusCircle size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 flex-grow overflow-auto">
              {/* Todo Tasks */}
              <div className="bg-red-900/50 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4 text-center text-red-300">Todo</h2>
                <div className="space-y-2 max-h-60 md:max-h-96 overflow-y-auto">
                  {todoTasks.map((task, index) => (
                    <div 
                      key={task.id}
                      onClick={() => moveTask(task)}
                      className={`
                        p-3 rounded transition-all duration-300 
                        flex justify-between items-center
                        hover:bg-red-800/30 
                        ${index % 2 === 0 ? 'bg-red-700/30' : 'bg-red-600/30'}
                        select-none cursor-pointer
                      `}
                    >
                      <span className="truncate mr-2">{task.text}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTask(task.id);
                        }}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress Tasks */}
              <div className="bg-yellow-900/70 rounded-lg p-4 md:col-span-2 md:row-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-yellow-300">In Progress</h2>
                  <div className="flex items-center space-x-2">
                    {inProgressTask && (
                      <div className="flex items-center space-x-2 bg-orange-700 px-3 py-1 rounded">
                        <Timer size={16} />
                        <span>{formatTime(timeElapsed)}</span>
                      </div>
                    )}
                    {inProgressTask && (
                      <button 
                        onClick={revertTask}
                        className="bg-orange-600 text-white px-3 py-1 rounded flex items-center space-x-2"
                      >
                        <RotateCcw size={16} />
                        <span className="hidden md:inline">Revert</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {inProgressTasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => moveTask(task)}
                      className="
                        p-4 rounded transition-all duration-300 
                        bg-yellow-800/70 flex justify-between items-center
                        text-xl font-semibold
                        select-none cursor-pointer
                      "
                    >
                      <span className="truncate">{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="bg-green-900/50 rounded-lg p-4">
    <h2 className="text-lg font-bold mb-4 text-center text-green-300">Completed</h2>
    <div className="space-y-2 max-h-60 md:max-h-96 overflow-y-auto">
      {completedTasks.map((task, index) => (
        <div 
          key={task.id}
          className={`
            p-3 rounded transition-all duration-300 
            flex justify-between items-center
            ${index % 2 === 0 ? 'bg-green-800/50' : 'bg-green-700/50'}
            line-through text-gray-400
          `}
        >
          <span className="truncate mr-2">{task.text}</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => revertCompletedTask(task)}
              className="text-yellow-400 hover:text-yellow-600 flex-shrink-0"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={() => removeTask(task.id)}
              className="text-red-400 hover:text-red-600 flex-shrink-0"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default TodoApp;